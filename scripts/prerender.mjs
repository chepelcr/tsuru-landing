// Build-time SEO prerender. Run AFTER `vite build` (see "build:seo" npm script).
//
// DEVIATION FROM THE SKILL DEFAULT: this site has NO URL language prefix
// (language is React context + localStorage, not part of the URL). The skill's
// reference prerenders one HTML per language x route under /<lang>/<slug>/. Here
// each public route has a single canonical URL, so we prerender ONE static HTML
// per route using the DEFAULT language (es), injecting title/description/
// canonical/OG/JSON-LD into the built dist/landing/index.html shell.
// Runtime head tags (useHeadTags) still swap title/description per language on
// the client after hydration. This single-language-prerender deviation is
// documented in CLAUDE.md.

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.resolve(ROOT, "../dist/landing");

const DEFAULT_LANG = "es";
const BASE = (process.env.BASE_PATH || "/").replace(/\/$/, ""); // "" for "/", "/repo" for "/repo/"

// Public routes — keep in sync with src/components/Router.tsx (catch-all 404
// excluded). "/" is the home route.
const ROUTES = [
  "/",
  "/funcionalidades",
  "/ferias",
  "/comunidad",
  "/quienes-somos",
  "/ejemplos",
  "/examples",
  "/blog",
  "/contacto",
  "/contact",
  "/terminos",
  "/terms",
  "/privacidad",
  "/privacy",
  "/cookies",
];

const seo = JSON.parse(await fs.readFile(path.resolve(ROOT, "src/content/seo.json"), "utf8"));
// SITE_URL env overrides seo.json.siteUrl so the deploy target (e.g. the GitHub
// Pages project host) controls canonical/sitemap URLs without editing content.
const SITE = (process.env.SITE_URL || seo.siteUrl || "").replace(/\/$/, "");

const routeKey = (p) => (p === "/" ? "home" : p.replace(/^\/+/, "").replace(/\/+$/, ""));

function absoluteAssetUrl(ref) {
  if (!ref) return "";
  if (/^https?:\/\//i.test(ref) || ref.startsWith("data:")) return ref;
  return SITE + BASE + (ref.startsWith("/") ? ref : `/${ref}`);
}

function resolve(routePath, lang) {
  const key = routeKey(routePath);
  const o = seo.pages?.[key] || {};
  const title = o[lang]?.title || seo.defaultTitle?.[lang] || seo.defaultTitle?.es || "";
  const description =
    o[lang]?.description || seo.defaultDescription?.[lang] || seo.defaultDescription?.es || "";
  const ogImage = absoluteAssetUrl(o.ogImage || seo.ogImage || "");
  const canonical = SITE + BASE + routePath;
  return { key, title, description, canonical, ogImage };
}

function escAttr(s) {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escJson(s) {
  return String(s).replace(/</g, "\\u003c");
}

function buildHead(meta, lang) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: meta.title,
    description: meta.description,
    url: meta.canonical,
    inLanguage: lang,
  };
  const tags = [
    `<title>${escAttr(meta.title)}</title>`,
    `<meta name="description" content="${escAttr(meta.description)}" />`,
    `<link rel="canonical" href="${escAttr(meta.canonical)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escAttr(meta.title)}" />`,
    `<meta property="og:description" content="${escAttr(meta.description)}" />`,
    `<meta property="og:url" content="${escAttr(meta.canonical)}" />`,
    meta.ogImage ? `<meta property="og:image" content="${escAttr(meta.ogImage)}" />` : "",
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escAttr(meta.title)}" />`,
    `<meta name="twitter:description" content="${escAttr(meta.description)}" />`,
    meta.ogImage ? `<meta name="twitter:image" content="${escAttr(meta.ogImage)}" />` : "",
    `<script type="application/ld+json">${escJson(JSON.stringify(ld))}</script>`,
  ];
  return tags.filter(Boolean).join("\n    ");
}

// Inject resolved head into the built index.html shell, replacing the static
// <title>/<meta description> and inserting the rest before </head>.
function injectHead(shell, headHtml, lang) {
  let html = shell;
  html = html.replace(/<title>[\s\S]*?<\/title>\s*/i, "");
  html = html.replace(/<meta\s+name="description"[^>]*>\s*/i, "");
  html = html.replace(/<html lang="[^"]*"/i, `<html lang="${lang}"`);
  html = html.replace(/<\/head>/i, `    ${headHtml}\n  </head>`);
  return html;
}

const shell = await fs.readFile(path.resolve(OUT, "index.html"), "utf8");

const written = [];
for (const route of ROUTES) {
  const meta = resolve(route, DEFAULT_LANG);
  const head = buildHead(meta, DEFAULT_LANG);
  const html = injectHead(shell, head, DEFAULT_LANG);
  if (route === "/") {
    await fs.writeFile(path.resolve(OUT, "index.html"), html);
    written.push("index.html");
  } else {
    const dir = path.resolve(OUT, `.${route}`);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.resolve(dir, "index.html"), html);
    written.push(`${route.slice(1)}/index.html`);
  }
}

// sitemap.xml — one <url> per public route.
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  ROUTES.map((r) => `  <url><loc>${SITE}${BASE}${r}</loc></url>`).join("\n") +
  `\n</urlset>\n`;
await fs.writeFile(path.resolve(OUT, "sitemap.xml"), sitemap);

// robots.txt — allow everything + point at the sitemap.
const robots = `User-agent: *\nAllow: /\n\nSitemap: ${SITE}${BASE}/sitemap.xml\n`;
await fs.writeFile(path.resolve(OUT, "robots.txt"), robots);

// Ensure the SPA 404 fallback is noindex.
const fourOhFour = path.resolve(OUT, "404.html");
try {
  let html = await fs.readFile(fourOhFour, "utf8");
  if (!/name="robots"/i.test(html)) {
    html = html.replace(/<\/head>/i, `    <meta name="robots" content="noindex" />\n  </head>`);
    await fs.writeFile(fourOhFour, html);
  }
} catch {
  // public/404.html should exist and be copied by vite; ignore if absent.
}

console.log(`[prerender] base="${BASE || "/"}" site="${SITE}"`);
console.log(`[prerender] wrote ${written.length} route HTML files:`);
for (const w of written) console.log(`  - ${w}`);
console.log(`[prerender] wrote sitemap.xml (${ROUTES.length} urls), robots.txt, ensured 404 noindex`);
