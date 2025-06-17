import { Article } from "../models/Article.ts";
import ArticleForm from "./ArticleForm.tsx";

export default function EditForm(
  props: { id: string; defaultValue?: Article },
) {
  return (
    <div class="fl-col ai-center">
      <ArticleForm
        onArticleSubmit={async (article) => {
          const res = await fetch(`/api/log/${props.id}`, {
            method: "POST",
            body: JSON.stringify(article),
          });
          console.log(res);
          return res.ok;
        }}
        mode="home"
        defaultValue={props.defaultValue}
        enablePreview
      />
    </div>
  );
}
