// tools/init_db.ts
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const db = new DB("data/logs.sqlite");

db.execute(`
  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL
  );
`);

console.log("DB initialized.");
db.close();
