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

export function insertLog(article: Article) {
  const empties = new Array(articleFields.length).fill("?");

  db.query(
    `INSERT INTO logs (${articleFields.join(", ")}) VALUES (${
      empties.join(", ")
    })`,
    articleAsArray(article),
  );
}

export function editLog(id: string, article: Article) {
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
  return entries.length > 0 ? entries[0] as unknown as ArticleRow : undefined;
}

export function getLogs(): ArticleRow[] {
  const entries = db.queryEntries("SELECT * FROM logs ORDER BY id DESC");
  return entries.map((entry) => entry as unknown as ArticleRow);
}
