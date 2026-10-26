// Public origins of the sibling Tsuru surfaces. Each environment's build sets
// them (prod: *.tsuru.lat); the defaults are dev's.
const origin = (value: string | undefined, fallback: string) => (value || fallback).replace(/\/+$/, '');

export const APP_URL = origin(import.meta.env.VITE_APP_URL, 'https://app.tsuru.jcampos.dev');
export const REGISTER_URL = `${APP_URL}/register`;
export const BLOG_SITE_URL = origin(import.meta.env.VITE_BLOG_SITE_URL, 'https://blogs.tsuru.jcampos.dev');
