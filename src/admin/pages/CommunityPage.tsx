// Community — singleton editor for community.json: intro, the six values
// (reorderable), the barter block (steps + example cards, both reorderable),
// mutual-support, the stories (reorderable), and the CTA.

import { useLanguage } from "@/contexts/LanguageContext";
import { useAdminStore } from "@/lib/admin-store";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  AdminCard,
  BilingualField,
  BilingualTextArea,
  RepeatableList,
  TextField,
} from "@/components/admin/AdminUI";
import { RICH_TEXT_HINT } from "@/lib/rich-text";
import { useSingletonDraft, moveItem } from "@/admin/useSingletonDraft";

const STRINGS = {
  es: {
    title: "Comunidad",
    subtitle: "Intro, valores, trueque, apoyo mutuo, historias y CTA",
    intro: "Encabezado",
    badge: "Insignia",
    pageTitle: "Título",
    pageSubtitle: "Subtítulo",
    sectionTitle: "Título de sección",
    sectionSubtitle: "Subtítulo de sección",
    valuesHeads: "Encabezados de valores",
    valuesTitle: "Título de valores",
    valuesSubtitle: "Subtítulo de valores",
    values: "Valores",
    addValue: "Agregar valor",
    noValues: "Sin valores",
    itemTitle: "Título",
    desc: "Descripción",
    barter: "Trueque e intercambio",
    barterSteps: "Pasos del trueque",
    addStep: "Agregar paso",
    noSteps: "Sin pasos",
    step: "Paso",
    exampleCards: "Tarjetas de ejemplo",
    addCard: "Agregar tarjeta",
    noCards: "Sin tarjetas",
    avatar: "Avatar (inicial)",
    offers: "Ofrece",
    seeks: "Busca",
    perfectExchange: "Texto «intercambio perfecto»",
    mutual: "Redes de apoyo mutuo",
    storiesHeads: "Encabezados de historias",
    storiesTitle: "Título de historias",
    storiesSubtitle: "Subtítulo de historias",
    stories: "Historias",
    addStory: "Agregar historia",
    noStories: "Sin historias",
    quote: "Cita",
    name: "Nombre",
    business: "Negocio / lugar",
    cta: "Llamado a la acción",
    button: "Botón",
  },
  en: {
    title: "Community",
    subtitle: "Intro, values, barter, mutual support, stories, and CTA",
    intro: "Header",
    badge: "Badge",
    pageTitle: "Title",
    pageSubtitle: "Subtitle",
    sectionTitle: "Section title",
    sectionSubtitle: "Section subtitle",
    valuesHeads: "Values headings",
    valuesTitle: "Values title",
    valuesSubtitle: "Values subtitle",
    values: "Values",
    addValue: "Add value",
    noValues: "No values",
    itemTitle: "Title",
    desc: "Description",
    barter: "Barter & exchange",
    barterSteps: "Barter steps",
    addStep: "Add step",
    noSteps: "No steps",
    step: "Step",
    exampleCards: "Example cards",
    addCard: "Add card",
    noCards: "No cards",
    avatar: "Avatar (initial)",
    offers: "Offers",
    seeks: "Seeks",
    perfectExchange: "“Perfect exchange” text",
    mutual: "Mutual support networks",
    storiesHeads: "Stories headings",
    storiesTitle: "Stories title",
    storiesSubtitle: "Stories subtitle",
    stories: "Stories",
    addStory: "Add story",
    noStories: "No stories",
    quote: "Quote",
    name: "Name",
    business: "Business / place",
    cta: "Call to action",
    button: "Button",
  },
} as const;

export default function CommunityPage() {
  const { language } = useLanguage();
  const T = STRINGS[language];
  const setCommunity = useAdminStore((s) => s.setCommunity);
  const initial = useAdminStore((s) => s.community);
  const { draft, update, save } = useSingletonDraft(initial, "community.json", setCommunity);

  return (
    <div>
      <PageHeader title={T.title} description={T.subtitle} entity="community.json" value={draft} onSave={save} />

      <div className="space-y-5">
        <AdminCard title={T.intro}>
          <BilingualField label={T.badge} es={draft.badge.es} en={draft.badge.en} onChange={(l, v) => update((d) => (d.badge[l] = v))} />
          <BilingualField label={T.pageTitle} es={draft.title.es} en={draft.title.en} onChange={(l, v) => update((d) => (d.title[l] = v))} />
          <BilingualTextArea label={T.pageSubtitle} es={draft.subtitle.es} en={draft.subtitle.en} onChange={(l, v) => update((d) => (d.subtitle[l] = v))} hint={RICH_TEXT_HINT} />
        </AdminCard>

        <AdminCard title={T.valuesHeads}>
          <BilingualField label={T.valuesTitle} es={draft.valuesTitle.es} en={draft.valuesTitle.en} onChange={(l, v) => update((d) => (d.valuesTitle[l] = v))} />
          <BilingualField label={T.valuesSubtitle} es={draft.valuesSubtitle.es} en={draft.valuesSubtitle.en} onChange={(l, v) => update((d) => (d.valuesSubtitle[l] = v))} />
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

        <AdminCard title={T.barter}>
          <BilingualField label={T.sectionTitle} es={draft.barter.title.es} en={draft.barter.title.en} onChange={(l, v) => update((d) => (d.barter.title[l] = v))} />
          <BilingualTextArea label={T.desc} es={draft.barter.description.es} en={draft.barter.description.en} onChange={(l, v) => update((d) => (d.barter.description[l] = v))} hint={RICH_TEXT_HINT} />
          <BilingualField label={T.perfectExchange} es={draft.barter.perfectExchange.es} en={draft.barter.perfectExchange.en} onChange={(l, v) => update((d) => (d.barter.perfectExchange[l] = v))} />
        </AdminCard>

        <RepeatableList
          title={T.barterSteps}
          items={draft.barter.how}
          addLabel={T.addStep}
          emptyLabel={T.noSteps}
          onAdd={() => update((d) => d.barter.how.push({ es: "", en: "" }))}
          onRemove={(i) => update((d) => d.barter.how.splice(i, 1))}
          onMove={(i, dir) => update((d) => moveItem(d.barter.how, i, dir))}
          renderItem={(step, i) => (
            <BilingualField label={`${T.step} ${i + 1}`} es={step.es} en={step.en} onChange={(l, v) => update((d) => (d.barter.how[i][l] = v))} />
          )}
        />

        <RepeatableList
          title={T.exampleCards}
          items={draft.barter.exampleCards}
          addLabel={T.addCard}
          emptyLabel={T.noCards}
          onAdd={() => update((d) => d.barter.exampleCards.push({ avatar: "", offers: { es: "", en: "" }, seeks: { es: "", en: "" } }))}
          onRemove={(i) => update((d) => d.barter.exampleCards.splice(i, 1))}
          onMove={(i, dir) => update((d) => moveItem(d.barter.exampleCards, i, dir))}
          renderItem={(card, i) => (
            <>
              <TextField label={T.avatar} value={card.avatar} onChange={(v) => update((d) => (d.barter.exampleCards[i].avatar = v))} />
              <BilingualField label={T.offers} es={card.offers.es} en={card.offers.en} onChange={(l, v) => update((d) => (d.barter.exampleCards[i].offers[l] = v))} />
              <BilingualField label={T.seeks} es={card.seeks.es} en={card.seeks.en} onChange={(l, v) => update((d) => (d.barter.exampleCards[i].seeks[l] = v))} />
            </>
          )}
        />

        <AdminCard title={T.mutual}>
          <BilingualField label={T.sectionTitle} es={draft.mutual.title.es} en={draft.mutual.title.en} onChange={(l, v) => update((d) => (d.mutual.title[l] = v))} />
          <BilingualTextArea label={T.desc} es={draft.mutual.description.es} en={draft.mutual.description.en} onChange={(l, v) => update((d) => (d.mutual.description[l] = v))} hint={RICH_TEXT_HINT} />
        </AdminCard>

        <AdminCard title={T.storiesHeads}>
          <BilingualField label={T.storiesTitle} es={draft.storiesTitle.es} en={draft.storiesTitle.en} onChange={(l, v) => update((d) => (d.storiesTitle[l] = v))} />
          <BilingualField label={T.storiesSubtitle} es={draft.storiesSubtitle.es} en={draft.storiesSubtitle.en} onChange={(l, v) => update((d) => (d.storiesSubtitle[l] = v))} />
        </AdminCard>

        <RepeatableList
          title={T.stories}
          items={draft.stories}
          addLabel={T.addStory}
          emptyLabel={T.noStories}
          onAdd={() => update((d) => d.stories.push({ quote: { es: "", en: "" }, name: { es: "", en: "" }, business: { es: "", en: "" } }))}
          onRemove={(i) => update((d) => d.stories.splice(i, 1))}
          onMove={(i, dir) => update((d) => moveItem(d.stories, i, dir))}
          renderItem={(story, i) => (
            <>
              <BilingualTextArea label={T.quote} es={story.quote.es} en={story.quote.en} onChange={(l, v) => update((d) => (d.stories[i].quote[l] = v))} hint={RICH_TEXT_HINT} />
              <BilingualField label={T.name} es={story.name.es} en={story.name.en} onChange={(l, v) => update((d) => (d.stories[i].name[l] = v))} />
              <BilingualField label={T.business} es={story.business.es} en={story.business.en} onChange={(l, v) => update((d) => (d.stories[i].business[l] = v))} />
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
