import { MarkdownText } from "../components/MarkdownText.tsx";
import { TagItem } from "../components/TagItem.tsx";
import { Article } from "../models/Article.ts";

export function ArticleItem(
  props: { article?: Article; id?: string; highlightTag?: string },
) {
  const article = props.article;
  if (!article) {
    return <p>(error)</p>;
  }

  return (
    <div class="fl-col" style={{ position: "relative" }}>
      {/* <p>{props.article.id}</p> */}
      <h1 style={{ fontSize: "1.5em", marginBottom: "4px" }}>
        {/* {article.date}・{article.title} */}
        {article.date.replaceAll("-", "/")}
      </h1>
      <p style={{ fontSize: "0.9em", color: "#555", marginBottom: "10px" }}>
        {article.in_time} ⇀ {article.out_time}
      </p>

      <div style={{ marginTop: "16px", marginBottom: "32px" }}>
        <MarkdownText rawMarkdownStr={article.content} />
      </div>

      <div class="fl-row ai-center">
        {/* <p>tags:</p> */}
        <div
          class="fl-row"
          style={{ gap: "12px", flexGrow: 1 }}
        >
          {article.tags !== ""
            ? article.tags.split(",").map((tag: string, i: number) => {
              return (
                <TagItem
                  key={i}
                  text={tag}
                  highlighted={tag === props.highlightTag}
                />
              );
            })
            : (
              <p
                style={{
                  fontSize: "0.7em",
                  // fontStyle: "italic",
                  fontFamily: "Consolas",
                  color: "#AAA",
                }}
              >
                (No Tags)
              </p>
            )}
        </div>
        <p style={{ fontSize: "0.75em", color: "gray" }}>
          author: {article.author}
        </p>
      </div>

      <div
        class="fl-row"
        style={{
          position: "absolute",
          right: "12px",
          top: 0,
          gap: "12px",
          visibility: props.id ? "visible" : "collapse",
        }}
      >
        <a
          href={`/edit/${props.id}`}
          style={{ fontSize: "0.75em", color: "gray" }}
        >
          EDIT
        </a>
        <a
          style={{ fontSize: "0.75em", color: "red", pointerEvents: "all" }}
          href="#"
          onClick={async (e) => {
            e.preventDefault();

            const res = await fetch(`/api/log/${props.id}`, {
              method: "DELETE",
              body: JSON.stringify({}),
            });
            if (res.ok) location.reload();
          }}
        >
          DELETE
        </a>
      </div>
    </div>
  );
}
