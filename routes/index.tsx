import { Handlers, PageProps } from "$fresh/server.ts";
import { ArticleItem } from "../islands/ArticleItem.tsx";
import { getLogs } from "../lib/logs.ts";
import { ArticleRow } from "../models/Article.ts";
import { ArticlesSideContent } from "../islands/ArticlesSideContent.tsx";
import { SortDropdown } from "../islands/SortDropdown.tsx";
import { SortOrderToggle } from "../islands/SortOrderToggle.tsx";

export const handler: Handlers<ArticleRow[]> = {
  async GET(_req, ctx) {
    const sp = ctx.url.searchParams;
    const ym = sp.get("ym");
    const tag = sp.get("tag");
    const query = sp.get("query");

    const sortField = (sp.get("sort") ?? "createdAt") as keyof ArticleRow;
    const sortOrder = sp.get("order") === "asc" ? "asc" : "dsc";

    let articles: ArticleRow[] = [];
    const splitted = ym?.split("-");
    let aggregate = undefined;
    if (splitted) {
      if (splitted.length >= 2) {
        aggregate = {
          year: splitted[0],
          month: splitted[1],
        };
      } else if (splitted.length === 1) {
        aggregate = {
          year: splitted[0],
        };
      }
    }
    if (tag) {
      articles = await getLogs({
        query: tag,
        tagSearch: true,
        sortField,
        sortOrder,
        aggregate,
      });
    } else if (query) {
      articles = await getLogs({
        query: query,
        tagSearch: false,
        sortField,
        sortOrder,
        aggregate,
      });
    } else {
      articles = await getLogs({
        sortField,
        sortOrder,
        aggregate,
      });
    }
    return ctx.render(articles);
  },
};

export default function Home(props: PageProps<ArticleRow[]>) {
  const ym = props.url.searchParams.get("ym");
  const tag = props.url.searchParams.get("tag");
  const query = props.url.searchParams.get("query");

  const sort = props.url.searchParams.get("sort");
  const order = props.url.searchParams.get("order");

  const headline = ym
    ? <p style={{ fontWeight: "bold" }}>{ym} の記事</p>
    : tag
    ? (
      <p>
        <span style={{ fontWeight: "bold", color: "#00bb" }}>#{tag}</span>{" "}
        がついた記事
      </p>
    )
    : query
    ? (
      <p>
        <span style={{ fontWeight: "bold" }}>{query}</span> を含む記事
      </p>
    )
    : null;

  return (
    <div class="page-root">
      <div class="fl-col" style={{ gap: "2rem" }}>
        <div class="fl-row jc-center ai-center" style={{ gap: "8px" }}>
          <div style={{ flexGrow: 1 }}>
            {headline ?? null}
          </div>
          <SortDropdown
            defaultValue={sort ?? undefined}
            basePath={props.url.pathname}
            baseSP={props.url.searchParams.entries().toArray()}
          />
          <SortOrderToggle
            sortOrder={order ?? "dsc"}
            basePath={props.url.pathname}
            baseSP={props.url.searchParams.entries().toArray()}
          />

          {headline
            ? (
              <>
                <p>|</p>
                <a
                  style={{
                    color: "#777",
                    fontSize: "0.8em",
                    padding: 0,
                    margin: 0,
                  }}
                  href="/"
                >
                  一覧に戻る
                </a>
              </>
            )
            : null}
        </div>

        <div class="fl-col articles-root" style={{ gap: "3rem" }}>
          {props.data.length > 0
            ? props.data.map((article, i) => (
              <div class="fl-col" style={{ gap: "16px" }}>
                <ArticleItem
                  key={i}
                  article={article}
                  id={article.id}
                  highlightTag={tag ?? undefined}
                />
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
