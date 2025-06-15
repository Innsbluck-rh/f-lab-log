import Article from "../models/Article.ts";

export function ArticleItem(props: { article: Article }) {
  return (
    <div class="fl-col">
      <p>{props.article.date}</p>
      <h1>{props.article.title}</h1>
      <p>{props.article.content}</p>
    </div>
  );
}
