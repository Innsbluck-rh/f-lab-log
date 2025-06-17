import { useSignal } from "@preact/signals";
import { Article, getDefaultArticle } from "../models/Article.ts";
import { ArticleItem } from "./ArticleItem.tsx";
import { TagItem } from "../components/TagItem.tsx";

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

  function handleChange() {
    if (!formEl) return;
    const formData = new FormData(formEl);
    article.value = Object.fromEntries(
      formData.entries(),
    ) as unknown as Article;
    console.log(article.peek());
  }

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
            defaultValue={article.peek().date}
            onInput={() => handleChange()}
            required
          />
        </div>

        <div class="fl-row">
          <label htmlFor="author" style={{ width: "80px" }}>AUTHOR</label>
          <input
            name="author"
            type="text"
            defaultValue={article.peek().author}
            onInput={() => handleChange()}
            required
          />
        </div>

        <div class="fl-row">
          <label htmlFor="title" style={{ width: "80px" }}>TITLE</label>
          <input
            name="title"
            type="text"
            defaultValue={article.peek().title}
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
            defaultValue={article.peek().content}
            onInput={() => handleChange()}
            required
          >
            {article.peek().content}
          </textarea>
        </div>

        <div class="fl-row" style={{ gap: "16px" }}>
          {article.value.tags.split(",").map((tag, i) => {
            return <TagItem key={i} text={tag} />;
          })}
        </div>
        <input
          name="tags"
          type="text"
          defaultValue={article.peek().tags}
          onInput={() => handleChange()}
          required
        />

        <div class="fl-row" style={{ gap: "16px" }}>
          <button type="submit" style={{ width: "80px" }}>SUBMIT</button>
          <p>{status}</p>
        </div>
      </form>

      <div class="fl-col">
        <p>PREVIEW</p>
        <ArticleItem article={article.value} preview />
      </div>
    </div>
  );
}
