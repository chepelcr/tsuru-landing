// The load-bearing constant for the dev-only admin CMS.
//
// In a normal production build (`VITE_ENABLE_ADMIN` unset) this folds to a
// literal `false`, so every `if (ADMIN_ENABLED)` branch and the dynamic admin
// imports behind it are tree-shaken out by Rollup. The admin has NO
// authentication — this gate is the only thing keeping it off the public site.
// Never register `/admin` unconditionally and never default VITE_ENABLE_ADMIN to
// "true" in CI.
export const ADMIN_ENABLED =
  import.meta.env.DEV || import.meta.env.VITE_ENABLE_ADMIN === "true";
