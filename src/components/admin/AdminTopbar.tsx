// Admin topbar — Publish button (simplified pending/clean states), Sun/Moon
// dark toggle (ThemeContext), an in-place language toggle (no navigation), and a
// View-site link. All labels are bilingual via t().

import { useEffect, useState } from "react";
import { Menu, Sun, Moon, ExternalLink, UploadCloud, Loader2, Check, Info, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useAdminUi, guardNavigation } from "@/lib/admin-ui";
import { publishChanges } from "@/lib/local-cms";

type PublishState =
  | { kind: "idle" }
  | { kind: "publishing" }
  | { kind: "success"; hash: string }
  | { kind: "nothing" }
  | { kind: "error"; error: string };

const LANGS: Array<"es" | "en"> = ["es", "en"];

export function AdminTopbar({ onMenu }: { onMenu: () => void }) {
  const { language, setLanguage, t } = useLanguage();
  const { resolvedTheme, setTheme } = useTheme();
  const pendingPublish = useAdminUi((s) => s.pendingPublish);
  const refreshPublish = useAdminUi((s) => s.refreshPublish);
  const [state, setState] = useState<PublishState>({ kind: "idle" });

  useEffect(() => {
    void refreshPublish();
    const onChange = () => void refreshPublish();
    window.addEventListener("focus", onChange);
    window.addEventListener("tsuru:content-saved", onChange);
    return () => {
      window.removeEventListener("focus", onChange);
      window.removeEventListener("tsuru:content-saved", onChange);
    };
  }, [refreshPublish]);

  const doPublish = async () => {
    setState({ kind: "publishing" });
    const r = await publishChanges();
    if (r.nothingToPublish) setState({ kind: "nothing" });
    else if (r.ok) setState({ kind: "success", hash: r.hash ?? "" });
    else setState({ kind: "error", error: r.error ?? "error" });
    await refreshPublish();
    setTimeout(() => setState({ kind: "idle" }), 4000);
  };

  const publishStyles: Record<PublishState["kind"], string> = {
    idle: pendingPublish
      ? "bg-primary text-primary-foreground hover:bg-primary/90"
      : "bg-muted text-muted-foreground cursor-not-allowed",
    publishing: "bg-primary/80 text-primary-foreground cursor-wait",
    success: "bg-success text-success-foreground",
    nothing: "bg-muted text-muted-foreground",
    error: "bg-destructive text-destructive-foreground",
  };

  const publishLabel = () => {
    switch (state.kind) {
      case "publishing":
        return t("admin.publishing");
      case "success":
        return `${t("admin.published")}${state.hash ? ` · ${state.hash}` : ""}`;
      case "nothing":
        return t("admin.nothingToPublish");
      case "error":
        return t("admin.publishError");
      default:
        return t("admin.publish");
    }
  };

  const PublishIcon = () => {
    switch (state.kind) {
      case "publishing":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "success":
        return <Check className="h-4 w-4" />;
      case "nothing":
        return <Info className="h-4 w-4" />;
      case "error":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <UploadCloud className="h-4 w-4" />;
    }
  };

  const disabled = state.kind === "publishing" || (state.kind === "idle" && !pendingPublish);

  const onViewSite = (e: React.MouseEvent) => {
    if (guardNavigation("/")) e.preventDefault();
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card px-4">
      <button
        type="button"
        onClick={onMenu}
        className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
        aria-label="menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <span className="text-sm font-bold text-foreground">{t("admin.appName")}</span>

      <div className="flex-1" />

      {/* language toggle (in place) */}
      <div
        className="flex items-center rounded-lg border border-border p-0.5"
        role="group"
        aria-label={t("admin.language")}
      >
        {LANGS.map((lng) => (
          <button
            key={lng}
            type="button"
            onClick={() => setLanguage(lng)}
            className={`rounded-md px-2 py-1 text-xs font-semibold uppercase transition-colors ${
              language === lng
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {lng}
          </button>
        ))}
      </div>

      {/* theme toggle */}
      <button
        type="button"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
        title={t("admin.toggleTheme")}
        aria-label={t("admin.toggleTheme")}
      >
        <Sun className="absolute h-4 w-4 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
      </button>

      {/* view site */}
      <a
        href="/"
        onClick={onViewSite}
        className="hidden h-9 items-center gap-1.5 rounded-lg px-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground sm:flex"
        title={t("admin.viewSite")}
      >
        <ExternalLink className="h-4 w-4" />
      </a>

      {/* publish */}
      <button
        type="button"
        onClick={doPublish}
        disabled={disabled}
        title={state.kind === "error" ? state.error : undefined}
        className={`flex h-9 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors disabled:opacity-90 ${publishStyles[state.kind]}`}
      >
        <PublishIcon />
        <span className="hidden md:inline">{publishLabel()}</span>
      </button>
    </header>
  );
}
