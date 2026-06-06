// Single source of truth for the admin: every editable entity with its file,
// bilingual label, route, icon, and sidebar group. Drives the sidebar, the
// router, and the content-versions page so they never drift.

import type { IconName } from "@/lib/icons";

export type Lang = "es" | "en";
export interface BiLabel {
  es: string;
  en: string;
}

export type AdminGroup = "content" | "cms" | "platform";

export interface ContentPage {
  /** Filename used by the store + downloadJson (e.g. "examples.json"). */
  file: string;
  label: BiLabel;
  route: string;
  icon: IconName;
  group: AdminGroup;
}

export const GROUP_LABELS: Record<AdminGroup, BiLabel> = {
  content: { es: "Contenido", en: "Content" },
  cms: { es: "CMS", en: "CMS" },
  platform: { es: "Plataforma", en: "Platform" },
};

export const GROUP_ICONS: Record<AdminGroup, IconName> = {
  content: "store",
  cms: "settings",
  platform: "globe",
};

// One row per editable entity. site-identity edits TWO files (branding +
// themes) under a single page, so it carries branding.json as its primary file
// and themes.json is handled by the same page.
export const PAGES: ContentPage[] = [
  {
    file: "branding.json",
    label: { es: "Identidad del sitio", en: "Site identity" },
    route: "/admin/identity",
    icon: "palette",
    group: "content",
  },
  {
    file: "navigation.json",
    label: { es: "Navegación", en: "Navigation" },
    route: "/admin/navigation",
    icon: "menu",
    group: "content",
  },
  {
    file: "examples.json",
    label: { es: "Ejemplos", en: "Examples" },
    route: "/admin/examples",
    icon: "store",
    group: "content",
  },
  {
    file: "blog.json",
    label: { es: "Blog", en: "Blog" },
    route: "/admin/blog",
    icon: "book-open",
    group: "content",
  },
  {
    file: "media.json",
    label: { es: "Medios", en: "Media" },
    route: "/admin/media",
    icon: "package",
    group: "cms",
  },
  {
    file: "translations/en.json",
    label: { es: "Traducciones", en: "Translations" },
    route: "/admin/translations",
    icon: "globe",
    group: "cms",
  },
  {
    file: "seo.json",
    label: { es: "SEO", en: "SEO" },
    route: "/admin/seo",
    icon: "search",
    group: "cms",
  },
  {
    file: "settings.json",
    label: { es: "Ajustes", en: "Settings" },
    route: "/admin/settings",
    icon: "settings",
    group: "cms",
  },
];

// The full set of content files an entity touches, for ContentVersionsPage.
// Site identity bundles branding + themes; translations bundles en + es.
export const VERSION_FILES: Record<string, string[]> = {
  "branding.json": ["branding.json", "themes.json"],
  "translations/en.json": ["translations/en.json", "translations/es.json"],
};

export function filesForPage(p: ContentPage): string[] {
  return VERSION_FILES[p.file] ?? [p.file];
}

export function labelForFile(file: string, lang: Lang): string {
  return PAGES.find((p) => p.file === file)?.label[lang] ?? file;
}
