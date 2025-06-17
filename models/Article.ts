export interface Article {
  date: string;
  author: string;
  title: string;
  content: string;
  tags: string; // comma-separated
}

export function getDefaultArticle(): Article {
  const nowDate = new Date();
  const defaultDateStr = nowDate.toLocaleDateString("sv-SE").replaceAll(
    "/",
    "-",
  );
  const defaultAuthorStr = "神野 修平";
  const defaultTitleStr = "日報";

  return {
    date: defaultDateStr,
    title: defaultTitleStr,
    author: defaultAuthorStr,
    content: "",
    tags: "a,b,c,d",
  };
}

export interface ArticleRow extends Article {
  id?: string;
}

export const articleFields = ["date", "author", "title", "content", "tags"];

export function articleAsArray(article: Article): string[] {
  return articleFields.map((fieldName) => {
    return article[fieldName as keyof Article];
  });
}
export function articleAsEntries(article: Article): [string, string][] {
  const entries: { [key: string]: string } = {};
  articleFields.map((fieldName) => {
    entries[fieldName] = article[fieldName as keyof Article];
  });
  return Object.entries(entries);
}

export function isArticleValid(article?: Article): boolean {
  if (!article) return false;
  if (article.date && article.author && article.title && article.content) {
    return true;
  } else {
    return false;
  }
}
