import { useSignal } from "@preact/signals";
import { Article } from "../models/Article.ts";

type SubmitMode = "home" | "reset" | "nothing";

export default function ArticleForm(props: {
  defaultValue?: Article;
  mode: SubmitMode;
  onArticleSubmit: (article: Article) => boolean | Promise<boolean>;
}) {
  const status = useSignal("idle");

  async function handleSubmit(e: Event) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const article = Object.fromEntries(
      formData.entries(),
    ) as unknown as Article;
    const result = await props.onArticleSubmit(article);
    status.value = result ? "submitted" : "error";
    if (result) {
      switch (props.mode) {
        case "home":
          location.replace("/");
          break;
        case "reset":
          form.reset();
          break;
        case "nothing":
          break;
      }
    }
  }

  const nowDate = new Date();
  const defaultDateStr = nowDate.toLocaleDateString("sv-SE").replaceAll(
    "/",
    "-",
  );

  return (
    <form
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
          required
        />
      </div>

      <div class="fl-row">
        <label htmlFor="author" style={{ width: "80px" }}>AUTHOR</label>
        <input
          name="author"
          type="text"
          defaultValue={props.defaultValue?.author ?? "神野 修平"}
          required
        />
      </div>

      <div class="fl-row">
        <label htmlFor="title" style={{ width: "80px" }}>TITLE</label>
        <input
          name="title"
          type="text"
          defaultValue={props.defaultValue?.title ?? `日報`}
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
          required
        />
      </div>

      <div class="fl-row" style={{ gap: "16px" }}>
        <button type="submit" style={{ width: "80px" }}>SUBMIT</button>
        <p>{status}</p>
      </div>
    </form>
  );
}
