// Translations — key-table editor over translations/en.json & es.json. Each flat
// dot-key shows es + en inputs side by side, grouped by the first key segment,
// with a filter box. Save writes BOTH files. Self-registers its editor (writes
// two files) so the floating Save and the nav guard cover both.

import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAdminStore, useEntityDirty, downloadJson } from "@/lib/admin-store";
import { useAdminUi } from "@/lib/admin-ui";
import { FloatingSaveButton } from "@/components/admin/PageHeader";
import { inputCls } from "@/components/admin/AdminUI";

type Dict = Record<string, string>;

export default function TranslationsPage() {
  const { t } = useLanguage();
  const store = useAdminStore();
  const setEditor = useAdminUi((s) => s.setEditor);
  const clearEditor = useAdminUi((s) => s.clearEditor);

  const [en, setEn] = useState<Dict>(() => structuredClone(store.translationsEn));
  const [es, setEs] = useState<Dict>(() => structuredClone(store.translationsEs));
  const [filter, setFilter] = useState("");

  const enDirty = useEntityDirty("translations/en.json", en);
  const esDirty = useEntityDirty("translations/es.json", es);
  const dirty = enDirty || esDirty;

  const save = async () => {
    store.setTranslationsEn(en);
    store.setTranslationsEs(es);
    await downloadJson("translations/en.json", en);
    await downloadJson("translations/es.json", es);
  };

  useEffect(() => {
    setEditor({ dirty, filename: "translations/en.json", save });
    return () => clearEditor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty]);

  // union of keys, grouped by prefix
  const groups = useMemo(() => {
    const keys = Array.from(new Set([...Object.keys(en), ...Object.keys(es)])).sort();
    const f = filter.trim().toLowerCase();
    const visible = f ? keys.filter((k) => k.toLowerCase().includes(f)) : keys;
    const byPrefix: Record<string, string[]> = {};
    for (const k of visible) {
      const prefix = k.includes(".") ? k.slice(0, k.indexOf(".")) : k;
      (byPrefix[prefix] ??= []).push(k);
    }
    return byPrefix;
  }, [en, es, filter]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{t("admin.pages.translations")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("admin.translations.subtitle")}</p>
      </div>

      <input
        className={`${inputCls} mb-5 max-w-md`}
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder={t("admin.translations.filter")}
      />

      <div className="space-y-5">
        {Object.entries(groups).map(([prefix, keys]) => (
          <section key={prefix} className="rounded-2xl border border-border bg-card">
            <div className="border-b border-border px-5 py-3">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{prefix}</h2>
            </div>
            <div className="divide-y divide-border">
              {keys.map((k) => (
                <div key={k} className="grid grid-cols-1 gap-2 px-5 py-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_minmax(0,1.5fr)]">
                  <code className="self-center break-all text-xs text-muted-foreground">{k}</code>
                  <input
                    className={inputCls}
                    value={es[k] ?? ""}
                    onChange={(e) => setEs((d) => ({ ...d, [k]: e.target.value }))}
                    placeholder="Español"
                  />
                  <input
                    className={inputCls}
                    value={en[k] ?? ""}
                    onChange={(e) => setEn((d) => ({ ...d, [k]: e.target.value }))}
                    placeholder="English"
                  />
                </div>
              ))}
            </div>
          </section>
        ))}
        {Object.keys(groups).length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">{t("admin.translations.empty")}</p>
        )}
      </div>

      <FloatingSaveButton dirty={dirty} save={save} saveLabel={t("admin.common.save")} savedLabel={t("admin.common.saved")} />
    </div>
  );
}
