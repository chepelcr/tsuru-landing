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
    notFoundTitle: "404 — Título",
    notFoundDescription: "404 — Descripción",
    notFoundHome: "404 — Botón de inicio",
  },
  en: {
    title: "UI strings",
    subtitle: "Shared interface strings",
    card: "States",
    loading: "Loading",
    notFoundTitle: "404 — Title",
    notFoundDescription: "404 — Description",
    notFoundHome: "404 — Home button",
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
          <BilingualField label={T.notFoundTitle} es={draft.notFound.title.es} en={draft.notFound.title.en} onChange={(l, v) => update((d) => (d.notFound.title[l] = v))} />
          <BilingualField label={T.notFoundDescription} es={draft.notFound.description.es} en={draft.notFound.description.en} onChange={(l, v) => update((d) => (d.notFound.description[l] = v))} />
          <BilingualField label={T.notFoundHome} es={draft.notFound.home.es} en={draft.notFound.home.en} onChange={(l, v) => update((d) => (d.notFound.home[l] = v))} />
        </AdminCard>
      </div>
    </div>
  );
}
