import { Handlers } from "$fresh/server.ts";
import { insertLog } from "../../../lib/db.ts";
import { Article, isArticleValid } from "../../../models/Article.ts";

export const handler: Handlers = {
  async POST(req) {
    const data = await req.json();
    const article = data as Article;
    if (!isArticleValid(article)) {
      return new Response("Missing fields", { status: 400 });
    }

    insertLog(article);
    return new Response("OK", { status: 200 });
  },
};
