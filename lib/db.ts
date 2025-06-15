// lib/db.ts
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const db = new DB("data/logs.sqlite");

export function insertLog(date: string, title: string, content: string) {
  db.query(
    "INSERT INTO logs (date, title, content) VALUES (?, ?, ?)",
    [date, title, content],
  );
}

export function getLogs(): {
  id: number;
  date: string;
  title: string;
  content: string;
}[] {
  return db.queryEntries("SELECT * FROM logs ORDER BY id DESC");
}
