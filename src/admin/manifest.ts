// Single source of truth for the admin: every editable entity with its file,
// bilingual label, route, icon, and sidebar group. Drives the sidebar, the
// router, and the content-versions page so they never drift.

import type { IconName } from "@/lib/icons";

export type Lang = "es" | "en";
export interface BiLabel {
  es: string;
  en: string;
}

export type AdminGroup = "content" | "pages" | "legal" | "chrome" | "cms" | "platform" | "rbac";

export interface ContentPage {
  /**
   * Filename used by the store + downloadJson (e.g. "blog.json"). Omitted for
   * read-only "online" pages that are NOT bundled content entities (e.g. the
   * live Templates view fetched from the API) — those carry `online: true`,
   * appear in the sidebar/router, but never in admin-store slices or the
   * content-versions page.
   */
  file?: string;
  /** True for read-only pages backed by an online API rather than a JSON file. */
  online?: boolean;
  label: BiLabel;
  route: string;
  icon: IconName;
  group: AdminGroup;
}

export const GROUP_LABELS: Record<AdminGroup, BiLabel> = {
  content: { es: "Estructura", en: "Structure" },
  pages: { es: "Páginas", en: "Pages" },
  legal: { es: "Legal", en: "Legal" },
  chrome: { es: "Interfaz", en: "Chrome" },
  cms: { es: "CMS", en: "CMS" },
  platform: { es: "Plataforma", en: "Platform" },
  rbac: { es: "RBAC / Plataforma", en: "RBAC / Platform" },
};

export const GROUP_ICONS: Record<AdminGroup, IconName> = {
  content: "palette",
  pages: "store",
  legal: "shield",
  chrome: "menu",
  cms: "settings",
  platform: "globe",
  rbac: "shield",
};

// One row per editable entity. site-identity edits TWO files (branding +
// themes) under a single page, so it carries branding.json as its primary file
// and themes.json is handled by the same page.
export const PAGES: ContentPage[] = [
  // Structure
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

  // Pages
  {
    file: "landing.json",
    label: { es: "Inicio", en: "Home" },
    route: "/admin/landing",
    icon: "home",
    group: "pages",
  },
  {
    file: "features.json",
    label: { es: "Funcionalidades", en: "Features" },
    route: "/admin/features",
    icon: "sparkles",
    group: "pages",
  },
  {
    file: "fairs.json",
    label: { es: "Ferias", en: "Fairs" },
    route: "/admin/fairs",
    icon: "calendar",
    group: "pages",
  },
  {
    file: "community.json",
    label: { es: "Comunidad", en: "Community" },
    route: "/admin/community",
    icon: "users",
    group: "pages",
  },
  {
    file: "about.json",
    label: { es: "Quiénes somos", en: "About" },
    route: "/admin/about",
    icon: "heart",
    group: "pages",
  },
  {
    file: "contact.json",
    label: { es: "Contacto", en: "Contact" },
    route: "/admin/contact",
    icon: "mail",
    group: "pages",
  },
  {
    file: "blog.json",
    label: { es: "Blog", en: "Blog" },
    route: "/admin/blog",
    icon: "book-open",
    group: "pages",
  },
  {
    file: "blog-chrome.json",
    label: { es: "Blog (textos)", en: "Blog (chrome)" },
    route: "/admin/blog-chrome",
    icon: "file-text",
    group: "pages",
  },
  {
    online: true,
    label: { es: "Plantillas", en: "Templates" },
    route: "/admin/templates",
    icon: "store",
    group: "pages",
  },

  // Legal
  {
    file: "terms.json",
    label: { es: "Términos", en: "Terms" },
    route: "/admin/terms",
    icon: "file-text",
    group: "legal",
  },
  {
    file: "privacy.json",
    label: { es: "Privacidad", en: "Privacy" },
    route: "/admin/privacy",
    icon: "shield",
    group: "legal",
  },
  {
    file: "cookies.json",
    label: { es: "Cookies", en: "Cookies" },
    route: "/admin/cookies",
    icon: "settings",
    group: "legal",
  },

  // Chrome
  {
    file: "navbar.json",
    label: { es: "Barra de navegación", en: "Navbar" },
    route: "/admin/navbar",
    icon: "menu",
    group: "chrome",
  },
  {
    file: "footer.json",
    label: { es: "Pie de página", en: "Footer" },
    route: "/admin/footer",
    icon: "building-2",
    group: "chrome",
  },
  {
    file: "ui.json",
    label: { es: "Textos de interfaz", en: "UI strings" },
    route: "/admin/ui",
    icon: "message-square",
    group: "chrome",
  },
  {
    file: "cta-security.json",
    label: { es: "CTA / Seguridad", en: "CTA / Security" },
    route: "/admin/cta-security",
    icon: "shield",
    group: "chrome",
  },

  // CMS
  {
    file: "media.json",
    label: { es: "Medios", en: "Media" },
    route: "/admin/media",
    icon: "package",
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

  // Platform / tooling. inventory is a real content entity (file-backed);
  // content-explorer, diagnostics and content-versions are read-only fileless
  // views (online: true) — they appear in the sidebar/router but never as a
  // content slice or a versions row.
  {
    file: "inventory.json",
    label: { es: "Inventario", en: "Inventory" },
    route: "/admin/inventory",
    icon: "network",
    group: "platform",
  },
  {
    online: true,
    label: { es: "Explorador de contenido", en: "Content explorer" },
    route: "/admin/content-explorer",
    icon: "database",
    group: "platform",
  },
  {
    online: true,
    label: { es: "Diagnóstico", en: "Diagnostics" },
    route: "/admin/diagnostics",
    icon: "activity",
    group: "platform",
  },
  {
    online: true,
    label: { es: "Versiones de contenido", en: "Content versions" },
    route: "/admin/content-versions",
    icon: "file-text",
    group: "platform",
  },

  // RBAC / Platform — the FIRST BE-connected admin section (hybrid model: the
  // public site stays static; these pages talk to the markets API /api/admin
  // group behind a Cognito platform_admin gate). All rows are `online: true`:
  // no content slice, no versions row.
  {
    online: true,
    label: { es: "Organizaciones", en: "Organizations" },
    route: "/admin/rbac/organizations",
    icon: "building-2",
    group: "rbac",
  },
  {
    online: true,
    label: { es: "Catálogo de módulos", en: "Module catalog" },
    route: "/admin/rbac/catalog",
    icon: "package",
    group: "rbac",
  },
  {
    online: true,
    label: { es: "Acciones", en: "Actions" },
    route: "/admin/rbac/actions",
    icon: "clipboard-list",
    group: "rbac",
  },
  {
    online: true,
    label: { es: "Matriz de acciones", en: "Action matrix" },
    route: "/admin/rbac/matrix",
    icon: "network",
    group: "rbac",
  },
];

// The full set of content files an entity touches, for ContentVersionsPage.
// Site identity bundles branding + themes.
export const VERSION_FILES: Record<string, string[]> = {
  "branding.json": ["branding.json", "themes.json"],
};

// Content (file-backed) pages only — excludes read-only online pages.
export const CONTENT_PAGES: ContentPage[] = PAGES.filter((p) => !!p.file);

export function filesForPage(p: ContentPage): string[] {
  if (!p.file) return [];
  return VERSION_FILES[p.file] ?? [p.file];
}

export function labelForFile(file: string, lang: Lang): string {
  return PAGES.find((p) => p.file === file)?.label[lang] ?? file;
}
