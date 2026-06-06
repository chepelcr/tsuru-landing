import { getBlogArticles, type BlogArticle } from "@/repositories/blog.repository";

/** All blog articles, ordered by `order`. */
export function listBlogArticles(): BlogArticle[] {
  return [...getBlogArticles()].sort((a, b) => a.order - b.order);
}

/** The first article flagged as featured, if any. */
export function getFeaturedArticle(): BlogArticle | undefined {
  return listBlogArticles().find((a) => a.featured);
}

/** All non-featured articles, ordered by `order`. */
export function listOtherArticles(): BlogArticle[] {
  return listBlogArticles().filter((a) => !a.featured);
}
