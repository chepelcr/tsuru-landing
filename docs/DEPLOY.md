# Deploy — tsuru-landing (static)

The landing site deploys 100% static. There is **no runtime backend**; all
content is bundled JSON (`src/content/*.json` + `src/translations/{en,es}.json`).
The dev-only admin CMS and its `/__local` endpoints exist **only** on the Vite
dev server (`apply: "serve"`) and are never part of a build.

## Build

```bash
# CI build — admin tree-shaken OUT (gate folds to false), SEO prerendered.
BASE_PATH=/ pnpm run build:seo
```

- `build:seo` = `vite build && node scripts/prerender.mjs`.
- Plain `pnpm run build` still works unchanged (no prerender). Use `build:seo`
  for the deployable artifact.
- Output: `../dist/landing` (relative to this package — i.e. `dist/landing/` at
  the monorepo root layout this was split from).

### Environment

| Var | Value in CI | Purpose |
|---|---|---|
| `VITE_ENABLE_ADMIN` | **UNSET** | Leave unset. The admin gate (`src/lib/admin-enabled.ts`) folds to `false`, so the entire `src/admin` tree and the `local-cms` browser client are tree-shaken out. **Never set this to `true` in CI.** |
| `BASE_PATH` | `/` for a custom domain, `/<repo>/` for a project subpath | Sets Vite `base`. The prerender reads it for canonical/sitemap URLs. |

Verify a CI build is admin-free:

```bash
BASE_PATH=/ pnpm run build:seo
grep -rl "__local" ../dist/landing/assets   # must print nothing
```

## Prerender outputs

`scripts/prerender.mjs` (after `vite build`) writes into `dist/landing`:

- One `index.html` per public route (`<route>/index.html`), each with the
  resolved `<title>`, description, canonical, OG/Twitter tags, and `WebPage`
  JSON-LD injected into the built shell. **Single default language (`es`)** —
  see the deviation note in `CLAUDE.md`.
- `sitemap.xml` (one `<loc>` per route).
- `robots.txt` (`Allow: /` + `Sitemap:` line).
- `404.html` made `noindex` (the SPA deep-link fallback).

URLs use `seo.json.siteUrl` + `BASE_PATH`.

## Upload

This repo was split from the BeautyMarket monorepo, which deploys frontends via
`deploys/setup-template-bucket.js` to **`j-markets.jcampos.dev`** (S3 +
CloudFront + Route53, per-app bucket, CloudFront invalidation after upload).

To deploy this landing site to the same target, upload the contents of
`dist/landing/` to its S3 bucket and invalidate the CloudFront distribution:

- HTML files: `Cache-Control: no-cache`.
- Images/fonts: `max-age=31536000`.
- Other assets: `max-age=86400`.
- The SPA fallback (`404.html`) must stay `noindex` — do not overwrite it with
  an indexable copy of `index.html`.

The standalone repo (`github.com/chepelcr/tsuru-landing`) can run the same build
in CI and push `dist/landing` to the bucket, or to GitHub Pages (write a `CNAME`
and copy `index.html`→`404.html` for deep-link fallback, preserving the noindex
meta the prerender added).
