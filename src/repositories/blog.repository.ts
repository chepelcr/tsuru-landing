// The ONLY import site of blog.json.
import data from "@/content/blog.json";

export type BlogArticle = (typeof data.articles)[number];

export function getBlogArticles(): BlogArticle[] {
  return data.articles;
}
