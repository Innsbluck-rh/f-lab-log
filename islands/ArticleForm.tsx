import { useSignal } from "@preact/signals";
import { Article } from "../models/Article.ts";

type SubmitMode = "home" | "reset" | "nothing";

export default function ArticleForm(props: {
  defaultValue?: Article;
  enablePreview?: boolean;
  mode: SubmitMode;
  onArticleSubmit?: (article: Article) => boolean | Promise<boolean>;
}) {
  let formEl: HTMLFormElement | null;
  let previewEl: HTMLDivElement | null;

  const status = useSignal("idle");

  const rendered = useSignal("");

  async function handleSubmit(e: Event) {
    if (!formEl) return;
    e.preventDefault();
    const formData = new FormData(formEl);
    const article = Object.fromEntries(
      formData.entries(),
    ) as unknown as Article;
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

  async function handleChange() {
    if (!formEl) return;
    const formData = new FormData(formEl);
    const article = Object.fromEntries(
      formData.entries(),
    ) as unknown as Article;

    const res = await fetch("/api/markdown/render", {
      method: "POST",
      body: JSON.stringify({
        content: article.content,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (previewEl) {
        previewEl.setHTMLUnsafe(data.rendered);
        previewEl.style = `${data.css}; white-space: pre;`;
      }
    }
  }

  const nowDate = new Date();
  const defaultDateStr = nowDate.toLocaleDateString("sv-SE").replaceAll(
    "/",
    "-",
  );

  return (
    <div class="fl-col" style={{ gap: "24px" }}>
      <form
        ref={(ref) => formEl = ref}
        class="fl-col form-root"
        onSubmit={handleSubmit}
        style={{ gap: "8px" }}
      >
        <div class="fl-row">
          <label htmlFor="date" style={{ width: "80px" }}>DATE</label>
          <input
            name="date"
            type="date"
            value={props.defaultValue?.date ?? defaultDateStr}
            onInput={() => handleChange()}
            required
          />
        </div>

        <div class="fl-row">
          <label htmlFor="author" style={{ width: "80px" }}>AUTHOR</label>
          <input
            name="author"
            type="text"
            defaultValue={props.defaultValue?.author ?? "神野 修平"}
            onInput={() => handleChange()}
            required
          />
        </div>

        <div class="fl-row">
          <label htmlFor="title" style={{ width: "80px" }}>TITLE</label>
          <input
            name="title"
            type="text"
            defaultValue={props.defaultValue?.title ?? `日報`}
            onInput={() => handleChange()}
            required
          />
        </div>

        <div class="fl-col">
          <label htmlFor="content">
            CONTENT
          </label>
          <textarea
            name="content"
            type="text"
            style={{ height: "300px", resize: "vertical" }}
            value={props.defaultValue?.content ?? ""}
            onInput={() => handleChange()}
            required
          />
        </div>

        <div class="fl-row" style={{ gap: "16px" }}>
          <button type="submit" style={{ width: "80px" }}>SUBMIT</button>
          <p>{status}</p>
        </div>
      </form>

      <div class="fl-col">
        <p>PREVIEW</p>
        <div
          ref={(ref) => previewEl = ref}
          data-color-mode="light"
          data-light-theme="light"
          data-dark-theme="dark"
          class="markdown-body"
          dangerouslySetInnerHTML={{
            __html: rendered.value,
          }}
        >
        </div>
      </div>
    </div>
  );
}
