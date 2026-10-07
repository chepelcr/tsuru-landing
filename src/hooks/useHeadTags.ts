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
    const isBrandCard = new URL(seo.ogImage || "/", seo.canonical).pathname === "/brand/social-card.png";
    const imageAlt = seo.lang === "en" ? "Tsuru — Sell at your own pace." : "Tsuru — Vendé a tu ritmo.";
    if (isBrandCard) {
      upsertMeta("property", "og:image:type", "image/png");
      upsertMeta("property", "og:image:width", "1200");
      upsertMeta("property", "og:image:height", "630");
      upsertMeta("property", "og:image:alt", imageAlt);
      upsertMeta("name", "twitter:image:alt", imageAlt);
    } else {
      for (const key of ["og:image:type", "og:image:width", "og:image:height", "og:image:alt", "twitter:image:alt"]) {
        document.head.querySelector(`meta[property="${key}"], meta[name="${key}"]`)?.remove();
      }
    }
    upsertMeta("property", "og:url", seo.canonical);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:locale", seo.lang === "en" ? "en_US" : "es_CR");
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", seo.title);
    upsertMeta("name", "twitter:description", seo.description);
    upsertMeta("name", "twitter:image", seo.ogImage);
    upsertMeta("name", "robots", "index,follow");
    for (const alternate of seo.alternates) {
      let link = document.head.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${alternate.lang}"]`);
      if (!link) { link = document.createElement("link"); link.rel = "alternate"; link.hreflang = alternate.lang; document.head.appendChild(link); }
      link.href = alternate.href;
    }
    let schema = document.getElementById("site-page-schema") as HTMLScriptElement | null;
    if (!schema) { schema = document.createElement("script"); schema.id = "site-page-schema"; schema.type = "application/ld+json"; document.head.appendChild(schema); }
    schema.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", name: seo.title, description: seo.description, url: seo.canonical, inLanguage: seo.lang }).replace(/</g, "\\u003c");
  }, [seo.title, seo.description, seo.canonical, seo.ogTitle, seo.ogDescription, seo.ogImage, seo.lang]);
}
