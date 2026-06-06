// Content explorer — read-only two-column master-detail browser.
// LEFT: every content file (manifest file-backed rows), icon + localized label
// + raw filename subtitle; first selected by default. RIGHT: recursive
// collapsible JSON tree of the selected file's live store value. No editing.

import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAdminStore } from "@/lib/admin-store";
import { resolveIcon } from "@/lib/icons";
import { PageHeader } from "@/components/admin/PageHeader";
import { CONTENT_PAGES, filesForPage, labelForFile, type Lang } from "@/admin/manifest";

// filename → live store value (same source ContentVersions uses).
function useFileValues(): Record<string, unknown> {
  const s = useAdminStore();
  return {
    "branding.json": s.branding,
    "themes.json": s.themes,
    "navigation.json": s.navigation,
    "media.json": s.media,
    "settings.json": s.settings,
    "blog.json": s.blog,
    "seo.json": s.seo,
    "landing.json": s.landing,
    "features.json": s.features,
    "fairs.json": s.fairs,
    "community.json": s.community,
    "about.json": s.about,
    "contact.json": s.contact,
    "terms.json": s.terms,
    "privacy.json": s.privacy,
    "cookies.json": s.cookies,
    "blog-chrome.json": s.blogChrome,
    "navbar.json": s.navbar,
    "footer.json": s.footer,
    "ui.json": s.ui,
    "cta-security.json": s.ctaSecurity,
    "inventory.json": s.inventory,
  };
}

export default function ContentExplorerPage() {
  const { language, t } = useLanguage();
  const lang = language as Lang;
  const values = useFileValues();

  // One row per underlying content file, carrying its icon from its page.
  const files = useMemo(
    () =>
      CONTENT_PAGES.flatMap((p) =>
        filesForPage(p).map((file) => ({ file, icon: p.icon })),
      ),
    [],
  );

  const [selected, setSelected] = useState<string>(files[0]?.file ?? "");

  return (
    <div>
      <PageHeader title={t("admin.explorer.title")} description={t("admin.explorer.subtitle")} />

      <div className="grid gap-4 lg:grid-cols-[18rem_1fr]">
        {/* LEFT: file list */}
        <aside className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="border-b border-border px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {t("admin.explorer.files")}
          </div>
          <ul className="max-h-[70vh] overflow-y-auto p-2">
            {files.map(({ file, icon }) => {
              const Icon = resolveIcon(icon);
              const sel = file === selected;
              return (
                <li key={file}>
                  <button
                    type="button"
                    onClick={() => setSelected(file)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                      sel
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">
                        {labelForFile(file, lang)}
                      </span>
                      <span
                        className={`block truncate font-mono text-[11px] ${
                          sel ? "text-sidebar-primary-foreground/70" : "text-muted-foreground"
                        }`}
                      >
                        {file}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* RIGHT: JSON tree */}
        <section className="overflow-hidden rounded-2xl border border-border bg-card">
          {selected ? (
            <div className="max-h-[70vh] overflow-auto p-4">
              <div className="mb-3 font-mono text-xs text-muted-foreground">{selected}</div>
              <div className="font-mono text-[13px] leading-relaxed">
                <JsonNode
                  name={null}
                  value={values[selected]}
                  depth={0}
                  itemsLabel={t("admin.explorer.items")}
                />
              </div>
            </div>
          ) : (
            <p className="p-10 text-center text-sm text-muted-foreground">
              {t("admin.explorer.empty")}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

function leafClass(value: unknown): string {
  if (value === null) return "text-muted-foreground";
  switch (typeof value) {
    case "string":
      return "text-emerald-600 dark:text-emerald-400";
    case "number":
      return "text-sky-600 dark:text-sky-400";
    case "boolean":
      return "text-amber-600 dark:text-amber-400";
    default:
      return "text-foreground";
  }
}

function leafText(value: unknown): string {
  if (value === null) return "null";
  if (typeof value === "string") return `"${value}"`;
  return String(value);
}

function JsonNode({
  name,
  value,
  depth,
  itemsLabel,
}: {
  name: string | null;
  value: unknown;
  depth: number;
  itemsLabel: string;
}) {
  const isObject = value !== null && typeof value === "object";
  const [open, setOpen] = useState(depth < 1);

  const key =
    name !== null ? (
      <span className="text-foreground/80">{name}: </span>
    ) : null;

  if (!isObject) {
    return (
      <div className="py-0.5" style={{ paddingLeft: depth * 14 }}>
        {key}
        <span className={leafClass(value)}>{leafText(value)}</span>
      </div>
    );
  }

  const isArray = Array.isArray(value);
  const entries = isArray
    ? (value as unknown[]).map((v, i) => [String(i), v] as const)
    : Object.entries(value as Record<string, unknown>);
  const count = entries.length;

  return (
    <div className="py-0.5" style={{ paddingLeft: depth * 14 }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1 text-left hover:opacity-80"
      >
        {open ? (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        )}
        {key}
        <span className="text-muted-foreground">
          {isArray ? `[${count}]` : `{${count}}`}
          {!open && (
            <span className="ml-1 text-[11px]">
              {count} {itemsLabel}
            </span>
          )}
        </span>
      </button>
      {open &&
        entries.map(([k, v]) => (
          <JsonNode key={k} name={k} value={v} depth={depth + 1} itemsLabel={itemsLabel} />
        ))}
    </div>
  );
}
