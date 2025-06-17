import { useSignal } from "@preact/signals";
import {
  Article,
  getDefaultArticle,
  isRequiredField,
} from "../models/Article.ts";
import { ArticleItem } from "./ArticleItem.tsx";

type SubmitMode = "home" | "reset" | "nothing";

export default function ArticleForm(props: {
  defaultValue?: Article;
  enablePreview?: boolean;
  mode: SubmitMode;
  onArticleSubmit?: (article: Article) => boolean | Promise<boolean>;
}) {
  let formEl: HTMLFormElement | null;

  const status = useSignal("idle");
  const defaultArticle = props.defaultValue ?? getDefaultArticle();
  const article = useSignal<Article>(
    defaultArticle,
  );

  const toFormattedTime = (timeStr: string) => {
    const validRegex = /^[\d|:]+$/;
    const onlyNumRegex = /^\d+$/;
    if (!validRegex.test(timeStr)) return "  :  ";
    let hour = "  ";
    let minute = "  ";
    if (onlyNumRegex.test(timeStr)) {
      if (timeStr.length >= 4) {
        hour = timeStr.substring(timeStr.length - 4, timeStr.length - 2);
        minute = timeStr.substring(timeStr.length - 2, timeStr.length);
      } else if (timeStr.length >= 2) {
        hour = timeStr.substring(0, timeStr.length - 2);
        minute = timeStr.substring(timeStr.length - 2, timeStr.length);
      } else {
        hour = "  ";
        minute = timeStr.substring(0, timeStr.length);
      }
    } else {
      const commaSplitted = timeStr.split(":");
      hour = commaSplitted.length >= 1 ? commaSplitted[0] : "";
      minute = commaSplitted.length >= 2 ? commaSplitted[1] : "";
    }

    const hourNum = Math.max(0, Math.min(Number(hour), 24));
    const minuteNum = Math.max(0, Math.min(Number(minute), 60));

    return hourNum.toString().padStart(2, "0") + ":" +
      minuteNum.toString().padStart(2, "0");
  };

  async function handleSubmit(e: Event) {
    if (!formEl) return;
    e.preventDefault();
    const formData = new FormData(formEl);
    const article = Object.assign(
      defaultArticle,
      Object.fromEntries(
        formData.entries(),
      ) as unknown as Article,
    );

    const result = await props.onArticleSubmit?.(article);
    status.value = result ? "submitted" : "error";
    if (result) {
      switch (props.mode) {
        case "home":
          location.replace("/");
          break;
        case "reset":
          formEl.reset();
          break;
        case "nothing":
          break;
      }
    }
  }

  function handleChange() {
    if (!formEl) return;
    const formData = new FormData(formEl);
    article.value = Object.fromEntries(
      formData.entries(),
    ) as unknown as Article;
  }

  return (
    <div class="fl-row">
      <div class="fl-col form-root" style={{ gap: "1rem" }}>
        <p style={{ fontWeight: "bold" }}>PREVIEW</p>
        <ArticleItem article={article.value} preview />
      </div>

      <form
        ref={(ref) => formEl = ref}
        class="fl-col form-side"
        onSubmit={handleSubmit}
        style={{ gap: "8px" }}
      >
        <div class="fl-row">
          <label htmlFor="date">
            DATE
          </label>
          <input
            name="date"
            type="date"
            autoComplete="off"
            defaultValue={article.peek().date}
            onInput={() => handleChange()}
            required={isRequiredField("date")}
          />
        </div>

        <div class="fl-row">
          <label htmlFor="author">
            AUTHOR
          </label>
          <input
            name="author"
            type="text"
            defaultValue={article.peek().author}
            onInput={() => handleChange()}
            required={isRequiredField("author")}
          />
        </div>

        <div class="fl-row">
          <label htmlFor="title">
            TITLE
          </label>
          <input
            name="title"
            type="text"
            defaultValue={article.peek().title}
            onInput={() => handleChange()}
            required={isRequiredField("title")}
          />
        </div>

        <div class="fl-row">
          <label htmlFor="in_time">
            TIME
          </label>
          <input
            name="in_time"
            type="text"
            autoComplete="off"
            defaultValue={article.peek().in_time}
            onInput={() => handleChange()}
            onBlur={(e) => {
              e.currentTarget.value = toFormattedTime(e.currentTarget.value);
            }}
            required={isRequiredField("in_time")}
            style={{ width: "50px" }}
          />
          <p style={{ marginLeft: "4px", marginRight: "4px" }}>～</p>
          <input
            name="out_time"
            type="text"
            autoComplete="off"
            defaultValue={article.peek().out_time}
            onInput={() => handleChange()}
            onBlur={(e) => {
              e.currentTarget.value = toFormattedTime(e.currentTarget.value);
            }}
            required={isRequiredField("out_time")}
            style={{ width: "50px" }}
          />
        </div>

        <div class="fl-col">
          <label htmlFor="content" style={{ fontWeight: "bold" }}>
            CONTENT
          </label>
          <textarea
            name="content"
            type="text"
            autoComplete="off"
            style={{ height: "300px", resize: "vertical" }}
            defaultValue={article.peek().content}
            onInput={() => handleChange()}
            onKeyDown={(e) => {
              if (e.key == "Tab") {
                e.preventDefault();
                const input = e.currentTarget;
                var start = input.selectionStart;
                var end = input.selectionEnd;

                // set textarea value to: text before caret + tab + text after caret
                input.value = input.value.substring(0, start) +
                  "\t" + input.value.substring(end);

                // put caret at right position again
                input.selectionStart =
                  input.selectionEnd =
                    start + 1;
              }
            }}
            required={isRequiredField("content")}
          >
            {article.peek().content}
          </textarea>
        </div>

        <div class="fl-row">
          <label htmlFor="tags">
            TAGS
          </label>
          <input
            name="tags"
            type="text"
            autoComplete="off"
            defaultValue={article.peek().tags}
            onInput={(e) => {
              handleChange();
            }}
            required={isRequiredField("tags")}
          />
        </div>

        <div class="fl-row" style={{ gap: "16px" }}>
          <button type="submit" style={{ width: "80px" }}>
            SUBMIT
          </button>
          <p>{status}</p>
        </div>
      </form>
    </div>
  );
}
