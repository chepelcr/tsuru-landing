// Public origins of the sibling Tsuru surfaces. Each environment's build sets
// them (prod: *.tsuru.lat); the defaults are dev's.
const origin = (value: string | undefined, fallback: string) => (value || fallback).replace(/\/+$/, '');

export const APP_URL = origin(import.meta.env.VITE_APP_URL, 'https://app.tsuru.jcampos.dev');
export const LOGIN_URL = `${APP_URL}/login`;
export const REGISTER_URL = `${APP_URL}/register`;
export const BLOG_SITE_URL = origin(import.meta.env.VITE_BLOG_SITE_URL, 'https://blogs.tsuru.jcampos.dev');

// Published plans can contain app links authored for a different environment.
export function resolveAppAccessUrl(href: string): string | undefined {
  const url = new URL(href, window.location.origin);
  const isAppHost = url.origin === APP_URL || ["app.tsuru.jcampos.dev", "app.tsuru.lat"].includes(url.hostname);
  const isLocalAuthPath = url.origin === window.location.origin && ["/login", "/register"].includes(url.pathname);
  if (isAppHost || isLocalAuthPath) {
    return `${APP_URL}${url.pathname}${url.search}${url.hash}`;
  }
}
