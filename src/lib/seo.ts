// SEO resolution from src/content/seo.json. Used by the runtime head-tags hook
// (src/hooks/useHeadTags.ts) and, via a small adapter, by the build-time
// prerender (scripts/prerender.mjs reads the same JSON directly).
//
// There is NO URL language prefix on this site — language is context+localStorage.
// resolveSeo therefore takes the wouter location (path) and the active language.

import seoData from "@/content/seo.json";
import { absoluteAssetUrl } from "@/lib/media";

export type Lang = "es" | "en";

interface BiText {
  es: string;
  en: string;
}

interface PageOverride {
  es?: { title?: string; description?: string };
  en?: { title?: string; description?: string };
  ogImage?: string;
}

interface SeoData {
  siteUrl: string;
  defaultTitle: BiText;
  defaultDescription: BiText;
  ogImage?: string;
  pages?: Record<string, PageOverride>;
}

const seo = seoData as SeoData;

/** Map a wouter location path to a stable seo.pages key (slug without slash). */
export function routeKey(pathname: string): string {
  const clean = (pathname || "/").split("?")[0].split("#")[0];
  if (clean === "/" || clean === "") return "home";
  return clean.replace(/^\/+/, "").replace(/\/+$/, "");
}

export interface ResolvedSeo {
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  lang: Lang;
}

const baseNoSlash = (): string => {
  // import.meta.env.BASE_URL is "/" or "/repo/"; strip trailing slash.
  const b = (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL ?? "/";
  return b.replace(/\/$/, "");
};

/** Merge seo.json defaults with the optional per-route override for `lang`. */
export function resolveSeo(pathname: string, lang: Lang): ResolvedSeo {
  const key = routeKey(pathname);
  const override = seo.pages?.[key];
  const title = override?.[lang]?.title || seo.defaultTitle[lang] || seo.defaultTitle.es;
  const description =
    override?.[lang]?.description || seo.defaultDescription[lang] || seo.defaultDescription.es;
  const ogImageRef = override?.ogImage || seo.ogImage || "";
  const site = (seo.siteUrl ?? "").replace(/\/$/, "");
  const slug = key === "home" ? "" : `/${key}`;
  const canonical = site + baseNoSlash() + (slug || "/");
  return {
    title,
    description,
    canonical,
    ogTitle: title,
    ogDescription: description,
    ogImage: ogImageRef ? absoluteAssetUrl(ogImageRef) : "",
    lang,
  };
}
