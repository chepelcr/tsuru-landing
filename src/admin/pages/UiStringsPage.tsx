// UI strings — singleton editor for ui.json: small shared interface strings
// (loading state, 404 message).

import { useLanguage } from "@/contexts/LanguageContext";
import { useAdminStore } from "@/lib/admin-store";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminCard, BilingualField } from "@/components/admin/AdminUI";
import { useSingletonDraft } from "@/admin/useSingletonDraft";

const STRINGS = {
  es: {
    title: "Textos de interfaz",
    subtitle: "Cadenas compartidas de la interfaz",
    card: "Estados",
    loading: "Cargando",
    notFound: "Página no encontrada (404)",
  },
  en: {
    title: "UI strings",
    subtitle: "Shared interface strings",
    card: "States",
    loading: "Loading",
    notFound: "Not found (404)",
  },
} as const;

export default function UiStringsPage() {
  const { language } = useLanguage();
  const T = STRINGS[language];
  const setUi = useAdminStore((s) => s.setUi);
  const initial = useAdminStore((s) => s.ui);
  const { draft, update, save } = useSingletonDraft(initial, "ui.json", setUi);

  return (
    <div>
      <PageHeader title={T.title} description={T.subtitle} entity="ui.json" value={draft} onSave={save} />
      <div className="space-y-5">
        <AdminCard title={T.card}>
          <BilingualField label={T.loading} es={draft.loading.es} en={draft.loading.en} onChange={(l, v) => update((d) => (d.loading[l] = v))} />
          <BilingualField label={T.notFound} es={draft.notFound.es} en={draft.notFound.en} onChange={(l, v) => update((d) => (d.notFound[l] = v))} />
        </AdminCard>
      </div>
    </div>
  );
}
