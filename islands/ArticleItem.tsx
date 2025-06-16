import { MarkdownText } from "../components/MarkdownText.tsx";
import { ArticleRow } from "../models/Article.ts";

export function ArticleItem(
  props: { article?: ArticleRow; preview?: boolean },
) {
  const article = props.article;
  if (!article) {
    return <p>(error)</p>;
  }

  return (
    <div class="fl-col" style={{ position: "relative", gap: "12px" }}>
      {/* <p>{props.article.id}</p> */}
      <h1 style={{ fontSize: "1.5em" }}>
        {article.date}・{article.title}
      </h1>
      <p>
        {article.content}
      </p>
      {/* <MarkdownText rawMarkdownStr={article.content} /> */}
      <p style={{ fontSize: "0.75em", color: "gray" }}>
        作成者: {article.author}
      </p>

      <div
        class="fl-row"
        style={{ position: "absolute", right: "12px", top: 0, gap: "12px" }}
      >
        <a
          href={`/edit/${article.id}`}
          style={{ fontSize: "0.75em", color: "gray" }}
        >
          EDIT
        </a>
        <a
          style={{ fontSize: "0.75em", color: "red", pointerEvents: "all" }}
          href="#"
          onClick={async (e) => {
            e.preventDefault();

            const res = await fetch(`/api/log/${article.id}`, {
              method: "DELETE",
              body: JSON.stringify({}),
            });
            console.log(res);

            if (res.ok) location.reload();
          }}
        >
          DELETE
        </a>
      </div>
    </div>
  );
}
