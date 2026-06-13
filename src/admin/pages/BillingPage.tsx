// Billing — singleton editor for billing.json: the free e-invoicing pillar
// section rendered on the home page between "how it works" and the principles.
// Badge/title/subtitle/note are bilingual fields; the selling points are a
// reorderable repeatable list of bilingual strings. Chrome is bilingual via a
// per-page T dict.

import { useLanguage } from "@/contexts/LanguageContext";
import { useAdminStore } from "@/lib/admin-store";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  AdminCard,
  BilingualField,
  BilingualTextArea,
  RepeatableList,
} from "@/components/admin/AdminUI";
import { RICH_TEXT_HINT } from "@/lib/rich-text";
import { useSingletonDraft, moveItem } from "@/admin/useSingletonDraft";

const STRINGS = {
  es: {
    title: "Facturación",
    subtitle: "Sección de facturación electrónica gratuita (página de inicio)",
    section: "Facturación electrónica",
    badge: "Insignia",
    sectionTitle: "Título",
    subtitleF: "Subtítulo",
    points: "Puntos",
    addPoint: "Agregar punto",
    noPoints: "Sin puntos",
    point: "Punto",
    note: "Nota",
  },
  en: {
    title: "Billing",
    subtitle: "Free electronic invoicing section (home page)",
    section: "Electronic invoicing",
    badge: "Badge",
    sectionTitle: "Title",
    subtitleF: "Subtitle",
    points: "Points",
    addPoint: "Add point",
    noPoints: "No points",
    point: "Point",
    note: "Note",
  },
} as const;

export default function BillingPage() {
  const { language } = useLanguage();
  const T = STRINGS[language];
  const setBilling = useAdminStore((s) => s.setBilling);
  const initial = useAdminStore((s) => s.billing);
  const { draft, update, save } = useSingletonDraft(initial, "billing.json", setBilling);

  return (
    <div>
      <PageHeader title={T.title} description={T.subtitle} entity="billing.json" value={draft} onSave={save} />

      <div className="space-y-5">
        <AdminCard title={T.section}>
          <BilingualField label={T.badge} es={draft.badge.es} en={draft.badge.en} onChange={(l, v) => update((d) => (d.badge[l] = v))} />
          <BilingualField label={T.sectionTitle} es={draft.title.es} en={draft.title.en} onChange={(l, v) => update((d) => (d.title[l] = v))} />
          <BilingualTextArea label={T.subtitleF} es={draft.subtitle.es} en={draft.subtitle.en} onChange={(l, v) => update((d) => (d.subtitle[l] = v))} hint={RICH_TEXT_HINT} />
        </AdminCard>

        <RepeatableList
          title={T.points}
          items={draft.points}
          addLabel={T.addPoint}
          emptyLabel={T.noPoints}
          onAdd={() => update((d) => d.points.push({ es: "", en: "" }))}
          onRemove={(i) => update((d) => d.points.splice(i, 1))}
          onMove={(i, dir) => update((d) => moveItem(d.points, i, dir))}
          renderItem={(point, i) => (
            <BilingualField label={T.point} es={point.es} en={point.en} onChange={(l, v) => update((d) => (d.points[i][l] = v))} />
          )}
        />

        <AdminCard title={T.note}>
          <BilingualTextArea label={T.note} es={draft.note.es} en={draft.note.en} onChange={(l, v) => update((d) => (d.note[l] = v))} hint={RICH_TEXT_HINT} />
        </AdminCard>
      </div>
    </div>
  );
}
