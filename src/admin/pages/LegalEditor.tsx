// Shared legal-document editor used by Terms and Privacy (same shape: chrome +
// reorderable sections of title/content + a closing notice). Each wrapper page
// passes its file, store slice, setter, and a bilingual chrome dict.

import { useLanguage } from "@/contexts/LanguageContext";
import { useAdminStore } from "@/lib/admin-store";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminCard, BilingualField, BilingualTextArea, RepeatableList } from "@/components/admin/AdminUI";
import { RICH_TEXT_HINT } from "@/lib/rich-text";
import { useSingletonDraft, moveItem } from "@/admin/useSingletonDraft";

type Bi = { es: string; en: string };
type LegalDoc = {
  docTitleSuffix: Bi;
  badge: Bi;
  title: Bi;
  subtitle: Bi;
  lastUpdated: Bi;
  lastUpdatedDate: Bi;
  sections: { title: Bi; content: Bi }[];
  // Terms uses importantNotice/acceptanceNotice; Privacy uses notice/noticeDesc.
  noticeTitleKey: "importantNotice" | "notice";
  noticeBodyKey: "acceptanceNotice" | "noticeDesc";
} & Record<string, unknown>;

const STRINGS = {
  es: {
    intro: "Encabezado",
    docTitleSuffix: "Sufijo del título del documento",
    badge: "Insignia",
    pageTitle: "Título",
    pageSubtitle: "Subtítulo",
    lastUpdated: "Etiqueta «última actualización»",
    lastUpdatedDate: "Fecha de última actualización",
    sections: "Secciones",
    addSection: "Agregar sección",
    noSections: "Sin secciones",
    sectionTitle: "Título",
    content: "Contenido",
    notice: "Aviso de cierre",
    noticeTitle: "Título del aviso",
    noticeBody: "Texto del aviso",
  },
  en: {
    intro: "Header",
    docTitleSuffix: "Document title suffix",
    badge: "Badge",
    pageTitle: "Title",
    pageSubtitle: "Subtitle",
    lastUpdated: "“Last updated” label",
    lastUpdatedDate: "Last updated date",
    sections: "Sections",
    addSection: "Add section",
    noSections: "No sections",
    sectionTitle: "Title",
    content: "Content",
    notice: "Closing notice",
    noticeTitle: "Notice title",
    noticeBody: "Notice body",
  },
} as const;

export function LegalEditor({
  file,
  title,
  subtitle,
  selectSlice,
  setSlice,
  noticeTitleKey,
  noticeBodyKey,
}: {
  file: string;
  title: string;
  subtitle: string;
  selectSlice: (s: ReturnType<typeof useAdminStore.getState>) => LegalDoc;
  setSlice: (v: LegalDoc) => void;
  noticeTitleKey: LegalDoc["noticeTitleKey"];
  noticeBodyKey: LegalDoc["noticeBodyKey"];
}) {
  const { language } = useLanguage();
  const T = STRINGS[language];
  const initial = useAdminStore(selectSlice);
  const { draft, update, save } = useSingletonDraft<LegalDoc>(initial, file, setSlice);

  const noticeTitle = draft[noticeTitleKey] as Bi;
  const noticeBody = draft[noticeBodyKey] as Bi;

  return (
    <div>
      <PageHeader title={title} description={subtitle} entity={file} value={draft} onSave={save} />

      <div className="space-y-5">
        <AdminCard title={T.intro}>
          <BilingualField label={T.docTitleSuffix} es={draft.docTitleSuffix.es} en={draft.docTitleSuffix.en} onChange={(l, v) => update((d) => (d.docTitleSuffix[l] = v))} />
          <BilingualField label={T.badge} es={draft.badge.es} en={draft.badge.en} onChange={(l, v) => update((d) => (d.badge[l] = v))} />
          <BilingualField label={T.pageTitle} es={draft.title.es} en={draft.title.en} onChange={(l, v) => update((d) => (d.title[l] = v))} />
          <BilingualTextArea label={T.pageSubtitle} es={draft.subtitle.es} en={draft.subtitle.en} onChange={(l, v) => update((d) => (d.subtitle[l] = v))} hint={RICH_TEXT_HINT} />
          <BilingualField label={T.lastUpdated} es={draft.lastUpdated.es} en={draft.lastUpdated.en} onChange={(l, v) => update((d) => (d.lastUpdated[l] = v))} />
          <BilingualField label={T.lastUpdatedDate} es={draft.lastUpdatedDate.es} en={draft.lastUpdatedDate.en} onChange={(l, v) => update((d) => (d.lastUpdatedDate[l] = v))} />
        </AdminCard>

        <RepeatableList
          title={T.sections}
          items={draft.sections}
          addLabel={T.addSection}
          emptyLabel={T.noSections}
          onAdd={() => update((d) => d.sections.push({ title: { es: "", en: "" }, content: { es: "", en: "" } }))}
          onRemove={(i) => update((d) => d.sections.splice(i, 1))}
          onMove={(i, dir) => update((d) => moveItem(d.sections, i, dir))}
          renderItem={(sec, i) => (
            <>
              <BilingualField label={T.sectionTitle} es={sec.title.es} en={sec.title.en} onChange={(l, v) => update((d) => (d.sections[i].title[l] = v))} />
              <BilingualTextArea label={T.content} es={sec.content.es} en={sec.content.en} onChange={(l, v) => update((d) => (d.sections[i].content[l] = v))} hint={RICH_TEXT_HINT} />
            </>
          )}
        />

        <AdminCard title={T.notice}>
          <BilingualField label={T.noticeTitle} es={noticeTitle.es} en={noticeTitle.en} onChange={(l, v) => update((d) => ((d[noticeTitleKey] as Bi)[l] = v))} />
          <BilingualTextArea label={T.noticeBody} es={noticeBody.es} en={noticeBody.en} onChange={(l, v) => update((d) => ((d[noticeBodyKey] as Bi)[l] = v))} hint={RICH_TEXT_HINT} />
        </AdminCard>
      </div>
    </div>
  );
}
