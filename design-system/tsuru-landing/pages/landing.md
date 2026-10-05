# Tsuru landing: implementation direction

Overrides MASTER.md for the public home page. Preserve the published green and earth brand palette and existing Playfair Display / Inter pairing; do not adopt dashboard typography or unverified certification claims.

Audience: Costa Rican independent sellers and small businesses receiving orders through conversation. Promise: organize products, customers and orders, share a storefront, and add invoicing when fiscal setup is ready. Primary action: create a free account. Secondary: inspect real examples.

Art direction: warm paper surfaces, forest green, editorial serif headings, fine rules, rounded 20–24px panels. One visual story: a seller's catalog flowing into an organized order. Custom SVG product illustration is decorative and explicitly illustrative; no invented revenue or customer metrics.

Journey: split hero with illustration → one interactive setup card → order example → storefront (available vs coming soon) → invoicing → pricing teaser → principles → community pillars → final action. Published copy remains in getContent, with no bundled fallback or seed changes.

Tokens: existing background/foreground/card/muted/primary/accent/border; content max 80rem; gutters 1/1.5/2rem; section spacing 3.5/5rem; headings balanced; body left aligned. Consistent 44px controls and visible focus.

Acceptance: no overflow at 375/768/1024/1440; both languages and themes; setup endpoints disabled, rapid navigation bounded, live announcements, directional transition, centered breathing rings, progress inside footer; reduced motion static; offscreen loops paused; public content import guard, typecheck and build pass. Retain current dedicated routes, metadata and GitHub Pages deep-link restoration.
