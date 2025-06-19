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
  isEdit?: boolean;
  mode: SubmitMode;
  onArticleSubmit?: (article: Article) => boolean | Promise<boolean>;
}) {
  let formEl: HTMLFormElement | null;

  const status = useSignal("idle");
  const defaultArticle = props.defaultValue ?? getDefaultArticle();
  const article = useSignal<Article | undefined>(defaultArticle);

  const isTimeEnabled = useSignal(
    defaultArticle.in_time || defaultArticle.out_time ? true : false,
  );

  const toFormattedTime = (timeStr: string) => {
    if (!isTimeEnabled.value) return "";
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

  const getCurrentArticle = (): Article | undefined => {
    if (!formEl) return undefined;
    const formData = new FormData(formEl);
    const articleObj = Object.fromEntries(
      formData.entries(),
    ) as unknown as Article;
    if (props.isEdit) {
      articleObj.createdAt = article.value?.createdAt ?? 0;
      articleObj.updatedAt = Date.now();
    } else {
      articleObj.createdAt = Date.now();
    }

    return articleObj;
  };

  async function handleSubmit(e: Event) {
    e.preventDefault();
    let article = getCurrentArticle();
    if (!article) return;

    article = Object.assign(defaultArticle, article);

    if (!isTimeEnabled.value) {
      article.in_time = undefined;
      article.out_time = undefined;
    }

    const result = await props.onArticleSubmit?.(article);
    status.value = result ? "submitted" : "error";
    if (result) {
      switch (props.mode) {
        case "home":
          location.replace("/");
          break;
        case "reset":
          formEl?.reset();
          break;
        case "nothing":
          break;
      }
    }
  }

  function handleChange() {
    const currentArticle = getCurrentArticle();
    article.value = currentArticle;
  }

  return (
    <div class="article-form-root">
      <div class="fl-col form-root" style={{ gap: "1rem" }}>
        <p style={{ fontWeight: "bold" }}>PREVIEW</p>
        <ArticleItem article={article.value} />
      </div>

      <form
        ref={(ref) => formEl = ref}
        class="fl-col form-side"
        onSubmit={handleSubmit}
        style={{ gap: "8px" }}
      >
        <h2 style={{ marginBottom: "12px" }}>
          {props.isEdit
            ? `「${props.defaultValue?.title ?? "―"}」を編集`
            : `新規記事作成`}
        </h2>

        <div class="fl-row">
          <label htmlFor="date">
            DATE
          </label>
          <input
            name="date"
            type="date"
            autoComplete="off"
            defaultValue={article.peek()?.date}
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
            defaultValue={article.peek()?.author}
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
            defaultValue={article.peek()?.title}
            onInput={() => handleChange()}
            required={isRequiredField("title")}
          />
        </div>

        <div class="fl-row">
          <label htmlFor="time_enabled">
            TIME
          </label>
          <input
            type="checkbox"
            name="time_enabled"
            defaultChecked={isTimeEnabled.peek()}
            onChange={(e) => {
              isTimeEnabled.value = e.currentTarget.checked;
              const a = article.peek();
              if (e.currentTarget.checked && a) {
                a.in_time = defaultArticle.in_time ??
                  getDefaultArticle().in_time;
                a.out_time = defaultArticle.out_time ??
                  getDefaultArticle().out_time;
                article.value = a;
              }
            }}
            style={{ marginRight: "16px" }}
          />
          <div
            class="fl-row"
            style={{ opacity: isTimeEnabled.value ? 1 : 0.5 }}
          >
            <input
              name="in_time"
              type="text"
              autoComplete="off"
              disabled={!isTimeEnabled.value}
              defaultValue={isTimeEnabled.value ? article.peek()?.in_time : ""}
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
              disabled={!isTimeEnabled.value}
              defaultValue={isTimeEnabled.value ? article.peek()?.out_time : ""}
              onInput={() => handleChange()}
              onBlur={(e) => {
                e.currentTarget.value = toFormattedTime(e.currentTarget.value);
              }}
              required={isRequiredField("out_time")}
              style={{ width: "50px" }}
            />
          </div>
        </div>

        <div class="fl-col">
          <label htmlFor="content" style={{ fontWeight: "bold" }}>
            CONTENT
          </label>
          <textarea
            name="content"
            type="text"
            autoComplete="off"
            style={{ height: "200px", resize: "vertical" }}
            onInput={() => handleChange()}
            onKeyDown={(e) => {
              if (e.key == "Tab") {
                e.preventDefault();
                const input = e.currentTarget;
                const start = input.selectionStart;
                const end = input.selectionEnd;

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
            {article.peek()?.content}
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
            defaultValue={article.peek()?.tags}
            onInput={(e) => {
              handleChange();
            }}
            required={isRequiredField("tags")}
          />
        </div>

        <div class="fl-row" style={{ gap: "16px", marginTop: "12px" }}>
          <button
            type="submit"
            class="create-button"
            style={{
              fontFamily: "Consolas",
              textDecoration: "none",
              appearance: "none",
            }}
          >
            {props.isEdit ? "Commit Changes" : "Create"}
          </button>
          <p>{status}</p>
        </div>
      </form>
    </div>
  );
}
