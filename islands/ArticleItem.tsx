import { useSignal } from "@preact/signals";
import { MarkdownText } from "../components/MarkdownText.tsx";
import { TagItem } from "../components/TagItem.tsx";
import { Article } from "../models/Article.ts";
import { PopupMenu } from "./PopupMenu.tsx";

export function ArticleItem(
  props: { article?: Article; id?: string; highlightTag?: string },
) {
  const isIDShown = useSignal(false);

  const article = props.article;
  if (!article) {
    return <p>(error)</p>;
  }

  return (
    <div class="fl-col" style={{ position: "relative" }}>
      {/* <p>{props.article.id}</p> */}
      <h2 style={{ marginBottom: "4px" }}>
        {article.title}
      </h2>
      <div class="fl-row">
        <p style={{ fontSize: "0.80em", color: "#555", whiteSpace: "pre" }}>
          {/* {article.date}・{article.title} */}
          {article.date.replaceAll("-", "/")}
        </p>
        {article.in_time || article.out_time
          ? (
            <p
              style={{ fontSize: "0.80em", color: "#555", whiteSpace: "pre" }}
            >
              {" ・ "}
              {article.in_time} ⇀ {article.out_time}
            </p>
          )
          : null}
      </div>

      <div
        style={{
          marginTop: "16px",
          marginBottom: "32px",
          paddingLeft: "4px",
          // paddingRight: "8px",
        }}
      >
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
                  fontSize: "0.5em",
                  // fontStyle: "italic",
                  fontFamily: "Consolas",
                  color: "#CCC",
                }}
              >
                (No Tags)
              </p>
            )}
        </div>
        <div class="fl-col" style={{ marginRight: "4px" }}>
          <p style={{ textAlign: "end", fontSize: "0.5em", color: "#DDD" }}>
            {article.author}
            {" ・ "}
            {new Date(article.createdAt).toLocaleString("ja-JP")}
          </p>
          {article.updatedAt
            ? (
              <p style={{ textAlign: "end", fontSize: "0.5em", color: "#DDD" }}>
                最終更新: {new Date(article.updatedAt).toLocaleString(
                  "ja-JP",
                )}
              </p>
            )
            : null}
        </div>
      </div>

      <div
        class="fl-row"
        style={{
          position: "absolute",
          right: "4px",
          top: 0,
          gap: "8px",
          visibility: props.id ? "visible" : "collapse",
        }}
      >
        <p
          onPointerEnter={(e) => isIDShown.value = true}
          onPointerOut={(e) => isIDShown.value = false}
          style={{
            fontSize: "0.5em",
            color: "#DDD",
            opacity: isIDShown.value ? 1 : 0,
          }}
        >
          ID: {props.id}
        </p>

        <PopupMenu
          items={[
            {
              title: "Edit",
              onClick: () => {
                location.href = `/edit/${props.id}`;
                return true;
              },
            },
            {
              title: "Delete",
              color: "red",
              onClick: async () => {
                const res = await fetch(`/api/log/${props.id}`, {
                  method: "DELETE",
                  body: JSON.stringify({}),
                });
                if (res.ok) location.reload();
                return true;
              },
            },
          ]}
        />

        {
          /* <div
          class="fl-row w100"
          style={{
            gap: "12px",
            justifyContent: "right",
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
        </div> */
        }
      </div>
    </div>
  );
}
