# Tsuru landing

Production is live at https://www.tsuru.lat through S3 and CloudFront. The apex
https://tsuru.lat redirects there. The `main` build links visitors to sign in or
register at https://app.tsuru.lat.

The `develop` build runs at https://tsuru.jcampos.dev through GitHub Pages and
links to https://app.tsuru.jcampos.dev. Use pnpm. The build output is
`../dist/landing` and `BASE_PATH` is `/` on both custom domains.

## Public content contract

- Published editorial copy, translations, shared chrome, brand configuration,
  and SEO document data come from GET /api/public/content/landing on the Tsuru
  public API when each visitor loads the site.
- The browser gets temporary guest credentials from the public Cognito identity
  pool and signs public API GET requests with SigV4. A failed load shows Retry.
- src/main.tsx finishes loadPublishedContent() before importing App or brand
  modules that read the content. Keep that ordering when adding routes.
- Public components call getContent<T>(key). They may use a type-only import of
  src/content JSON to describe a document, but must not import its value.
- The checked-in src/content and src/translations JSON is legacy type scaffolding
  and input for the development-only CMS. It is never a production fallback.
- The live editor is in the separate Tsuru admin dashboard. Publishing content
  does not require a landing build. CI builds code and assets only; it does not
  import, seed, migrate, snapshot, or prerender content.
- Blog pages live at https://blogs.tsuru.jcampos.dev. Old /blog links redirect
  there, preserving article slugs in the ?post= query parameter.

## Build and verification

Run pnpm run check, pnpm run build, and python3 scripts/check-public-imports.py.
Confirm the production bundle has no /__local development CMS client or
editorial source JSON text. The GitHub Pages workflow leaves VITE_ENABLE_ADMIN
unset so the development CMS is tree shaken out.

The GitHub Pages 404 shell redirects deep links through ?route= and main.tsx
restores the requested path before the router mounts. The public page requires
JavaScript and a working public API. Search metadata and no-JavaScript reading
need a future request-time rendering layer, outside CI content management.

Historical development CMS details are archived in docs/LEGACY_DEV_CMS.md.
