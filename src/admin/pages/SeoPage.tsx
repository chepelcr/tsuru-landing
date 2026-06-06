// SEO — singleton draft editing seo.json: siteUrl, bilingual defaultTitle /
// defaultDescription, ogImage via MediaPicker.

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAdminStore, downloadJson } from "@/lib/admin-store";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminCard, TextField, BilingualField, BilingualTextArea } from "@/components/admin/AdminUI";
import { MediaPicker } from "@/components/admin/MediaPicker";

type Seo = ReturnType<typeof useAdminStore.getState>["seo"] & { ogImage?: string };

export default function SeoPage() {
  const { t } = useLanguage();
  const store = useAdminStore();
  const [draft, setDraft] = useState<Seo>(() => structuredClone(store.seo) as Seo);

  const update = (mut: (d: Seo) => void) =>
    setDraft((prev) => {
      const next = structuredClone(prev);
      mut(next);
      return next;
    });

  const save = async () => {
    store.setSeo(draft as typeof store.seo);
    await downloadJson("seo.json", draft);
  };

  return (
    <div>
      <PageHeader title={t("admin.pages.seo")} description={t("admin.seo.subtitle")} entity="seo.json" value={draft} onSave={save} />
      <AdminCard title={t("admin.pages.seo")}>
        <TextField label={t("admin.seo.siteUrl")} value={draft.siteUrl} onChange={(v) => update((d) => (d.siteUrl = v))} />
        <BilingualField label={t("admin.seo.defaultTitle")} es={draft.defaultTitle.es} en={draft.defaultTitle.en} onChange={(l, v) => update((d) => (d.defaultTitle[l] = v))} />
        <BilingualTextArea label={t("admin.seo.defaultDescription")} es={draft.defaultDescription.es} en={draft.defaultDescription.en} onChange={(l, v) => update((d) => (d.defaultDescription[l] = v))} />
        <MediaPicker label={t("admin.seo.ogImage")} value={draft.ogImage ?? ""} onChange={(v) => update((d) => (d.ogImage = v))} />
      </AdminCard>
    </div>
  );
}
