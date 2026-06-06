// Diagnostics — read-only site status page. Health checks (computed from the
// store), content stats, system info, and a paginated recent-commits panel via
// fetchGitLog (graceful "unavailable" off the dev server). No Save / no dirty.

import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, ChevronLeft, ChevronRight, GitCommit } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useAdminStore } from "@/lib/admin-store";
import { fetchGitLog, type GitCommit as Commit } from "@/lib/local-cms";
import { PageHeader } from "@/components/admin/PageHeader";
import { CONTENT_PAGES, filesForPage } from "@/admin/manifest";

const PAGE_SIZE = 10;

interface HealthCheck {
  labelKey: string;
  ok: boolean;
}

export default function DiagnosticsPage() {
  const { language, t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const store = useAdminStore();

  // (a) Health checks computed from the store.
  const branding = store.branding as { companyName?: string };
  const seo = store.seo as { siteUrl?: string };
  const themes = store.themes as Array<{ isActive?: boolean; name?: string }>;
  const media = store.media as { items: unknown[] };
  const landing = store.landing as Record<string, unknown>;
  const about = store.about as Record<string, unknown>;

  const activeThemes = (themes ?? []).filter((th) => th.isActive);
  const checks: HealthCheck[] = [
    { labelKey: "admin.diagnostics.checkBranding", ok: !!branding?.companyName?.trim() },
    { labelKey: "admin.diagnostics.checkSeoUrl", ok: !!seo?.siteUrl?.trim() },
    { labelKey: "admin.diagnostics.checkTheme", ok: activeThemes.length === 1 },
    { labelKey: "admin.diagnostics.checkMedia", ok: (media?.items?.length ?? 0) > 0 },
    {
      labelKey: "admin.diagnostics.checkPage",
      ok: !!landing && Object.keys(landing).length > 0 && !!about && Object.keys(about).length > 0,
    },
  ];

  // (b) Content stats.
  const blog = store.blog as { articles: unknown[] };
  const navigation = store.navigation as { primary: unknown[] };
  const entityCount = CONTENT_PAGES.reduce((acc, p) => acc + filesForPage(p).length, 0);
  const stats: { labelKey: string; value: number }[] = [
    { labelKey: "admin.diagnostics.statBlog", value: blog?.articles?.length ?? 0 },
    { labelKey: "admin.diagnostics.statNav", value: navigation?.primary?.length ?? 0 },
    { labelKey: "admin.diagnostics.statMedia", value: media?.items?.length ?? 0 },
    { labelKey: "admin.diagnostics.statEntities", value: entityCount },
  ];

  // (c) System info.
  const mode = import.meta.env.DEV
    ? t("admin.diagnostics.modeDev")
    : t("admin.diagnostics.modeProd");
  const activeThemeName = activeThemes[0]?.name ?? "—";
  const sysInfo: { labelKey: string; value: string }[] = [
    { labelKey: "admin.diagnostics.mode", value: mode },
    { labelKey: "admin.diagnostics.language", value: language },
    { labelKey: "admin.diagnostics.theme", value: `${activeThemeName} · ${resolvedTheme}` },
    { labelKey: "admin.diagnostics.baseUrl", value: import.meta.env.BASE_URL },
  ];

  // (d) Recent commits (paginated).
  const [skip, setSkip] = useState(0);
  const [log, setLog] = useState<{ ok: boolean; total?: number; commits?: Commit[] }>({ ok: true });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchGitLog(skip, PAGE_SIZE).then((res) => {
      if (alive) {
        setLog(res);
        setLoading(false);
      }
    });
    return () => {
      alive = false;
    };
  }, [skip]);

  const total = log.total ?? 0;
  const commits = log.commits ?? [];

  return (
    <div>
      <PageHeader
        title={t("admin.diagnostics.title")}
        description={t("admin.diagnostics.subtitle")}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Health checks */}
        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {t("admin.diagnostics.health")}
          </h2>
          <ul className="space-y-2">
            {checks.map((c) => (
              <li key={c.labelKey} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-foreground">{t(c.labelKey)}</span>
                {c.ok ? (
                  <span className="inline-flex items-center gap-1.5 text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" /> {t("admin.diagnostics.ok")}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-destructive">
                    <AlertCircle className="h-4 w-4" /> {t("admin.diagnostics.missing")}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* Content stats */}
        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {t("admin.diagnostics.stats")}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {stats.map((s) => (
              <div key={s.labelKey} className="rounded-xl border border-border bg-background/40 p-3">
                <div className="text-2xl font-bold text-foreground">{s.value}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{t(s.labelKey)}</div>
              </div>
            ))}
          </div>
        </section>

        {/* System info */}
        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {t("admin.diagnostics.system")}
          </h2>
          <dl className="space-y-2 text-sm">
            {sysInfo.map((s) => (
              <div key={s.labelKey} className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">{t(s.labelKey)}</dt>
                <dd className="font-mono text-foreground">{s.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Recent commits */}
        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {t("admin.diagnostics.commits")}
          </h2>
          {!loading && !log.ok ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              {t("admin.diagnostics.commitsUnavailable")}
            </p>
          ) : !loading && commits.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              {t("admin.diagnostics.noCommits")}
            </p>
          ) : (
            <>
              <ul className="space-y-2">
                {commits.map((c) => (
                  <li key={c.hash} className="flex items-start gap-2.5 text-sm">
                    <GitCommit className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <div className="truncate text-foreground">{c.subject}</div>
                      <div className="text-xs text-muted-foreground">
                        <code>{c.shortHash}</code> · {c.author} · {c.date}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center justify-between">
                <button
                  type="button"
                  disabled={skip === 0}
                  onClick={() => setSkip((s) => Math.max(0, s - PAGE_SIZE))}
                  className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" /> {t("admin.diagnostics.prev")}
                </button>
                <span className="text-xs text-muted-foreground">
                  {skip + 1}–{Math.min(skip + commits.length, total || skip + commits.length)}
                  {total ? ` / ${total}` : ""}
                </span>
                <button
                  type="button"
                  disabled={total ? skip + PAGE_SIZE >= total : commits.length < PAGE_SIZE}
                  onClick={() => setSkip((s) => s + PAGE_SIZE)}
                  className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted disabled:opacity-40"
                >
                  {t("admin.diagnostics.next")} <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
