// About — singleton editor for about.json: intro, "what is", decorative tags,
// mission, story paragraphs, values, and the team block. Points, tags, paras,
// and values are reorderable repeatable lists.

import { useLanguage } from "@/contexts/LanguageContext";
import { useAdminStore } from "@/lib/admin-store";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminCard, BilingualField, BilingualTextArea, RepeatableList } from "@/components/admin/AdminUI";
import { RICH_TEXT_HINT } from "@/lib/rich-text";
import { useSingletonDraft, moveItem } from "@/admin/useSingletonDraft";

const STRINGS = {
  es: {
    title: "Quiénes somos",
    subtitle: "Intro, qué es, misión, historia, valores y equipo",
    intro: "Encabezado",
    badge: "Insignia",
    pageTitle: "Título",
    pageSubtitle: "Subtítulo",
    sectionTitle: "Título de sección",
    desc: "Descripción",
    queEs: "¿Qué es?",
    points: "Puntos",
    addPoint: "Agregar punto",
    noPoints: "Sin puntos",
    point: "Punto",
    decorative: "Decorativo",
    tagline: "Lema",
    tags: "Etiquetas",
    addTag: "Agregar etiqueta",
    noTags: "Sin etiquetas",
    tag: "Etiqueta",
    mission: "Misión",
    story: "Historia",
    paras: "Párrafos",
    addPara: "Agregar párrafo",
    noParas: "Sin párrafos",
    para: "Párrafo",
    valuesTitle: "Título de valores",
    values: "Valores",
    addValue: "Agregar valor",
    noValues: "Sin valores",
    itemTitle: "Título",
    team: "Equipo",
    button: "Botón",
  },
  en: {
    title: "About",
    subtitle: "Intro, what is, mission, story, values, and team",
    intro: "Header",
    badge: "Badge",
    pageTitle: "Title",
    pageSubtitle: "Subtitle",
    sectionTitle: "Section title",
    desc: "Description",
    queEs: "What is it?",
    points: "Points",
    addPoint: "Add point",
    noPoints: "No points",
    point: "Point",
    decorative: "Decorative",
    tagline: "Tagline",
    tags: "Tags",
    addTag: "Add tag",
    noTags: "No tags",
    tag: "Tag",
    mission: "Mission",
    story: "Story",
    paras: "Paragraphs",
    addPara: "Add paragraph",
    noParas: "No paragraphs",
    para: "Paragraph",
    valuesTitle: "Values title",
    values: "Values",
    addValue: "Add value",
    noValues: "No values",
    itemTitle: "Title",
    team: "Team",
    button: "Button",
  },
} as const;

export default function AboutPage() {
  const { language } = useLanguage();
  const T = STRINGS[language];
  const setAbout = useAdminStore((s) => s.setAbout);
  const initial = useAdminStore((s) => s.about);
  const { draft, update, save } = useSingletonDraft(initial, "about.json", setAbout);

  return (
    <div>
      <PageHeader title={T.title} description={T.subtitle} entity="about.json" value={draft} onSave={save} />

      <div className="space-y-5">
        <AdminCard title={T.intro}>
          <BilingualField label={T.badge} es={draft.badge.es} en={draft.badge.en} onChange={(l, v) => update((d) => (d.badge[l] = v))} />
          <BilingualField label={T.pageTitle} es={draft.title.es} en={draft.title.en} onChange={(l, v) => update((d) => (d.title[l] = v))} />
          <BilingualTextArea label={T.pageSubtitle} es={draft.subtitle.es} en={draft.subtitle.en} onChange={(l, v) => update((d) => (d.subtitle[l] = v))} hint={RICH_TEXT_HINT} />
        </AdminCard>

        <AdminCard title={T.queEs}>
          <BilingualField label={T.badge} es={draft.queEs.badge.es} en={draft.queEs.badge.en} onChange={(l, v) => update((d) => (d.queEs.badge[l] = v))} />
          <BilingualField label={T.sectionTitle} es={draft.queEs.title.es} en={draft.queEs.title.en} onChange={(l, v) => update((d) => (d.queEs.title[l] = v))} />
          <BilingualTextArea label={T.desc} es={draft.queEs.description.es} en={draft.queEs.description.en} onChange={(l, v) => update((d) => (d.queEs.description[l] = v))} hint={RICH_TEXT_HINT} />
        </AdminCard>

        <RepeatableList
          title={T.points}
          items={draft.queEs.points}
          addLabel={T.addPoint}
          emptyLabel={T.noPoints}
          onAdd={() => update((d) => d.queEs.points.push({ es: "", en: "" }))}
          onRemove={(i) => update((d) => d.queEs.points.splice(i, 1))}
          onMove={(i, dir) => update((d) => moveItem(d.queEs.points, i, dir))}
          renderItem={(p, i) => (
            <BilingualField label={`${T.point} ${i + 1}`} es={p.es} en={p.en} onChange={(l, v) => update((d) => (d.queEs.points[i][l] = v))} />
          )}
        />

        <AdminCard title={T.decorative}>
          <BilingualField label={T.tagline} es={draft.decorative.tagline.es} en={draft.decorative.tagline.en} onChange={(l, v) => update((d) => (d.decorative.tagline[l] = v))} />
        </AdminCard>

        <RepeatableList
          title={T.tags}
          items={draft.decorative.tags}
          addLabel={T.addTag}
          emptyLabel={T.noTags}
          onAdd={() => update((d) => d.decorative.tags.push({ es: "", en: "" }))}
          onRemove={(i) => update((d) => d.decorative.tags.splice(i, 1))}
          onMove={(i, dir) => update((d) => moveItem(d.decorative.tags, i, dir))}
          renderItem={(tag, i) => (
            <BilingualField label={`${T.tag} ${i + 1}`} es={tag.es} en={tag.en} onChange={(l, v) => update((d) => (d.decorative.tags[i][l] = v))} />
          )}
        />

        <AdminCard title={T.mission}>
          <BilingualField label={T.sectionTitle} es={draft.mission.title.es} en={draft.mission.title.en} onChange={(l, v) => update((d) => (d.mission.title[l] = v))} />
          <BilingualTextArea label={T.desc} es={draft.mission.description.es} en={draft.mission.description.en} onChange={(l, v) => update((d) => (d.mission.description[l] = v))} hint={RICH_TEXT_HINT} />
        </AdminCard>

        <AdminCard title={T.story}>
          <BilingualField label={T.sectionTitle} es={draft.story.title.es} en={draft.story.title.en} onChange={(l, v) => update((d) => (d.story.title[l] = v))} />
        </AdminCard>

        <RepeatableList
          title={T.paras}
          items={draft.story.paras}
          addLabel={T.addPara}
          emptyLabel={T.noParas}
          onAdd={() => update((d) => d.story.paras.push({ es: "", en: "" }))}
          onRemove={(i) => update((d) => d.story.paras.splice(i, 1))}
          onMove={(i, dir) => update((d) => moveItem(d.story.paras, i, dir))}
          renderItem={(para, i) => (
            <BilingualTextArea label={`${T.para} ${i + 1}`} es={para.es} en={para.en} onChange={(l, v) => update((d) => (d.story.paras[i][l] = v))} hint={RICH_TEXT_HINT} />
          )}
        />

        <AdminCard title={T.valuesTitle}>
          <BilingualField label={T.sectionTitle} es={draft.valuesTitle.es} en={draft.valuesTitle.en} onChange={(l, v) => update((d) => (d.valuesTitle[l] = v))} />
        </AdminCard>

        <RepeatableList
          title={T.values}
          items={draft.values}
          addLabel={T.addValue}
          emptyLabel={T.noValues}
          onAdd={() => update((d) => d.values.push({ title: { es: "", en: "" }, description: { es: "", en: "" } }))}
          onRemove={(i) => update((d) => d.values.splice(i, 1))}
          onMove={(i, dir) => update((d) => moveItem(d.values, i, dir))}
          renderItem={(item, i) => (
            <>
              <BilingualField label={T.itemTitle} es={item.title.es} en={item.title.en} onChange={(l, v) => update((d) => (d.values[i].title[l] = v))} />
              <BilingualTextArea label={T.desc} es={item.description.es} en={item.description.en} onChange={(l, v) => update((d) => (d.values[i].description[l] = v))} hint={RICH_TEXT_HINT} />
            </>
          )}
        />

        <AdminCard title={T.team}>
          <BilingualField label={T.sectionTitle} es={draft.team.title.es} en={draft.team.title.en} onChange={(l, v) => update((d) => (d.team.title[l] = v))} />
          <BilingualTextArea label={T.desc} es={draft.team.description.es} en={draft.team.description.en} onChange={(l, v) => update((d) => (d.team.description[l] = v))} hint={RICH_TEXT_HINT} />
          <BilingualField label={T.button} es={draft.team.button.es} en={draft.team.button.en} onChange={(l, v) => update((d) => (d.team.button[l] = v))} />
        </AdminCard>
      </div>
    </div>
  );
}
