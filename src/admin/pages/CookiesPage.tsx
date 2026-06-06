// Cookies — singleton editor for cookies.json: chrome, explanation, cookie
// types (reorderable), management sections (reorderable), and the closing note.

import { useLanguage } from "@/contexts/LanguageContext";
import { useAdminStore } from "@/lib/admin-store";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminCard, BilingualField, BilingualTextArea, RepeatableList } from "@/components/admin/AdminUI";
import { RICH_TEXT_HINT } from "@/lib/rich-text";
import { useSingletonDraft, moveItem } from "@/admin/useSingletonDraft";

const STRINGS = {
  es: {
    title: "Cookies",
    subtitle: "Encabezado, explicación, tipos de cookies y gestión",
    intro: "Encabezado",
    docTitleSuffix: "Sufijo del título del documento",
    badge: "Insignia",
    pageTitle: "Título",
    pageSubtitle: "Subtítulo",
    what: "Título «¿qué son las cookies?»",
    explanation: "Explicación",
    browser: "Texto sobre el navegador",
    typesTitle: "Título «tipos de cookies»",
    examplesLabel: "Etiqueta «ejemplos»",
    types: "Tipos de cookies",
    addType: "Agregar tipo",
    noTypes: "Sin tipos",
    name: "Nombre",
    desc: "Descripción",
    examples: "Ejemplos",
    manage: "Título «gestionar preferencias»",
    manageSections: "Secciones de gestión",
    addSection: "Agregar sección",
    noSections: "Sin secciones",
    sectionTitle: "Título",
    sectionDesc: "Descripción",
    important: "Nota importante",
    importantTitle: "Título de la nota",
    importantDesc: "Texto de la nota",
  },
  en: {
    title: "Cookies",
    subtitle: "Header, explanation, cookie types, and management",
    intro: "Header",
    docTitleSuffix: "Document title suffix",
    badge: "Badge",
    pageTitle: "Title",
    pageSubtitle: "Subtitle",
    what: "“What are cookies?” heading",
    explanation: "Explanation",
    browser: "Browser note",
    typesTitle: "“Types of cookies” heading",
    examplesLabel: "“Examples” label",
    types: "Cookie types",
    addType: "Add type",
    noTypes: "No types",
    name: "Name",
    desc: "Description",
    examples: "Examples",
    manage: "“Manage preferences” heading",
    manageSections: "Management sections",
    addSection: "Add section",
    noSections: "No sections",
    sectionTitle: "Title",
    sectionDesc: "Description",
    important: "Important note",
    importantTitle: "Note title",
    importantDesc: "Note body",
  },
} as const;

export default function CookiesPage() {
  const { language } = useLanguage();
  const T = STRINGS[language];
  const setCookies = useAdminStore((s) => s.setCookies);
  const initial = useAdminStore((s) => s.cookies);
  const { draft, update, save } = useSingletonDraft(initial, "cookies.json", setCookies);

  return (
    <div>
      <PageHeader title={T.title} description={T.subtitle} entity="cookies.json" value={draft} onSave={save} />

      <div className="space-y-5">
        <AdminCard title={T.intro}>
          <BilingualField label={T.docTitleSuffix} es={draft.docTitleSuffix.es} en={draft.docTitleSuffix.en} onChange={(l, v) => update((d) => (d.docTitleSuffix[l] = v))} />
          <BilingualField label={T.badge} es={draft.badge.es} en={draft.badge.en} onChange={(l, v) => update((d) => (d.badge[l] = v))} />
          <BilingualField label={T.pageTitle} es={draft.title.es} en={draft.title.en} onChange={(l, v) => update((d) => (d.title[l] = v))} />
          <BilingualField label={T.pageSubtitle} es={draft.subtitle.es} en={draft.subtitle.en} onChange={(l, v) => update((d) => (d.subtitle[l] = v))} />
        </AdminCard>

        <AdminCard title={T.what}>
          <BilingualField label={T.what} es={draft.what.es} en={draft.what.en} onChange={(l, v) => update((d) => (d.what[l] = v))} />
          <BilingualTextArea label={T.explanation} es={draft.explanation.es} en={draft.explanation.en} onChange={(l, v) => update((d) => (d.explanation[l] = v))} hint={RICH_TEXT_HINT} />
          <BilingualTextArea label={T.browser} es={draft.browser.es} en={draft.browser.en} onChange={(l, v) => update((d) => (d.browser[l] = v))} hint={RICH_TEXT_HINT} />
        </AdminCard>

        <AdminCard title={T.typesTitle}>
          <BilingualField label={T.typesTitle} es={draft.typesTitle.es} en={draft.typesTitle.en} onChange={(l, v) => update((d) => (d.typesTitle[l] = v))} />
          <BilingualField label={T.examplesLabel} es={draft.examplesLabel.es} en={draft.examplesLabel.en} onChange={(l, v) => update((d) => (d.examplesLabel[l] = v))} />
        </AdminCard>

        <RepeatableList
          title={T.types}
          items={draft.types}
          addLabel={T.addType}
          emptyLabel={T.noTypes}
          onAdd={() => update((d) => d.types.push({ name: { es: "", en: "" }, description: { es: "", en: "" }, examples: { es: "", en: "" } }))}
          onRemove={(i) => update((d) => d.types.splice(i, 1))}
          onMove={(i, dir) => update((d) => moveItem(d.types, i, dir))}
          renderItem={(ty, i) => (
            <>
              <BilingualField label={T.name} es={ty.name.es} en={ty.name.en} onChange={(l, v) => update((d) => (d.types[i].name[l] = v))} />
              <BilingualField label={T.desc} es={ty.description.es} en={ty.description.en} onChange={(l, v) => update((d) => (d.types[i].description[l] = v))} />
              <BilingualField label={T.examples} es={ty.examples.es} en={ty.examples.en} onChange={(l, v) => update((d) => (d.types[i].examples[l] = v))} />
            </>
          )}
        />

        <AdminCard title={T.manage}>
          <BilingualField label={T.manage} es={draft.manage.es} en={draft.manage.en} onChange={(l, v) => update((d) => (d.manage[l] = v))} />
        </AdminCard>

        <RepeatableList
          title={T.manageSections}
          items={draft.manageSections}
          addLabel={T.addSection}
          emptyLabel={T.noSections}
          onAdd={() => update((d) => d.manageSections.push({ title: { es: "", en: "" }, desc: { es: "", en: "" } }))}
          onRemove={(i) => update((d) => d.manageSections.splice(i, 1))}
          onMove={(i, dir) => update((d) => moveItem(d.manageSections, i, dir))}
          renderItem={(sec, i) => (
            <>
              <BilingualField label={T.sectionTitle} es={sec.title.es} en={sec.title.en} onChange={(l, v) => update((d) => (d.manageSections[i].title[l] = v))} />
              <BilingualTextArea label={T.sectionDesc} es={sec.desc.es} en={sec.desc.en} onChange={(l, v) => update((d) => (d.manageSections[i].desc[l] = v))} hint={RICH_TEXT_HINT} />
            </>
          )}
        />

        <AdminCard title={T.important}>
          <BilingualField label={T.importantTitle} es={draft.important.es} en={draft.important.en} onChange={(l, v) => update((d) => (d.important[l] = v))} />
          <BilingualTextArea label={T.importantDesc} es={draft.importantDesc.es} en={draft.importantDesc.en} onChange={(l, v) => update((d) => (d.importantDesc[l] = v))} hint={RICH_TEXT_HINT} />
        </AdminCard>
      </div>
    </div>
  );
}
