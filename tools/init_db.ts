// tools/init_db.ts
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { articleFields } from "../models/Article.ts";

const db = new DB("data/logs.sqlite");

const fieldsCheckStr: string = articleFields.map((field) => {
  return `${field} TEXT NOT NULL`;
}).join(",");

db.execute(`
  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ${fieldsCheckStr}
  );
`);

console.log("DB initialized.");
db.close();
