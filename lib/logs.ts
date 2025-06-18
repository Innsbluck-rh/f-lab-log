import { Article, ArticleRow, queryableFields } from "../models/Article.ts";
import { kv, uuid } from "./db.ts";

const PREFIX_LOGS = "logs";

function getArticleRow(log: Article): ArticleRow {
  if (log.tags !== "") {
    if (!log.tags.startsWith(",")) log.tags = `,${log.tags}`;
    if (!log.tags.endsWith(",")) log.tags = `${log.tags},`;
  }

  return {
    id: uuid(),
    ...log,
  };
}

export function parseYM(dateStr: string) {
  const date = new Date(dateStr);
  const ym = `${date.getFullYear().toString().padStart(4, "0")}-${
    (date.getMonth() + 1).toString().padStart(2, "0")
  }`;
  return ym;
}

export function insertLog(article: Article) {
  const row = getArticleRow(article);
  kv.set([PREFIX_LOGS, row.id], row);
}

export function editLog(id: string, article: Article) {
  kv.set([PREFIX_LOGS, id], article);
}
export function deleteLog(id: string) {
  kv.delete([PREFIX_LOGS, id]);
}

export async function getLog(id: string): Promise<ArticleRow | null> {
  const kVRow = await kv.get<ArticleRow>([PREFIX_LOGS, id]);
  return kVRow.value;
}

export async function getLogs(
  options?: {
    sortField?: keyof ArticleRow;
    sortOrder?: "asc" | "dsc";
    query?: string;
    tagSearch?: boolean;
    aggregate?: {
      year: string;
      month?: string;
    };
  },
): Promise<ArticleRow[]> {
  const { sortField, sortOrder, query, tagSearch, aggregate } = options ?? {};
  const isMatch = (article: Article): boolean => {
    if (query) {
      if (tagSearch) {
        return article.tags.split(",").indexOf(query) !== -1;
      } else {
        const matched = Object.entries(article).some(([field, value]) => {
          if (queryableFields.includes(field)) {
            const q = field === "tags" ? `,${query},` : query;
            return value.includes(q);
          }
        });

        return matched;
      }
    }

    return false;
  };

  const iter = kv.list<ArticleRow>({ prefix: [PREFIX_LOGS] });
  let rows: ArticleRow[] = [];
  for await (const res of iter) {
    if (query && query !== "" && !isMatch(res.value)) continue;
    rows.push(res.value);
  }

  if (sortField) {
    rows = rows.sort((a, b) => {
      let av = a[sortField];
      let bv = b[sortField];
      if (sortField === "updatedAt") { // fallback for updatedAt
        if (!av) av = a["createdAt"];
        if (!bv) bv = b["createdAt"];
      }
      if (!av || !bv) return 1;
      return av.toString().localeCompare(bv.toString()) *
        (sortOrder === "asc" ? 1 : -1);
    });
  }

  if (aggregate) {
    if (aggregate.month) {
      rows = rows.filter((row) =>
        parseYM(row.date) === `${aggregate.year}-${aggregate.month}`
      );
    } else {
      rows = rows.filter((row) =>
        parseYM(row.date).startsWith(`${aggregate.year}`)
      );
    }
  }

  return rows;
}

export async function getMonthlyCounts(): Promise<{ [ym: string]: number }> {
  const counts: { [ym: string]: number } = {
    // "2025-06": 3,
  };

  const logs = await getLogs();

  logs.forEach((log) => {
    const ym = parseYM(log.date);
    if (counts[ym]) {
      counts[ym]++;
    } else counts[ym] = 1;
  });

  return counts;
}
