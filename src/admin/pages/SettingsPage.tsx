// Settings — singleton draft editing settings.json: autoTranslate toggles and
// contact.delivery select.

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAdminStore, downloadJson } from "@/lib/admin-store";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminCard, Toggle, SelectField } from "@/components/admin/AdminUI";

type Settings = ReturnType<typeof useAdminStore.getState>["settings"];

const DELIVERY = ["none", "formsubmit", "web3forms", "formspree", "custom"] as const;

export default function SettingsPage() {
  const { t } = useLanguage();
  const store = useAdminStore();
  const [draft, setDraft] = useState<Settings>(() => structuredClone(store.settings));

  const update = (mut: (d: Settings) => void) =>
    setDraft((prev) => {
      const next = structuredClone(prev);
      mut(next);
      return next;
    });

  const save = async () => {
    store.setSettings(draft);
    await downloadJson("settings.json", draft);
  };

  return (
    <div>
      <PageHeader title={t("admin.pages.settings")} description={t("admin.settings.subtitle")} entity="settings.json" value={draft} onSave={save} />
      <div className="space-y-5">
        <AdminCard title={t("admin.settings.autoTranslate")}>
          <Toggle label={t("admin.settings.enabled")} checked={draft.autoTranslate.enabled} onChange={(v) => update((d) => (d.autoTranslate.enabled = v))} />
          <Toggle label={t("admin.settings.fillEmptyOnBlur")} checked={draft.autoTranslate.fillEmptyOnBlur} onChange={(v) => update((d) => (d.autoTranslate.fillEmptyOnBlur = v))} />
        </AdminCard>
        <AdminCard title={t("admin.settings.contact")}>
          <SelectField label={t("admin.settings.delivery")} value={draft.contact.delivery} options={DELIVERY} onChange={(v) => update((d) => (d.contact.delivery = v))} />
        </AdminCard>
      </div>
    </div>
  );
}
