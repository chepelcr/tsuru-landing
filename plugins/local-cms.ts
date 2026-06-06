// Dev-only Vite plugin: write content/translations back to disk, upload media,
// publish (git add + commit + push), and read git status/log for the admin CMS.
//
// Registered with `apply: "serve"` so it exists ONLY on the dev server and is
// NEVER part of a production build — no /__local code reaches dist/landing.
// Every endpoint also refuses non-local hosts as defense in depth.
//
// Browser client lives in src/lib/local-cms.ts; these endpoints/payloads match
// it exactly:
//   POST /__local/content    { filename, data }            -> { ok, path }
//   POST /__local/asset      { filename, dataUrl, dir? }    -> { ok, path, url }
//   POST /__local/publish    {}                             -> { ok, hash, branch, message } | { ok, nothingToPublish }
//   GET  /__local/git-status                                -> { ok, pending, files }
//   GET  /__local/git-log?skip=&limit=                      -> { ok, branch, total, skip, limit, commits[] }

import type { Plugin, ViteDevServer } from "vite";
import { promises as fs } from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { IncomingMessage, ServerResponse } from "node:http";

const execFileAsync = promisify(execFile);

const JSON_NAME = /^[a-zA-Z0-9_-]+\.json$/;
const ASSET_NAME = /^[a-zA-Z0-9_-]+\.(png|jpe?g|webp|svg|ico|gif|avif|mp4|webm|ogg|mov|mp3|wav|m4a)$/i;
const ASSET_DIRS = new Set(["", "media"]); // where uploads may land under public/
const MAX_ASSET_BYTES = 25 * 1024 * 1024; // cap so a stray file can't exhaust memory
const PUBLISH_PATHS = ["src/content", "src/translations", "public"];

type Reply = (code: number, payload: unknown) => void;

async function git(args: string[], cwd: string): Promise<string> {
  const { stdout } = await execFileAsync("git", args, { cwd, maxBuffer: 10 * 1024 * 1024 });
  return stdout.trim();
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let d = "";
    req.on("data", (c) => (d += c));
    req.on("end", () => resolve(d));
    req.on("error", reject);
  });
}

/** Reject any name that isn't a bare basename inside the intended dir. */
function safe(dir: string, name: string): string {
  const target = path.join(dir, name);
  if (target !== path.join(dir, path.basename(name))) throw new Error("invalid path");
  return target;
}

async function isGitRepo(root: string): Promise<boolean> {
  try {
    return (await git(["rev-parse", "--is-inside-work-tree"], root)) === "true";
  } catch {
    return false;
  }
}

async function writeContent(
  body: { filename?: unknown; data?: unknown },
  reply: Reply,
  ctx: { contentDir: string; translationsDir: string; root: string },
) {
  const { filename, data } = body;
  if (typeof filename !== "string" || !JSON_NAME.test(filename)) throw new Error("bad filename");
  const dir = filename === "es.json" || filename === "en.json" ? ctx.translationsDir : ctx.contentDir;
  const target = safe(dir, filename);
  await fs.writeFile(target, JSON.stringify(data, null, 2) + "\n", "utf8");
  return reply(200, { ok: true, path: path.relative(ctx.root, target) });
}

async function writeAsset(
  body: { filename?: unknown; dataUrl?: unknown; dir?: unknown },
  reply: Reply,
  ctx: { publicDir: string; root: string },
) {
  const { filename, dataUrl, dir } = body;
  if (typeof filename !== "string" || !ASSET_NAME.test(filename)) throw new Error("bad filename");
  const subdir = typeof dir === "string" ? dir : "";
  if (!ASSET_DIRS.has(subdir)) throw new Error("bad dir");
  const m = /^data:[^;]+;base64,(.+)$/s.exec(typeof dataUrl === "string" ? dataUrl : "");
  if (!m) throw new Error("bad dataUrl");
  const buf = Buffer.from(m[1], "base64");
  if (buf.length > MAX_ASSET_BYTES) throw new Error("file too large (max 25 MB)");
  const destDir = subdir ? path.join(ctx.publicDir, subdir) : ctx.publicDir;
  await fs.mkdir(destDir, { recursive: true });
  const target = safe(destDir, filename);
  await fs.writeFile(target, buf);
  const url = "/" + (subdir ? `${subdir}/` : "") + filename; // root-relative, store this in content
  return reply(200, { ok: true, path: path.relative(ctx.root, target), url });
}

async function publish(reply: Reply, root: string, server: ViteDevServer) {
  if (!(await isGitRepo(root))) return reply(400, { ok: false, error: "not a git repository" });
  await git(["add", "-A", "--", ...PUBLISH_PATHS], root);
  let hasStaged = false;
  try {
    await git(["diff", "--cached", "--quiet"], root);
  } catch {
    hasStaged = true;
  }
  if (!hasStaged) return reply(200, { ok: true, nothingToPublish: true });
  const message = `content: update via admin (${new Date().toISOString()})`;
  await git(["commit", "-m", message], root);
  const hash = await git(["rev-parse", "--short", "HEAD"], root);
  const branch = await git(["rev-parse", "--abbrev-ref", "HEAD"], root);
  await git(["push"], root);
  server.config.logger.info(`[local-cms] published ${hash} -> ${branch}`);
  return reply(200, { ok: true, hash, branch, message });
}

async function gitStatus(reply: Reply, root: string) {
  if (!(await isGitRepo(root))) return reply(200, { ok: false, pending: false, files: 0 });
  const out = await git(["status", "--porcelain", "--", ...PUBLISH_PATHS], root);
  const files = out ? out.split("\n").filter(Boolean).length : 0;
  return reply(200, { ok: true, pending: files > 0, files });
}

async function gitLog(req: IncomingMessage, reply: Reply, root: string) {
  if (!(await isGitRepo(root))) return reply(200, { ok: false, commits: [] });
  const q = new URL(req.url ?? "", "http://localhost").searchParams;
  const skip = Math.max(0, Number(q.get("skip")) || 0);
  const limit = Math.min(100, Math.max(1, Number(q.get("limit")) || 10));
  const branch = await git(["rev-parse", "--abbrev-ref", "HEAD"], root);
  const total = Number(await git(["rev-list", "--count", "HEAD"], root)) || 0;
  const raw = await git(
    ["log", `--skip=${skip}`, "-n", String(limit), "--pretty=format:%H%x1f%s%x1f%an%x1f%cI%x1e"],
    root,
  );
  const commits = raw
    .split("\x1e")
    .map((s) => s.replace(/^\n/, ""))
    .filter(Boolean)
    .map((line) => {
      const [hash, subject, author, date] = line.split("\x1f");
      return { hash, shortHash: hash.slice(0, 7), subject, author, date };
    });
  return reply(200, { ok: true, branch, total, skip, limit, commits });
}

export function localCms(): Plugin {
  return {
    name: "local-cms",
    apply: "serve", // dev-only -> never in the prod bundle
    configureServer(server) {
      const root = server.config.root; // git cwd; git discovers the repo from here
      const contentDir = path.resolve(root, "src/content");
      const translationsDir = path.resolve(root, "src/translations");
      const publicDir = path.resolve(root, "public");

      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next) => {
        const method = req.method ?? "";
        if (!req.url?.startsWith("/__local/") || (method !== "POST" && method !== "GET")) return next();

        const reply: Reply = (code, payload) => {
          res.statusCode = code;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(payload));
        };

        // Local-authoring only.
        const host = (req.headers.host ?? "").toLowerCase();
        if (!(host.startsWith("localhost") || host.startsWith("127.0.0.1") || host.endsWith(".local")))
          return reply(403, { ok: false, error: "forbidden" });

        try {
          if (method === "GET" && req.url.startsWith("/__local/git-log")) return await gitLog(req, reply, root);
          if (method === "GET" && req.url.startsWith("/__local/git-status")) return await gitStatus(reply, root);
          if (method !== "POST") return reply(404, { ok: false, error: "unknown endpoint" });
          if (req.url.startsWith("/__local/publish")) return await publish(reply, root, server);

          const body = JSON.parse(await readBody(req));
          if (req.url.startsWith("/__local/content"))
            return await writeContent(body, reply, { contentDir, translationsDir, root });
          if (req.url.startsWith("/__local/asset")) return await writeAsset(body, reply, { publicDir, root });
          return reply(404, { ok: false, error: "unknown endpoint" });
        } catch (err) {
          const e = err as { stderr?: string; message?: string };
          return reply(400, { ok: false, error: (e?.stderr?.trim() || e?.message || String(err)).trim() });
        }
      });
    },
  };
}
