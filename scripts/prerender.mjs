import { fileURLToPath } from "node:url";
import { renderStatic } from "./render-static.mjs";
// Each environment's build sets these (prod: tsuru.lat); defaults are dev's.
const site = (process.env.VITE_SITE_URL || "https://tsuru.jcampos.dev").replace(/\/+$/, "");
const blogSite = (process.env.VITE_BLOG_SITE_URL || "https://blogs.tsuru.jcampos.dev").replace(/\/+$/, "");
const keys = ["home", "funcionalidades", "planes", "ferias", "comunidad", "quienes-somos", "ejemplos", "contacto", "terminos", "privacidad", "cookies"];
const slug = (key) => key === "home" ? "" : `/${key}`;
const routeFor = (key, lang) => (lang === "en" ? "/en" : "") + slug(key) || "/";
const aliases = { facturacion: "funcionalidades", pricing: "planes", examples: "ejemplos", contact: "contacto", terms: "terminos", privacy: "privacidad" };
await renderStatic({
  outDir: fileURLToPath(new URL("../../dist/landing", import.meta.url)),
  base: process.env.BASE_PATH || "/",
  site,
  pages: ["es", "en"].flatMap((lang) => keys.map((key) => ({ route: routeFor(key, lang), lang, key }))),
  aliases: {
    ...Object.fromEntries(["es", "en"].flatMap((lang) => Object.entries(aliases).map(([from, to]) => [routeFor(from, lang), routeFor(to, lang)]))),
    ...Object.fromEntries(keys.map((key) => [`/es${slug(key)}`, routeFor(key, "es")])),
    "/blog": `${blogSite}/`,
    "/en/blog": `${blogSite}/`,
  },
});
