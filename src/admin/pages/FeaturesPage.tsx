// Features — singleton editor for features.json: page intro, feature cards
// (reorderable, with an icon name + color token), the use-cases section + its
// reorderable cards, and the CTA. Chrome is bilingual via a per-page T dict.

import { useLanguage } from "@/contexts/LanguageContext";
import { useAdminStore } from "@/lib/admin-store";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  AdminCard,
  BilingualField,
  BilingualTextArea,
  RepeatableList,
  SelectField,
  TextField,
} from "@/components/admin/AdminUI";
import { RICH_TEXT_HINT } from "@/lib/rich-text";
import { useSingletonDraft, moveItem } from "@/admin/useSingletonDraft";

const COLOR_TOKENS = ["green", "earth"] as const;

const STRINGS = {
  es: {
    title: "Funcionalidades",
    subtitle: "Intro, tarjetas de funciones, casos de uso y CTA",
    intro: "Encabezado",
    badge: "Insignia",
    pageTitle: "Título",
    pageSubtitle: "Subtítulo",
    cards: "Tarjetas de funciones",
    addCard: "Agregar tarjeta",
    noCards: "Sin tarjetas",
    iconName: "Nombre del ícono",
    color: "Color",
    status: "Estado (opcional, p. ej. «Muy pronto»)",
    itemTitle: "Título",
    itemDesc: "Descripción",
    useCasesSection: "Sección de casos de uso",
    sectionTitle: "Título de sección",
    sectionSubtitle: "Subtítulo de sección",
    useCases: "Casos de uso",
    addUseCase: "Agregar caso de uso",
    noUseCases: "Sin casos de uso",
    cta: "Llamado a la acción",
    button: "Botón",
  },
  en: {
    title: "Features",
    subtitle: "Intro, feature cards, use cases, and CTA",
    intro: "Header",
    badge: "Badge",
    pageTitle: "Title",
    pageSubtitle: "Subtitle",
    cards: "Feature cards",
    addCard: "Add card",
    noCards: "No cards",
    iconName: "Icon name",
    color: "Color",
    status: "Status (optional, e.g. “Coming soon”)",
    itemTitle: "Title",
    itemDesc: "Description",
    useCasesSection: "Use cases section",
    sectionTitle: "Section title",
    sectionSubtitle: "Section subtitle",
    useCases: "Use cases",
    addUseCase: "Add use case",
    noUseCases: "No use cases",
    cta: "Call to action",
    button: "Button",
  },
} as const;

export default function FeaturesPage() {
  const { language } = useLanguage();
  const T = STRINGS[language];
  const setFeatures = useAdminStore((s) => s.setFeatures);
  const initial = useAdminStore((s) => s.features);
  const { draft, update, save } = useSingletonDraft(initial, "features.json", setFeatures);

  return (
    <div>
      <PageHeader title={T.title} description={T.subtitle} entity="features.json" value={draft} onSave={save} />

      <div className="space-y-5">
        <AdminCard title={T.intro}>
          <BilingualField label={T.badge} es={draft.page.badge.es} en={draft.page.badge.en} onChange={(l, v) => update((d) => (d.page.badge[l] = v))} />
          <BilingualField label={T.pageTitle} es={draft.page.title.es} en={draft.page.title.en} onChange={(l, v) => update((d) => (d.page.title[l] = v))} />
          <BilingualTextArea label={T.pageSubtitle} es={draft.page.subtitle.es} en={draft.page.subtitle.en} onChange={(l, v) => update((d) => (d.page.subtitle[l] = v))} hint={RICH_TEXT_HINT} />
        </AdminCard>

        <RepeatableList
          title={T.cards}
          items={draft.featureCards}
          addLabel={T.addCard}
          emptyLabel={T.noCards}
          onAdd={() => update((d) => d.featureCards.push({ iconName: "", color: "green", title: { es: "", en: "" }, description: { es: "", en: "" } }))}
          onRemove={(i) => update((d) => d.featureCards.splice(i, 1))}
          onMove={(i, dir) => update((d) => moveItem(d.featureCards, i, dir))}
          renderItem={(card, i) => {
            // `status` is optional (only roadmap cards carry it). Read/write it
            // through a narrow cast so the editor can flag any card as roadmap.
            const status = (card as { status?: { es: string; en: string } }).status;
            return (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <TextField label={T.iconName} value={card.iconName} onChange={(v) => update((d) => (d.featureCards[i].iconName = v))} />
                  <SelectField label={T.color} value={card.color} options={COLOR_TOKENS} onChange={(v) => update((d) => (d.featureCards[i].color = v))} />
                </div>
                <BilingualField label={T.itemTitle} es={card.title.es} en={card.title.en} onChange={(l, v) => update((d) => (d.featureCards[i].title[l] = v))} />
                <BilingualTextArea label={T.itemDesc} es={card.description.es} en={card.description.en} onChange={(l, v) => update((d) => (d.featureCards[i].description[l] = v))} hint={RICH_TEXT_HINT} />
                <BilingualField
                  label={T.status}
                  es={status?.es ?? ""}
                  en={status?.en ?? ""}
                  onChange={(l, v) =>
                    update((d) => {
                      const c = d.featureCards[i] as { status?: { es: string; en: string }; roadmap?: boolean };
                      if (!c.status) c.status = { es: "", en: "" };
                      c.status[l] = v;
                      c.roadmap = Boolean(c.status.es || c.status.en);
                    })
                  }
                />
              </>
            );
          }}
        />

        <AdminCard title={T.useCasesSection}>
          <BilingualField label={T.sectionTitle} es={draft.useCasesSection.title.es} en={draft.useCasesSection.title.en} onChange={(l, v) => update((d) => (d.useCasesSection.title[l] = v))} />
          <BilingualField label={T.sectionSubtitle} es={draft.useCasesSection.subtitle.es} en={draft.useCasesSection.subtitle.en} onChange={(l, v) => update((d) => (d.useCasesSection.subtitle[l] = v))} />
        </AdminCard>

        <RepeatableList
          title={T.useCases}
          items={draft.useCases}
          addLabel={T.addUseCase}
          emptyLabel={T.noUseCases}
          onAdd={() => update((d) => d.useCases.push({ iconName: "", title: { es: "", en: "" }, description: { es: "", en: "" } }))}
          onRemove={(i) => update((d) => d.useCases.splice(i, 1))}
          onMove={(i, dir) => update((d) => moveItem(d.useCases, i, dir))}
          renderItem={(uc, i) => (
            <>
              <TextField label={T.iconName} value={uc.iconName} onChange={(v) => update((d) => (d.useCases[i].iconName = v))} />
              <BilingualField label={T.itemTitle} es={uc.title.es} en={uc.title.en} onChange={(l, v) => update((d) => (d.useCases[i].title[l] = v))} />
              <BilingualTextArea label={T.itemDesc} es={uc.description.es} en={uc.description.en} onChange={(l, v) => update((d) => (d.useCases[i].description[l] = v))} hint={RICH_TEXT_HINT} />
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
