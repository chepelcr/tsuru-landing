// Typed fetch helper for the BE-connected admin sections (platform RBAC).
//
// The public landing site stays 100% static JSON DXP — this module is only ever
// imported from the gated admin tree, so normal prod builds tree-shake it out
// together with the rest of src/admin.
//
// Base URL comes from VITE_API_URL (the markets API, e.g.
// https://markets-api.jcampos.dev; point it at http://localhost:5000 for local
// dev against the Express server). The Cognito ID token from the session opened
// via src/lib/amplify.ts is attached as an Authorization bearer; the backend's
// requirePlatformAdmin (users.role === 'platform_admin') is the real gate.

import { fetchAuthSession } from "aws-amplify/auth";

export const ADMIN_API_BASE_URL: string = import.meta.env.VITE_API_URL || "";

/**
 * VITE_ADMIN_AUTH_MODE=open mirrors the server's ADMIN_AUTH_MODE=open: the
 * dedicated admin Cognito user pool does not exist yet, so the gate is skipped
 * and requests go out without a bearer. Remove once the admin Cognito ships.
 */
export const ADMIN_AUTH_OPEN: boolean = import.meta.env.VITE_ADMIN_AUTH_MODE === "open";

/** True when the build carries an explicit API base (recommended). */
export function isAdminApiConfigured(): boolean {
  return !!ADMIN_API_BASE_URL;
}

export class AdminApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
    this.body = body;
  }
}

async function authHeader(): Promise<Record<string, string>> {
  try {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();
    if (idToken) return { Authorization: `Bearer ${idToken}` };
  } catch {
    // No session — let the backend answer 401.
  }
  return {};
}

/**
 * Perform a JSON request against the markets API. Resolves with the parsed
 * body; rejects with AdminApiError carrying the HTTP status and the backend's
 * `{ error, message }` payload when present.
 */
export async function adminRequest<T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  body?: unknown,
): Promise<T> {
  const headers: Record<string, string> = await authHeader();
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const res = await fetch(`${ADMIN_API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let parsed: unknown = undefined;
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }
  }

  if (!res.ok) {
    const errBody = parsed as { error?: string; message?: string } | undefined;
    const message =
      (errBody && (errBody.message || errBody.error)) ||
      (typeof parsed === "string" && parsed) ||
      res.statusText ||
      `Request failed (${res.status})`;
    throw new AdminApiError(res.status, message, parsed);
  }

  return parsed as T;
}

/** Build a query string from defined params only. */
export function toQuery(params: Record<string, string | number | boolean | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") continue;
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}
