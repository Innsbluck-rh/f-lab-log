import { Handlers, PageProps } from "$fresh/server.ts";
import { ArticleItem } from "../islands/ArticleItem.tsx";
import { aggregateBy, getLogs } from "../lib/db.ts";
import { ArticleRow } from "../models/Article.ts";
import { SearchQueryForm } from "../islands/SearchQueryForm.tsx";
import { ArticlesSideContent } from "../islands/ArticlesSideContent.tsx";

export const handler: Handlers<ArticleRow[]> = {
  async GET(_req, ctx) {
    const sp = ctx.url.searchParams;
    const ym = sp.get("ym");
    const tag = sp.get("tag");
    const query = sp.get("query");
    let articles: ArticleRow[] = [];
    if (ym) {
      const splitted = ym.split("-");
      articles = splitted.length >= 2
        ? await aggregateBy(splitted[0], splitted[1])
        : await getLogs();
    } else if (tag) {
      articles = await getLogs(tag, true);
    } else if (query) {
      articles = await getLogs(query, false);
    } else {
      articles = await getLogs();
    }
    return ctx.render(articles);
  },
};

export default function Home(props: PageProps<ArticleRow[]>) {
  const ym = props.url.searchParams.get("ym");
  const tag = props.url.searchParams.get("tag");
  const query = props.url.searchParams.get("query");

  const headlineText = ym
    ? `${ym} の記事`
    : tag
    ? `#${tag} がついた記事`
    : query
    ? `"${query}"を含む記事`
    : "";

  return (
    <div class="fl-row">
      <div class="fl-col" style={{ gap: "2rem" }}>
        {headlineText !== ""
          ? (
            <div class="fl-row jc-center">
              <p style={{ fontWeight: "bold", flexGrow: 1 }}>{headlineText}</p>
              <a style={{ color: "#777", fontSize: "0.9em" }} href="/">
                一覧に戻る
              </a>
            </div>
          )
          : null}
        <div class="fl-col articles-root" style={{ gap: "3rem" }}>
          {props.data.length > 0
            ? props.data.map((article, i) => (
              <div class="fl-col" style={{ gap: "24px" }}>
                <ArticleItem key={i} article={article} />
                <div
                  class="fl-row w100"
                  style={{
                    height: "1px",
                    backgroundColor: "#DDD",
                  }}
                >
                </div>
              </div>
            ))
            : (
              <>
                <div>
                  <p
                    style={{
                      color: "#777",
                      fontStyle: "italic",
                    }}
                  >
                    記事がありません。
                  </p>
                </div>
              </>
            )}
        </div>
      </div>

      <ArticlesSideContent tag={tag ?? undefined} query={query ?? undefined} />
    </div>
  );
}
