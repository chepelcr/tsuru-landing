# CLAUDE.md — tsuru-landing

Guidance for Claude Code when working in this repository.

## What this is

The **standalone `tsuru-landing` repo** (`github.com/chepelcr/tsuru-landing`),
split out of the BeautyMarket monorepo. It is a "landing DXP": a polished public
marketing SPA (React 18 + Vite + TypeScript + Tailwind v3 + wouter) paired with
a **local, dev-only admin CMS**. It is driven entirely by bundled JSON content
files with **NO runtime backend** — it deploys 100% static.

- Path alias: `@` → `src`.
- Package manager: **pnpm** (enforced by a `preinstall: only-allow pnpm` guard).
  Lockfile `pnpm-lock.yaml`; `package.json#pnpm.onlyBuiltDependencies` whitelists
  `esbuild`'s install script. Use `pnpm install` / `pnpm run <script>`.
- Dev server port: `3001`. Build output: `../dist/landing`.
- `BASE_PATH` env sets Vite `base` (`/` for custom domain, `/<repo>/` for a
  subpath).

## Content layout (the data model)

All editable content is bundled JSON, organized **per page/component** so copy is
co-located with what uses it (there is **no** global Translations page):

- `src/content/*.json` — one entity per page or shared component, with bilingual
  fields (`{ es, en }`). Page copy: `landing.json`, `features.json`, `fairs.json`,
  `community.json`, `about.json`, `contact.json`, `terms.json`, `privacy.json`,
  `cookies.json`, `blog.json` (+ `blog-chrome.json`). Chrome/components:
  `navbar.json`, `footer.json`, `ui.json`, `cta-security.json`, `navigation.json`.
  Site identity / config: `branding.json`, `themes.json`, `media.json`,
  `seo.json`, `settings.json`. Tooling: `inventory.json`.
- Public components read `entity.field[lang] ?? entity.field.es` (see any page in
  `src/pages/`); they do **not** use a `t()` key table for their own copy.
- `src/translations/{en,es}.json` — now holds only **admin-chrome** keys
  (`admin.*`) consumed by `useLanguage().t(key)` inside the dev-only admin, plus a
  few framework keys (`theme.*`, `language.*`) and keys still referenced by the
  online Examples page. It is **not** an editable content surface.

**Per-page model:** when adding page copy, add a field to that page's
`src/content/<page>.json` entity and read it in the component — never introduce a
global key table. Templates are fetched live from the API (not a content entity);
the admin shows them read-only.

## No-hardcoded-text rule

Public components must not contain hardcoded user-facing copy. Text comes from
the page/component's content entity (`src/content/*.json`), read as
`entity.field[lang]`. (`t("…")` is for **admin chrome only**, not public copy.)
**Acceptable literals:** non-content technical strings — CSS
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
pnpm run dev          # dev server on :3001 (admin enabled via import.meta.env.DEV)
pnpm run build        # vite build only (unchanged)
pnpm run build:seo    # vite build + prerender (deployable artifact)
pnpm run prerender    # prerender only (run after a build)
```

Deploy: see `docs/DEPLOY.md`. Hosted on **GitHub Pages at
`https://tsuru.jcampos.dev`** via `.github/workflows/deploy.yml` (builds with
`VITE_ENABLE_ADMIN` unset so the admin is tree-shaken; `public/CNAME` binds the
domain). Build params come from repo **secrets** (`VITE_API_URL`, `VITE_APP_URL`,
`VITE_BASE_DOMAIN`, `VITE_AWS_REGION`; Cognito IDs optional — `amplify.ts` skips
configure without them).

## Admin platform pages (tooling)

Beyond the per-entity editors, the admin has read-only tooling under the
**Platform** group: **Dashboard**, **Content Versions** (download every entity),
**Content Explorer** (master-detail JSON tree of every content file),
**Diagnostics** (health checks + content stats + system info + git-log), and
**Inventory** (interactive dependency graph of `src/`, from `inventory.json`).
`inventory.json` is generated by `scripts/build-inventory.mjs` (`pnpm run
inventory`) — regenerate it whenever files are added/removed/renamed.

## RBAC / Platform admin section (BE-connected — hybrid model)

The **RBAC / Platform** sidebar group is the FIRST backend-connected admin
section (the public site stays 100% static JSON DXP; only these admin pages
call an API). It manages the platform RBAC catalogs and per-organization module
assignment against the Express markets API's `/api/admin` group (contract:
`docs/roadmap/rbac_express_contract.md` in the BeautyMarket monorepo).

- **Pages** (all `online: true` manifest rows — no content slice, no versions
  row): Organizations (P1 search/list → per-org module assignment P2-P5 with
  submodule overrides and effective-availability badges), Module catalog
  (P6-P12 CRUD), Actions (P13-P16 CRUD), Action matrix (P17/P18
  submodule-actions availability grid).
- **Layers**: `src/lib/admin-api.ts` (fetch helper, Cognito bearer) →
  `src/repositories/platform-rbac.repository.ts` (one function per endpoint) →
  `src/services/platform-rbac.service.ts` (React Query hooks) →
  `src/admin/pages/Rbac*.tsx` + shared atoms in `src/admin/rbac/widgets.tsx`.
- **Auth**: `src/admin/rbac/PlatformAdminGate.tsx` — Cognito sign-in via
  `src/lib/amplify.ts`, then `GET /api/users/:userId/profile` must report
  `role === 'platform_admin'`; otherwise a clear unauthorized state. The UI only
  gates — the backend's `requirePlatformAdmin` middleware is the enforcement.
- **Env vars** (build-time): `VITE_API_URL` (markets API base, e.g.
  `https://markets-api.jcampos.dev`; `http://localhost:5000` for local dev),
  `VITE_AWS_COGNITO_USER_POOL_ID`, `VITE_AWS_COGNITO_CLIENT_ID`,
  `VITE_AWS_REGION`. When unset, the gate shows a config notice and the static
  deploy keeps working.
- **Tree-shake**: everything rides the existing `ADMIN_ENABLED` gate; a normal
  prod build contains no `/api/admin` code (only the `admin.rbac.*` translation
  strings, same as every other `admin.*` chrome key).

## How to add a new content entity (checklist)

1. Create `src/content/<entity>.json` with its initial bilingual shape.
2. Register it in `src/lib/admin-store.ts` (slice + setter + `ENTITY_BY_FILE` +
   snapshot).
3. Render it in the public component(s) via `entity.field[lang]` — no hardcoded
   copy, no `t()` for public copy.
4. Build the admin editor page under `src/admin/pages/`.
5. Ensure the **four pieces** are wired in `src/admin/manifest.ts`:
   **page + sidebar row + route + versions row** (add to `VERSION_FILES` if it
   bundles multiple files).
6. If the entity affects SEO/routes, update `seo.json.pages` and the `ROUTES`
   list in `scripts/prerender.mjs`.
7. Run `pnpm run inventory` to refresh `inventory.json`.

## Constraints (do not break)

- Do not change public component rendering, routing structure, or introduce URL
  language prefixes.
- The local-CMS plugin must stay `apply: "serve"`; prod builds must contain no
  `/__local` code.
- Do not weaken the admin gate.

## Verify

```bash
pnpm run check   # tsc --noEmit
pnpm run build && grep -rl "__local" ../dist/landing/assets   # second cmd: no output
node scripts/prerender.mjs                                   # after a build
```
