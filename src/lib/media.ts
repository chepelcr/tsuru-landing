// Media types + URL resolvers.
//
// A media item is either a `local` asset (root-relative `path` into public/media/)
// or an `external` asset (absolute `url`). Content fields store a single string
// ref; the public site renders it through these resolvers.

import seoData from "@/content/seo.json";

export type MediaKind = "image" | "video" | "audio";

export interface MediaItem {
  id: string;
  kind: MediaKind;
  source: "local" | "external";
  /** Root-relative path for local items (e.g. "/media/hero.webp"). */
  path?: string;
  /** Absolute URL for external items. */
  url?: string;
  filename: string;
  mime: string;
  size: number;
  alt?: { es: string; en: string };
  createdAt: string;
}

/** Vite base without trailing slash: "" for "/", "/repo" for "/repo/". */
const basePrefix = () => (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");

/**
 * Any stored ref (media path/url OR a branding field) → usable src/href.
 * Absolute/data URLs pass through; root-relative paths get the base prefix.
 */
export function resolveAssetUrl(ref?: string | null): string {
  if (!ref) return "";
  if (/^(https?:)?\/\//i.test(ref) || ref.startsWith("data:")) return ref;
  return ref.startsWith("/") ? basePrefix() + ref : ref;
}

/** Resolve a media item to a usable URL, by source. */
export const resolveMediaUrl = (i: MediaItem): string =>
  i.source === "external" ? resolveAssetUrl(i.url) : resolveAssetUrl(i.path);

/**
 * Value to STORE in a content field when an item is picked. Empty-string-aware:
 * prefer the key matching `source`, then fall back to the truthy one (items may
 * carry BOTH `path` and `url`), and never return undefined.
 */
export const mediaRef = (i: MediaItem): string =>
  (i.source === "external" ? i.url : i.path) ?? i.url ?? i.path ?? "";

/**
 * Absolute URL for OG/Twitter/sitemap/JSON-LD — joins seo.json siteUrl + base + path.
 * Absolute/data URLs pass through unchanged.
 */
export function absoluteAssetUrl(ref?: string | null): string {
  if (!ref) return "";
  if (/^https?:\/\//i.test(ref) || ref.startsWith("data:")) return ref;
  const site = (seoData.siteUrl ?? "").replace(/\/$/, "");
  return site + basePrefix() + (ref.startsWith("/") ? ref : `/${ref}`);
}
