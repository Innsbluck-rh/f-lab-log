// lib/db.ts
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import {
  Article,
  articleAsArray,
  articleAsEntries,
  articleFields,
  ArticleRow,
} from "../models/Article.ts";

const db = new DB("data/logs.sqlite");

function getDBFormattedArticle(log: Article): Article {
  if (log.tags !== "") {
    if (!log.tags.startsWith(",")) log.tags = `,${log.tags}`;
    if (!log.tags.endsWith(",")) log.tags = `${log.tags},`;
  }

  return log;
}

function decodeDBFormattedArticle(log: Article): Article {
  if (log.tags !== "") {
    if (log.tags.startsWith(",")) {
      log.tags = log.tags.substring(1);
    }
    if (log.tags.endsWith(",")) {
      log.tags = log.tags.substring(0, log.tags.length - 1);
    }
  }

  return log;
}

export function insertLog(article: Article) {
  article = getDBFormattedArticle(article);
  const empties = new Array(articleFields.length).fill("?");

  db.query(
    `INSERT INTO logs (${articleFields.join(", ")}) VALUES (${
      empties.join(", ")
    })`,
    articleAsArray(article),
  );
}

export function editLog(id: string, article: Article) {
  article = getDBFormattedArticle(article);
  const updateStr = articleAsEntries(article).map(([key, value]) => {
    return `${key} = '${value}'`;
  }).join(", ");

  db.query(
    `UPDATE logs SET ${updateStr} WHERE id = ${id}`,
  );
}
export function deleteLog(id: string) {
  db.query(
    `DELETE FROM logs WHERE id = ${id}`,
  );
}

export function getLog(id: string): ArticleRow | undefined {
  const entries = db.queryEntries(`SELECT * FROM logs WHERE id = ${id}`);
  const log = entries.length > 0
    ? entries[0] as unknown as ArticleRow
    : undefined;

  return log ? decodeDBFormattedArticle(log) : undefined;
}

export function getLogs(query?: string, tagSearch?: boolean): ArticleRow[] {
  if (query && tagSearch) query = `,${query},`;
  const queryStr = query
    ? `WHERE ${
      articleFields.reduce<string[]>((accumulator, field) => {
        const isProhibited = !tagSearch && field === "tags" &&
          query.indexOf(",") !== -1; // コンマが含まれる場合はタグを含めない
        if (!isProhibited) {
          accumulator.push(`${field} LIKE '%${query}%'`);
        }
        return accumulator;
      }, []).join(" OR ")
    }`
    : "";

  const entries = db.queryEntries(
    `SELECT * FROM logs ${queryStr} ORDER BY id DESC`,
  );
  return entries.map((entry) => {
    return decodeDBFormattedArticle(entry as unknown as ArticleRow);
  });
}

export function aggregateBy(year: string, month?: string): ArticleRow[] {
  let condition = "";
  if (month) {
    const ymStr = year.padStart(4, "0") + "-" + month.padStart(2, "0");
    condition = `WHERE strftime('%Y-%m', date) = '${ymStr}'`;
  } else {
    const yStr = year.padStart(4, "0");
    condition = `WHERE strftime('%Y', date) = '${yStr}'`;
  }
  const entries = db.queryEntries(
    `SELECT * FROM logs ${condition}`,
  );

  console.log(`SELECT * FROM logs ${condition}`);
  return entries.map((entry) => {
    return decodeDBFormattedArticle(entry as unknown as ArticleRow);
  });
}

export function getMonthlyCounts(): {
  ym: string;
  count: number;
}[] {
  const entries = db.queryEntries<{
    ym: string;
    count: number;
  }>(
    `SELECT strftime('%Y-%m', date) AS ym, COUNT(date) AS count
    FROM logs GROUP BY ym`,
  );

  return entries;
}
