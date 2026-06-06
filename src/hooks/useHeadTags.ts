// Runtime <head> tag manager — ADDITIVE only (no visual change). On mount and
// whenever the resolved SEO changes it sets document.title and upserts the
// description / canonical / og:* meta tags. Wired once at the App level keyed on
// wouter location + language (see App.tsx -> <HeadTags />).
//
// Individual pages (Blog/Contact/Terms/Privacy/Cookies) still set document.title
// themselves; that's fine — they run after this and simply override the default.

import { useEffect } from "react";
import type { ResolvedSeo } from "@/lib/seo";

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  if (!content) return;
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  if (!href) return;
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function useHeadTags(seo: ResolvedSeo) {
  useEffect(() => {
    if (seo.title) document.title = seo.title;
    if (document.documentElement.lang !== seo.lang) document.documentElement.lang = seo.lang;
    upsertMeta("name", "description", seo.description);
    upsertCanonical(seo.canonical);
    upsertMeta("property", "og:title", seo.ogTitle);
    upsertMeta("property", "og:description", seo.ogDescription);
    upsertMeta("property", "og:image", seo.ogImage);
  }, [seo.title, seo.description, seo.canonical, seo.ogTitle, seo.ogDescription, seo.ogImage, seo.lang]);
}
