export interface Article {
  createdAt: number;
  updatedAt?: number;
  date: string;
  in_time: string;
  out_time: string;
  author: string;
  title: string;
  content: string;
  tags: string; // comma-separated
}

export function getDefaultArticle(): Article {
  const nowDate = new Date();
  const defaultCreatedAt = Date.now();
  const defaultDateStr = nowDate.toLocaleDateString("sv-SE").replaceAll(
    "/",
    "-",
  );
  const defaultTitleStr = "日報";
  const defaultAuthorStr = "神野 修平";
  const defaultInTimeStr = "08:30";
  const defaultOutTimeStr = "17:20";

  return {
    createdAt: defaultCreatedAt,
    updatedAt: undefined,
    date: defaultDateStr,
    title: defaultTitleStr,
    author: defaultAuthorStr,
    in_time: defaultInTimeStr,
    out_time: defaultOutTimeStr,
    content: "",
    tags: "",
  };
}

export interface ArticleRow extends Article {
  id: string;
}

export const requiredFields: string[] = [
  // "id",
  // "createdAt",
  "date",
  "author",
  // "in_time",
  // "out_time",
  "title",
  "content",
  // "tags",
];

export const queryableFields = [
  // "id",
  // "createdAt",
  "date",
  "author",
  "in_time",
  "out_time",
  "title",
  "content",
  "tags",
];

export function isRequiredField(fieldName: string) {
  return requiredFields.indexOf(fieldName) !== -1;
}
export function isArticleValid(article?: Article): boolean {
  if (!article) return false;
  if (article.date && article.author && article.title && article.content) {
    return true;
  } else {
    return false;
  }
}
