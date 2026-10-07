import { getContent } from "@/repositories/content.repository";
// Published SEO is shared by the browser and build-time browser renderer.
// Spanish retains the established root URLs; English uses /en.

const seoData = getContent<typeof import("@/content/seo.json")>("seo");
import { absoluteAssetUrl } from "@/lib/media";
import { legalContent, type LegalKey } from "@/legal/LegalBody";

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
  alternates: { lang: string; href: string }[];
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
  const legalKeys: Record<string, LegalKey> = { privacidad: "privacy", terminos: "terms", cookies: "cookies", contacto: "contact" };
  const legal = legalKeys[key] ? legalContent.pages[legalKeys[key]] : undefined;
  const pageNames: Record<string, BiText> = {
    funcionalidades: { es: "Funcionalidades", en: "Features" },
    planes: { es: "Planes y precios", en: "Plans and pricing" },
    ferias: { es: "Ferias", en: "Fairs" },
    comunidad: { es: "Comunidad", en: "Community" },
    "quienes-somos": { es: "Quiénes somos", en: "About us" },
    ejemplos: { es: "Ejemplos", en: "Examples" },
  };
  const name = pageNames[key]?.[lang];
  const title = legal ? `${legal.title[lang]} — Tsuru` : override?.[lang]?.title || (name ? `${name} — Tsuru` : seo.defaultTitle[lang] || seo.defaultTitle.es);
  const description =
    legal?.description[lang] || override?.[lang]?.description || (name ? `${name}. ${seo.defaultDescription[lang]}` : seo.defaultDescription[lang] || seo.defaultDescription.es);
  const ogImageRef = override?.ogImage || seo.ogImage || "";
  const site = (seo.siteUrl ?? "").replace(/\/$/, "");
  const slug = key === "home" ? "" : `/${key}`;
  const urlFor = (language: Lang) => site + baseNoSlash() + (language === "en" ? `/en${slug}` : slug || "/");
  const canonical = urlFor(lang);
  return {
    title,
    description,
    canonical,
    ogTitle: title,
    ogDescription: description,
    ogImage: ogImageRef ? absoluteAssetUrl(ogImageRef) : "",
    lang,
    alternates: [{ lang: "es", href: urlFor("es") }, { lang: "en", href: urlFor("en") }, { lang: "x-default", href: urlFor("es") }],
  };
}
