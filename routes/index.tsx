import { Handlers, PageProps } from "$fresh/server.ts";
import { ArticleItem } from "../components/ArticleItem.tsx";
import Article from "../models/Article.ts";
import { getLogs } from "../lib/db.ts";

export const handler: Handlers<Article[]> = {
  GET(_req, ctx) {
    const articles = getLogs();
    return ctx.render(articles);
  },
};

export default function Home({ data }: PageProps<Article[]>) {
  return (
    <div class="fl-col" style={{ gap: "3rem" }}>
      {data.map((article, i) => <ArticleItem key={i} article={article} />)}
    </div>
  );
}
