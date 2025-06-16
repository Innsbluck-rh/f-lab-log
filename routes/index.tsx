import { Handlers, PageProps } from "$fresh/server.ts";
import { ArticleItem } from "../islands/ArticleItem.tsx";
import { getLogs } from "../lib/db.ts";
import { ArticleRow } from "../models/Article.ts";

export const handler: Handlers<ArticleRow[]> = {
  GET(_req, ctx) {
    const articles = getLogs();
    return ctx.render(articles);
  },
};

export default function Home(props: PageProps<ArticleRow[]>) {
  return (
    <div class="fl-col ai-center" style={{ gap: "3rem" }}>
      <div class="fl-col articles-root" style={{ gap: "4rem" }}>
        {props.data.map((article, i) => (
          <ArticleItem key={i} article={article} />
        ))}
      </div>
    </div>
  );
}
