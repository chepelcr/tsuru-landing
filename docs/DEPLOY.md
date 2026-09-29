# Landing deployment

The public site is a GitHub Pages React/Vite app at https://tsuru.jcampos.dev.
Its GitHub Actions workflow installs dependencies, checks public imports, builds
code and static assets, checks that the development CMS is absent, and deploys
the artifact. It does not manage editorial data.

## Runtime content

When a visitor opens the site, the browser obtains temporary guest credentials
from the public Cognito identity pool and signs a GET to
https://public-api.tsuru.jcampos.dev/api/public/content/landing. All published
landing documents, including translations, arrive in that response. The app
loads them before rendering public routes. If the request fails, the visitor
sees a Retry state. No checked-in JSON is used as a production fallback.

Production landing content is edited through the Tsuru admin dashboard and its
admin API. The content service owns versions and published data. Publishing a
document is visible on the next visitor load, without a Pages rebuild.

## Build configuration

GitHub repository variables PUBLIC_API_URL and PUBLIC_IDENTITY_POOL_ID provide
the public API URL and Cognito identity pool ID. The AWS region comes from the
existing VITE_AWS_REGION secret. Existing VITE_API_URL, VITE_APP_URL, and
VITE_BASE_DOMAIN values are used for technical links and template examples.
Leave VITE_ENABLE_ADMIN unset to remove the legacy local CMS from the bundle.

Run locally:

```bash
pnpm install --frozen-lockfile
pnpm run check
pnpm run build
python3 scripts/check-public-imports.py
```

The workflow runs on pushes to main and can also be dispatched manually.
BASE_PATH defaults to / for the custom domain. GitHub Pages serves public/CNAME
and public/404.html. The latter redirects deep links through ?route= so the
client router can restore the path.

The site requires JavaScript and the live public API. Article metadata and
no-JavaScript content are future request-time rendering work; editorial data
must remain outside CI.
