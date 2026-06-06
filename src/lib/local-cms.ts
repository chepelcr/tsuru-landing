// Local CMS browser client — thin fetch wrappers around the dev-only Vite
// middleware (vite-plugin-local-cms, a later phase). Every call is gated by
// LOCAL_CMS_ENABLED (= import.meta.env.DEV) and degrades gracefully — returning
// false / empty results — when the endpoint is absent (prod build, or the dev
// plugin not yet installed), so callers fall back to a browser download.

export const LOCAL_CMS_ENABLED = import.meta.env.DEV;

/** Write a content/translation JSON file back to disk in dev. Returns false on
 *  any failure / non-dev so the caller falls back to a browser download. */
export async function saveContentFile(filename: string, data: unknown): Promise<boolean> {
  if (!LOCAL_CMS_ENABLED) return false;
  try {
    const res = await fetch("/__local/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename, data }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Upload a data-URL asset to public/ (dir "" or "media"). Returns the stored
 *  root-relative url on success. No-ops (ok:false) without the dev endpoint. */
export async function uploadAsset(
  filename: string,
  dataUrl: string,
  dir?: "" | "media",
): Promise<{ ok: boolean; url?: string; error?: string }> {
  if (!LOCAL_CMS_ENABLED) return { ok: false };
  try {
    const res = await fetch("/__local/asset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename, dataUrl, dir }),
    });
    const json = await res.json();
    return { ok: res.ok && !!json.ok, url: json.url as string | undefined, error: json.error };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

/** Commit + push the publish dirs. Degrades to { ok:false } off the dev server. */
export async function publishChanges(): Promise<{
  ok: boolean;
  hash?: string;
  branch?: string;
  message?: string;
  nothingToPublish?: boolean;
  error?: string;
}> {
  if (!LOCAL_CMS_ENABLED) return { ok: false, error: "unavailable" };
  try {
    const res = await fetch("/__local/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    return await res.json();
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

/** Working-tree status (drives the Publish button). Empty/clean when missing. */
export async function fetchGitStatus(): Promise<{ ok: boolean; pending: boolean; files?: number }> {
  if (!LOCAL_CMS_ENABLED) return { ok: false, pending: false };
  try {
    const res = await fetch("/__local/git-status");
    const json = await res.json();
    return { ok: !!json.ok, pending: !!json.pending, files: json.files };
  } catch {
    return { ok: false, pending: false };
  }
}

export interface GitCommit {
  hash: string;
  shortHash: string;
  subject: string;
  author: string;
  date: string;
}

/** Paginated commit log (Diagnostics). Empty when the endpoint is missing. */
export async function fetchGitLog(
  skip = 0,
  limit = 10,
): Promise<{ ok: boolean; branch?: string; total?: number; commits?: GitCommit[] }> {
  if (!LOCAL_CMS_ENABLED) return { ok: false };
  try {
    const res = await fetch(`/__local/git-log?skip=${skip}&limit=${limit}`);
    return await res.json();
  } catch {
    return { ok: false };
  }
}
