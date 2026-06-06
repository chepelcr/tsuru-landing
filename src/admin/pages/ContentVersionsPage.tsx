// Content versions — lists every manifest entity (expanded to its underlying
// files) with a Download JSON button. The fourth completeness piece.

import { Download } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAdminStore, downloadJson } from "@/lib/admin-store";
import { PageHeader } from "@/components/admin/PageHeader";
import { PAGES, filesForPage, type Lang } from "@/admin/manifest";

// filename → live store value for export.
function useFileValues(): Record<string, unknown> {
  const s = useAdminStore();
  return {
    "branding.json": s.branding,
    "themes.json": s.themes,
    "navigation.json": s.navigation,
    "media.json": s.media,
    "settings.json": s.settings,
    "examples.json": s.examples,
    "blog.json": s.blog,
    "seo.json": s.seo,
    "translations/en.json": s.translationsEn,
    "translations/es.json": s.translationsEs,
  };
}

export default function ContentVersionsPage() {
  const { language, t } = useLanguage();
  const lang = language as Lang;
  const values = useFileValues();

  const rows = PAGES.flatMap((p) =>
    filesForPage(p).map((file) => ({ file, label: p.label[lang] })),
  );

  return (
    <div>
      <PageHeader title={t("admin.pages.versions")} description={t("admin.versions.subtitle")} />
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-border">
            {rows.map(({ file, label }) => (
              <tr key={file} className="hover:bg-muted/40">
                <td className="px-5 py-3 font-medium text-foreground">{label}</td>
                <td className="px-5 py-3">
                  <code className="text-xs text-muted-foreground">{file}</code>
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => downloadJson(file, values[file])}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                  >
                    <Download className="h-3.5 w-3.5" /> {t("admin.versions.download")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
