import { useEffect } from "react";
import { Link, useRoute } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { getArticleBySlug } from "@/services/blog.service";
import { RichText } from "@/lib/rich-text";
import chrome from "@/content/blog-chrome.json";

export default function BlogDetail() {
  const { language } = useLanguage();
  const lang = language;
  const pick = (f: { es: string; en: string }) => f[lang] ?? f.es;

  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug ?? "";
  const article = getArticleBySlug(slug);

  useEffect(() => {
    const heading = article ? pick(article.title) : pick(chrome.notFoundTitle);
    document.title = heading + pick(chrome.docTitleSuffix);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [lang, slug, article]);

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
            {pick(chrome.notFoundTitle)}
          </h1>
          <p className="text-muted-foreground mb-8">{pick(chrome.notFoundText)}</p>
          <Link href="/blog">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full gap-2">
              <ArrowLeft className="h-4 w-4" />
              {pick(chrome.notFoundCta)}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link href="/blog">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              {pick(chrome.backToBlog)}
            </button>
          </Link>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {article.date[language] ?? article.date.es}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {article.author}
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            {article.title[language] ?? article.title.es}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-lg text-muted-foreground leading-relaxed mb-10 text-justify">
            {article.excerpt[language] ?? article.excerpt.es}
          </p>
          <div className="text-foreground/90 leading-relaxed text-justify space-y-1">
            <RichText>{article.content[language] ?? article.content.es}</RichText>
          </div>

          <div className="mt-16 pt-8 border-t border-border">
            <Link href="/blog">
              <Button variant="ghost" className="text-primary hover:bg-primary/10 gap-2 rounded-full">
                <ArrowLeft className="h-4 w-4" />
                {pick(chrome.backToBlog)}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
