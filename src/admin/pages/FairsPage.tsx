// Fairs — singleton editor for fairs.json: intro, "what are fairs", fair types
// (reorderable), how-to-participate steps (reorderable), and the CTA.

import { useLanguage } from "@/contexts/LanguageContext";
import { useAdminStore } from "@/lib/admin-store";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminCard, BilingualField, BilingualTextArea, RepeatableList } from "@/components/admin/AdminUI";
import { RICH_TEXT_HINT } from "@/lib/rich-text";
import { useSingletonDraft, moveItem } from "@/admin/useSingletonDraft";

const STRINGS = {
  es: {
    title: "Ferias",
    subtitle: "Intro, qué son, tipos de feria, cómo participar y CTA",
    intro: "Encabezado",
    badge: "Insignia",
    pageTitle: "Título",
    pageSubtitle: "Subtítulo",
    what: "¿Qué son las ferias?",
    sectionTitle: "Título de sección",
    desc: "Descripción",
    typesTitle: "Título «tipos de ferias»",
    types: "Tipos de ferias",
    addType: "Agregar tipo",
    noTypes: "Sin tipos",
    itemTitle: "Título",
    howJoinTitle: "Título «cómo participar»",
    howJoin: "Cómo participar",
    addStep: "Agregar paso",
    noSteps: "Sin pasos",
    cta: "Llamado a la acción",
    button: "Botón",
  },
  en: {
    title: "Fairs",
    subtitle: "Intro, what they are, fair types, how to join, and CTA",
    intro: "Header",
    badge: "Badge",
    pageTitle: "Title",
    pageSubtitle: "Subtitle",
    what: "What are fairs?",
    sectionTitle: "Section title",
    desc: "Description",
    typesTitle: "“Types of fairs” heading",
    types: "Fair types",
    addType: "Add type",
    noTypes: "No types",
    itemTitle: "Title",
    howJoinTitle: "“How to participate” heading",
    howJoin: "How to participate",
    addStep: "Add step",
    noSteps: "No steps",
    cta: "Call to action",
    button: "Button",
  },
} as const;

export default function FairsPage() {
  const { language } = useLanguage();
  const T = STRINGS[language];
  const setFairs = useAdminStore((s) => s.setFairs);
  const initial = useAdminStore((s) => s.fairs);
  const { draft, update, save } = useSingletonDraft(initial, "fairs.json", setFairs);

  return (
    <div>
      <PageHeader title={T.title} description={T.subtitle} entity="fairs.json" value={draft} onSave={save} />

      <div className="space-y-5">
        <AdminCard title={T.intro}>
          <BilingualField label={T.badge} es={draft.badge.es} en={draft.badge.en} onChange={(l, v) => update((d) => (d.badge[l] = v))} />
          <BilingualField label={T.pageTitle} es={draft.title.es} en={draft.title.en} onChange={(l, v) => update((d) => (d.title[l] = v))} />
          <BilingualTextArea label={T.pageSubtitle} es={draft.subtitle.es} en={draft.subtitle.en} onChange={(l, v) => update((d) => (d.subtitle[l] = v))} hint={RICH_TEXT_HINT} />
        </AdminCard>

        <AdminCard title={T.what}>
          <BilingualField label={T.sectionTitle} es={draft.what.title.es} en={draft.what.title.en} onChange={(l, v) => update((d) => (d.what.title[l] = v))} />
          <BilingualTextArea label={T.desc} es={draft.what.description.es} en={draft.what.description.en} onChange={(l, v) => update((d) => (d.what.description[l] = v))} hint={RICH_TEXT_HINT} />
        </AdminCard>

        <AdminCard title={T.typesTitle}>
          <BilingualField label={T.sectionTitle} es={draft.typesTitle.es} en={draft.typesTitle.en} onChange={(l, v) => update((d) => (d.typesTitle[l] = v))} />
        </AdminCard>

        <RepeatableList
          title={T.types}
          items={draft.types}
          addLabel={T.addType}
          emptyLabel={T.noTypes}
          onAdd={() => update((d) => d.types.push({ title: { es: "", en: "" }, description: { es: "", en: "" } }))}
          onRemove={(i) => update((d) => d.types.splice(i, 1))}
          onMove={(i, dir) => update((d) => moveItem(d.types, i, dir))}
          renderItem={(item, i) => (
            <>
              <BilingualField label={T.itemTitle} es={item.title.es} en={item.title.en} onChange={(l, v) => update((d) => (d.types[i].title[l] = v))} />
              <BilingualTextArea label={T.desc} es={item.description.es} en={item.description.en} onChange={(l, v) => update((d) => (d.types[i].description[l] = v))} hint={RICH_TEXT_HINT} />
            </>
          )}
        />

        <AdminCard title={T.howJoinTitle}>
          <BilingualField label={T.sectionTitle} es={draft.howJoinTitle.es} en={draft.howJoinTitle.en} onChange={(l, v) => update((d) => (d.howJoinTitle[l] = v))} />
        </AdminCard>

        <RepeatableList
          title={T.howJoin}
          items={draft.howJoin}
          addLabel={T.addStep}
          emptyLabel={T.noSteps}
          onAdd={() => update((d) => d.howJoin.push({ title: { es: "", en: "" }, description: { es: "", en: "" } }))}
          onRemove={(i) => update((d) => d.howJoin.splice(i, 1))}
          onMove={(i, dir) => update((d) => moveItem(d.howJoin, i, dir))}
          renderItem={(item, i) => (
            <>
              <BilingualField label={T.itemTitle} es={item.title.es} en={item.title.en} onChange={(l, v) => update((d) => (d.howJoin[i].title[l] = v))} />
              <BilingualTextArea label={T.desc} es={item.description.es} en={item.description.en} onChange={(l, v) => update((d) => (d.howJoin[i].description[l] = v))} hint={RICH_TEXT_HINT} />
            </>
          )}
        />

        <AdminCard title={T.cta}>
          <BilingualField label={T.sectionTitle} es={draft.cta.title.es} en={draft.cta.title.en} onChange={(l, v) => update((d) => (d.cta.title[l] = v))} />
          <BilingualTextArea label={T.pageSubtitle} es={draft.cta.subtitle.es} en={draft.cta.subtitle.en} onChange={(l, v) => update((d) => (d.cta.subtitle[l] = v))} hint={RICH_TEXT_HINT} />
          <BilingualField label={T.button} es={draft.cta.button.es} en={draft.cta.button.en} onChange={(l, v) => update((d) => (d.cta.button[l] = v))} />
        </AdminCard>
      </div>
    </div>
  );
}
