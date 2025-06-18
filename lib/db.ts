// lib/db.ts
import { Article, ArticleRow, queryableFields } from "../models/Article.ts";

const kv = await Deno.openKv();

export const uuid = () => crypto.randomUUID();

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
  query?: string,
  tagSearch?: boolean,
): Promise<ArticleRow[]> {
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
  const rows: ArticleRow[] = [];
  for await (const res of iter) {
    if (query && query !== "" && !isMatch(res.value)) continue;
    rows.push(res.value);
  }

  return rows;
}

export async function aggregateBy(
  year: string,
  month?: string,
): Promise<ArticleRow[]> {
  const logs = await getLogs();
  return logs.filter((row) => parseYM(row.date) === `${year}-${month}`);
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
