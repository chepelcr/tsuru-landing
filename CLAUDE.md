# CLAUDE.md — tsuru-landing

Guidance for Claude Code when working in this repository.

## What this is

The **standalone `tsuru-landing` repo** (`github.com/chepelcr/tsuru-landing`),
split out of the BeautyMarket monorepo. It is a "landing DXP": a polished public
marketing SPA (React 18 + Vite + TypeScript + Tailwind v3 + wouter) paired with
a **local, dev-only admin CMS**. It is driven entirely by bundled JSON content
files with **NO runtime backend** — it deploys 100% static.

- Path alias: `@` → `src`.
- Package manager: **npm** (NOT pnpm). This is a deliberate deviation from the
  landing-dxp-builder skill's pnpm default — all scripts/docs use `npm`.
- Dev server port: `3001`. Build output: `../dist/landing`.
- `BASE_PATH` env sets Vite `base` (`/` for custom domain, `/<repo>/` for a
  subpath).

## Content layout (the data model)

All editable content is bundled JSON, in two buckets:

- `src/content/*.json` — **structured entities**: `branding.json`, `themes.json`,
  `navigation.json`, `media.json`, `settings.json`, `examples.json`, `blog.json`,
  `seo.json`.
- `src/translations/{en,es}.json` — **flat translation key→string maps** consumed
  by `useLanguage().t(key)`.

**Two-bucket model:** structured entities (objects/arrays with their own shape,
edited by dedicated admin pages) live in `src/content`; loose UI strings
(translation keys) live in `src/translations`. When adding text, decide which
bucket it belongs to — entity field vs. translation key.

## No-hardcoded-text rule

Public components must not contain hardcoded user-facing copy. Text comes from
either a content entity (`src/content/*.json`) or a translation key
(`t("...")`). **Acceptable literals:** non-content technical strings — CSS
classes, ARIA roles, `data-*` attributes, icon names, route paths, keys/ids, and
debug/console strings. When in doubt, externalize it.

## Content ↔ admin completeness rule (the four pieces)

Every editable content entity must have **all four** pieces, kept in sync via the
entity manifest at `src/admin/manifest.ts`:

1. **Page** — an admin editor page under `src/admin/pages/`.
2. **Sidebar** — a `PAGES[]` row in `src/admin/manifest.ts` (label/route/icon/group).
3. **Route** — the admin router renders that page at the manifest `route`.
4. **Versions row** — the entity appears on the content-versions page (via
   `VERSION_FILES` / `filesForPage` in the manifest when it bundles multiple
   files, e.g. site-identity = `branding.json` + `themes.json`, translations =
   `en.json` + `es.json`).

`src/admin/manifest.ts` is the single source of truth; sidebar, router, and
versions page all read from it so they never drift.

## Admin chrome & language toggle

The admin UI is **bilingual** (its own labels come from translation keys), with
an **in-place language toggle** (`useLanguage().setLanguage`) — the same
context+localStorage language as the public site. There is **no URL language
prefix** anywhere; language is React context + `localStorage`, never part of the
URL. Public routes are plain (`/funcionalidades`, `/features`, `/blog`, …; see
`src/components/Router.tsx`). **Do not introduce URL-prefixed i18n routing.**

## Rich-text module

`src/lib/rich-text.tsx` provides the editing/rendering for rich-text content
fields. Use it for any entity field that needs inline formatting rather than
inventing a new editor.

## Save / publish workflow (dev-only)

Admin edits flow through `src/lib/admin-store.ts` → `downloadJson(filename, data)`
→ `saveContentFile()` in `src/lib/local-cms.ts`, which POSTs to the **dev-only**
Vite middleware in `plugins/local-cms.ts` (`apply: "serve"`, registered in
`vite.config.ts`). Endpoints (localhost-only, whitelisted filenames, path-guarded):

| Method + path | Body | Effect |
|---|---|---|
| `POST /__local/content` | `{ filename, data }` | Writes pretty JSON. **`en.json`/`es.json` → `src/translations/`; every other `*.json` → `src/content/`.** Rejects names with separators/`..`. |
| `POST /__local/asset` | `{ filename, dataUrl, dir? }` | Decodes data URL → `public/<dir>/` (`dir` ∈ `""`, `"media"`). Returns `{ url }`. 25 MB cap. |
| `POST /__local/publish` | `{}` | `git add -A` of `src/content`/`src/translations`/`public`, commit, push current branch. Refuses if not a git repo. |
| `GET /__local/git-status` | — | Pending-changes flag (drives the Publish button). |
| `GET /__local/git-log?skip=&limit=` | — | Paginated commit log (Diagnostics). |

When `saveContentFile` returns false (prod / endpoint absent), the admin falls
back to a browser download. The plugin is **serve-only** and never in a build —
verified by `grep -rl "__local" ../dist/landing/assets` being empty.

## Admin tree-shake gate (load-bearing)

`src/lib/admin-enabled.ts` exports `ADMIN_ENABLED = import.meta.env.DEV ||
import.meta.env.VITE_ENABLE_ADMIN === "true"`. The admin has **NO
authentication** — this gate is the only thing keeping it off the public site.

- In a normal prod build (`VITE_ENABLE_ADMIN` unset) it folds to literal `false`,
  so the `src/admin` tree and `/__local` client are tree-shaken out.
- **Never** weaken this gate, register `/admin` unconditionally, or default
  `VITE_ENABLE_ADMIN=true` in CI.
- Verify each prod build is admin-free (see Verify below).

## SEO

- `src/content/seo.json`: `{ siteUrl, defaultTitle:{es,en},
  defaultDescription:{es,en}, ogImage?, pages? }`. `pages` is an optional
  per-route override map keyed by route slug (`home`, `blog`, …). `SeoPage`
  edits `siteUrl`/`defaultTitle`/`defaultDescription`/`ogImage`.
- **Runtime head tags:** `src/lib/seo.ts#resolveSeo(pathname, lang)` merges
  defaults with the per-route override; `src/hooks/useHeadTags.ts` applies them.
  A tiny `<HeadTags/>` component in `src/App.tsx` (public branch) calls it keyed
  on wouter location + language — head-only, no visual/hydration change. Pages
  that set `document.title` themselves (Blog/Contact/Terms/Privacy/Cookies)
  still override the default; that's intentional.
- **Build-time prerender:** `scripts/prerender.mjs` runs after `vite build`
  (`npm run build:seo`). It injects resolved `<title>`/meta/canonical/OG/JSON-LD
  into the built `index.html` shell, writes `dist/landing/<route>/index.html` for
  every public route, plus `sitemap.xml`, `robots.txt`, and a `noindex`
  `404.html`.

  **DEVIATION — single-language prerender:** because there is no URL language
  prefix, each route has ONE canonical URL, so prerender emits ONE static HTML
  per route using the **default language (`es`)** — not one-per-language. Runtime
  head tags still swap title/description per language after hydration. (The skill
  reference assumes `/<lang>/<slug>` URLs and per-language prerender; we
  deliberately do not.)

## Build & deploy

```bash
npm run dev          # dev server on :3001 (admin enabled via import.meta.env.DEV)
npm run build        # vite build only (unchanged)
npm run build:seo    # vite build + prerender (deployable artifact)
npm run prerender    # prerender only (run after a build)
```

Deploy: see `docs/DEPLOY.md`. Build with `VITE_ENABLE_ADMIN` **unset** and
`BASE_PATH` appropriate, upload `dist/landing` to S3/CloudFront
(`j-markets.jcampos.dev`, via the monorepo's `setup-template-bucket.js` pattern).

## How to add a new content entity (checklist)

1. Create `src/content/<entity>.json` with its initial shape.
2. Register it in `src/lib/admin-store.ts` (`ENTITY_BY_FILE` + `INITIAL` + slice).
3. Render it in the public component(s) — no hardcoded copy; pull from the
   entity / translations.
4. Build the admin editor page under `src/admin/pages/`.
5. Ensure the **four pieces** are wired in `src/admin/manifest.ts`:
   **page + sidebar row + route + versions row** (add to `VERSION_FILES` if it
   bundles multiple files).
6. If the entity affects SEO/routes, update `seo.json.pages` and the `ROUTES`
   list in `scripts/prerender.mjs`.

## Constraints (do not break)

- Do not change public component rendering, routing structure, or introduce URL
  language prefixes.
- The local-CMS plugin must stay `apply: "serve"`; prod builds must contain no
  `/__local` code.
- Do not weaken the admin gate.

## Verify

```bash
npx tsc --noEmit
npm run build && grep -rl "__local" ../dist/landing/assets   # second cmd: no output
node scripts/prerender.mjs                                   # after a build
```
