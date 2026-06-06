// Templates — READ-ONLY live view of the store templates fetched from the
// platform API (same query as the public Examples page). NOT a content entity:
// no admin-store slice, no save wiring, no content-versions row. Templates are
// managed in the main dashboard; this is purely a live read-only list.

import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Info, Loader2, AlertCircle, Store } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader } from "@/components/admin/PageHeader";

interface Template {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  thumbnailUrl?: string;
  isActive: boolean;
  sortOrder: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export default function TemplatesPage() {
  const { t } = useLanguage();

  const { data: templates, isLoading, isError, error } = useQuery<Template[]>({
    queryKey: [`${API_BASE_URL}/api/templates?activeOnly=true`],
  });

  const rows = (templates || [])
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div>
      <PageHeader
        title={t("admin.templates.title")}
        description={t("admin.templates.subtitle")}
      />

      <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <span>{t("admin.templates.readOnlyNote")}</span>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center gap-3 py-20 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span>{t("admin.templates.loading")}</span>
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-7 w-7 text-destructive" />
          </div>
          <p className="max-w-md text-muted-foreground">
            {error instanceof Error ? error.message : t("admin.templates.error")}
          </p>
        </div>
      )}

      {!isLoading && !isError && rows.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <Store className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">{t("admin.templates.empty")}</p>
        </div>
      )}

      {!isLoading && !isError && rows.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3">{t("admin.templates.colName")}</th>
                <th className="px-5 py-3">{t("admin.templates.colCategory")}</th>
                <th className="px-5 py-3">{t("admin.templates.colSlug")}</th>
                <th className="px-5 py-3">{t("admin.templates.colStatus")}</th>
                <th className="px-5 py-3 text-right">{t("admin.templates.colStore")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((tpl) => {
                const url = `https://${tpl.name}-example.j-markets.jcampos.dev`;
                return (
                  <tr key={tpl.id} className="hover:bg-muted/40">
                    <td className="px-5 py-3 font-medium text-foreground">{tpl.displayName}</td>
                    <td className="px-5 py-3 capitalize text-muted-foreground">{tpl.category}</td>
                    <td className="px-5 py-3">
                      <code className="text-xs text-muted-foreground">{tpl.name}</code>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          tpl.isActive
                            ? "bg-emerald-500/15 text-emerald-600"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {tpl.isActive
                          ? t("admin.templates.active")
                          : t("admin.templates.inactive")}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                      >
                        {t("admin.templates.viewStore")}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
