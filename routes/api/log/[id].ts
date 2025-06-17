import { Handlers } from "$fresh/server.ts";
import { deleteLog, editLog, getLog } from "../../../lib/db.ts";
import { Article, isArticleValid } from "../../../models/Article.ts";

export const handler: Handlers = {
  GET(_req, ctx) {
    const { id } = ctx.params;
    const article = getLog(id);
    return new Response(JSON.stringify(article), {
      headers: { "Content-Type": "application/json" },
    });
  },
  async POST(req, ctx) {
    const data = await req.json();
    const { id } = ctx.params;
    const article = data as Article;
    if (!isArticleValid(article)) {
      return new Response("Missing fields", { status: 400 });
    }
    editLog(id, article);
    return new Response("OK", { status: 200 });
  },
  DELETE(_req, ctx) {
    const { id } = ctx.params;
    const article = getLog(id);
    if (!article) {
      return new Response("No Such Article", { status: 400 });
    }
    deleteLog(id);
    return new Response("OK", { status: 200 });
  },
};
