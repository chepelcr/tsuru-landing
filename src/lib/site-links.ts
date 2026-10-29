// Public origins of the sibling Tsuru surfaces. Each environment's build sets
// them (prod: *.tsuru.lat); the defaults are dev's.
const origin = (value: string | undefined, fallback: string) => (value || fallback).replace(/\/+$/, '');

export const APP_URL = origin(import.meta.env.VITE_APP_URL, 'https://app.tsuru.jcampos.dev');
export const REGISTER_URL = `${APP_URL}/register`;
export const BLOG_SITE_URL = origin(import.meta.env.VITE_BLOG_SITE_URL, 'https://blogs.tsuru.jcampos.dev');

// Published plans can still contain the dev origin after a production cutover.
export function isAppAccessUrl(href: string): boolean {
  const url = new URL(href, window.location.origin);
  return url.origin === APP_URL || ["app.tsuru.jcampos.dev", "app.tsuru.lat"].includes(url.hostname)
    || ["/login", "/register"].includes(url.pathname);
}
