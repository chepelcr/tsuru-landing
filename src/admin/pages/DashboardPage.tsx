import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAdminStore } from "@/lib/admin-store";
import { resolveIcon } from "@/lib/icons";
import { guardNavigation } from "@/lib/admin-ui";
import { PageHeader } from "@/components/admin/PageHeader";
import { PAGES, type Lang } from "@/admin/manifest";

export default function DashboardPage() {
  const { language, t } = useLanguage();
  const lang = language as Lang;
  const [, navigate] = useLocation();
  const examples = useAdminStore((s) => s.examples);
  const blog = useAdminStore((s) => s.blog);
  const navigation = useAdminStore((s) => s.navigation);
  const media = useAdminStore((s) => s.media);

  const counts: Record<string, number> = {
    "examples.json": examples.stores.length,
    "blog.json": blog.articles.length,
    "navigation.json": navigation.primary.length,
    "media.json": media.items.length,
  };

  const go = (href: string) => {
    if (!guardNavigation(href)) navigate(href);
  };

  return (
    <div>
      <PageHeader title={t("admin.pages.dashboard")} description={t("admin.dashboard.subtitle")} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PAGES.map((p) => {
          const Icon = resolveIcon(p.icon);
          const count = counts[p.file];
          return (
            <button
              key={p.route}
              type="button"
              onClick={() => go(p.route)}
              className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 text-left transition-colors hover:border-primary"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-foreground">{p.label[lang]}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {count !== undefined
                    ? `${count} ${t("admin.dashboard.items")}`
                    : t("admin.dashboard.edit")}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
