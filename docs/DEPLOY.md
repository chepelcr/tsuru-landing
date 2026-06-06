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

## Hosting: GitHub Pages (current)

The site is deployed by **`.github/workflows/deploy.yml`** on every push to
`main` (and via manual `workflow_dispatch`). The job: `pnpm install --frozen-lockfile`
→ `pnpm run build:seo` (with `VITE_ENABLE_ADMIN` unset, so the admin is
tree-shaken) → `upload-pages-artifact` (`../dist/landing`) → `deploy-pages`.

Live URL: **https://tsuru.jcampos.dev** (custom domain). `public/CNAME` holds
`tsuru.jcampos.dev`, the repo Pages config has it as the custom domain, and the
workflow sets `BASE_PATH=/` + `SITE_URL=https://tsuru.jcampos.dev` so asset paths,
canonical tags, and the sitemap match. DNS: a `CNAME` record
`tsuru.jcampos.dev → chepelcr.github.io` (or A/AAAA to GitHub Pages IPs) in
Route53.

### Required GitHub repo secrets

Seeded from the monorepo's `buildspec-frontend-landing.yml` / SSM. Set via
`gh secret set <NAME> --repo chepelcr/tsuru-landing`:

| Secret | Value | Required? |
|---|---|---|
| `VITE_API_URL` | `https://markets-api.jcampos.dev` | yes (templates API) |
| `VITE_APP_URL` | `https://j-markets.jcampos.dev` | yes (display/links) |
| `VITE_BASE_DOMAIN` | `j-markets.jcampos.dev` | yes (display) |
| `VITE_AWS_REGION` | `us-east-1` | yes |
| `VITE_AWS_COGNITO_USER_POOL_ID` | from SSM `/jcampos/dev/jmarkets/cognito/user-pool-id` | optional* |
| `VITE_AWS_COGNITO_CLIENT_ID` | from SSM `/jcampos/dev/jmarkets/cognito/client-id` | optional* |

\* The public landing only uses the unauthenticated templates API, and
`src/lib/amplify.ts` skips `Amplify.configure` when the Cognito pool id is
absent. Add these two only if the landing ever needs Cognito auth. They were not
auto-seeded (decrypted SSM read was intentionally not performed).

`VITE_ENABLE_ADMIN` is deliberately **never** set in CI — that keeps the dev-only
admin CMS and `/__local` client tree-shaken out of the published bundle.

### Custom domain mechanics (already configured for tsuru.jcampos.dev)

- `public/CNAME` (`tsuru.jcampos.dev`) — Vite copies it into `dist/landing`, which
  is what GitHub Pages reads to bind the domain.
- Repo Pages config has the custom domain set (`gh api -X PUT
  repos/chepelcr/tsuru-landing/pages -f cname=tsuru.jcampos.dev`).
- Route53: `tsuru.jcampos.dev` CNAME → `chepelcr.github.io` (Pages enforces HTTPS
  once the cert provisions).

To move to a different domain, change `public/CNAME`, the workflow
`BASE_PATH`/`SITE_URL`, the repo Pages cname, and DNS.

The prerender already emits a `noindex` `404.html`, which GitHub Pages serves as
the SPA deep-link fallback — no manual `index.html`→`404.html` copy needed.

## Alternative: S3/CloudFront (legacy)

This repo was split from the BeautyMarket monorepo, which deployed the landing via
`deploys/setup-template-bucket.js` / `buildspec-frontend-landing.yml` to
**`j-markets.jcampos.dev`** (S3 + CloudFront + Route53). To use that path instead,
build with `BASE_PATH=/`, upload `dist/landing/` to the bucket (HTML `no-cache`,
images/fonts `max-age=31536000`, other assets `max-age=86400`), keep `404.html`
`noindex`, and invalidate CloudFront.
