// Admin-only media-library mutators. They add an item to the `media` store
// slice AND persist media.json. Imported only by admin code, so they tree-shake
// out of the public bundle.

import { useAdminStore, downloadJson } from "./admin-store";
import { uploadAsset } from "./local-cms";
import type { MediaItem, MediaKind } from "./media";

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function sanitizeFilename(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
}

function dedupe(name: string, taken: Set<string>): string {
  if (!taken.has(name)) return name;
  const dot = name.lastIndexOf(".");
  const base = dot >= 0 ? name.slice(0, dot) : name;
  const ext = dot >= 0 ? name.slice(dot) : "";
  let i = 1;
  let candidate = `${base}-${i}${ext}`;
  while (taken.has(candidate)) candidate = `${base}-${++i}${ext}`;
  return candidate;
}

function kindFromMime(mime: string): MediaKind {
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  return "image";
}

/** Upload a File to public/media/ via the local-cms endpoint, register it in
 *  media.json, and return the new item. Returns null when the dev endpoint is
 *  unavailable (no local server). */
export async function uploadToLibrary(file: File): Promise<MediaItem | null> {
  const dataUrl = await readAsDataUrl(file);
  const lib = useAdminStore.getState().media;
  const filename = dedupe(
    sanitizeFilename(file.name),
    new Set(lib.items.map((i) => i.filename)),
  );
  const res = await uploadAsset(filename, dataUrl, "media");
  if (!res.ok || !res.url) return null;
  const item: MediaItem = {
    id: `media-${Date.now()}`,
    kind: kindFromMime(file.type),
    source: "local",
    path: res.url,
    filename,
    mime: file.type,
    size: file.size,
    alt: { es: "", en: "" },
    createdAt: new Date().toISOString(),
  };
  const next = { items: [item, ...lib.items] };
  useAdminStore.getState().setMedia(next);
  await downloadJson("media.json", next);
  return item;
}

/** Register an off-site URL as an external media item (no upload, no network). */
export async function addExternalToLibrary(
  url: string,
  kind: MediaKind = "image",
): Promise<MediaItem> {
  const lib = useAdminStore.getState().media;
  const item: MediaItem = {
    id: `media-${Date.now()}`,
    kind,
    source: "external",
    url,
    filename: url.split("/").pop() || url,
    mime: "",
    size: 0,
    alt: { es: "", en: "" },
    createdAt: new Date().toISOString(),
  };
  const next = { items: [item, ...lib.items] };
  useAdminStore.getState().setMedia(next);
  await downloadJson("media.json", next);
  return item;
}

/** Drop one item from the library and persist. */
export async function removeFromLibrary(id: string): Promise<void> {
  const lib = useAdminStore.getState().media;
  const next = { items: lib.items.filter((i) => i.id !== id) };
  useAdminStore.getState().setMedia(next);
  await downloadJson("media.json", next);
}
