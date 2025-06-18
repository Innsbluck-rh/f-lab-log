import ArticleForm from "./ArticleForm.tsx";

export function CreateForm() {
  return (
    <div class="fl-col ai-center">
      <ArticleForm
        onArticleSubmit={async (article) => {
          const res = await fetch("/api/log/add", {
            method: "POST",
            body: JSON.stringify(article),
          });
          return res.ok;
        }}
        isEdit={false}
        mode="home"
        enablePreview
      />
    </div>
  );
}
