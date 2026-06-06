// Landing — singleton editor for landing.json: hero, "how it works" (+ steps),
// values (+ items), and the final CTA. Steps and value items are reorderable
// repeatable lists. Chrome is bilingual via a per-page T dict.

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
    title: "Inicio",
    subtitle: "Sección principal, cómo funciona, principios y llamado final",
    hero: "Hero",
    badge: "Insignia",
    heroTitle: "Título",
    subtitleF: "Subtítulo",
    cta: "Botón principal",
    secondary: "Botón secundario",
    howItWorks: "Cómo funciona",
    sectionTitle: "Título de sección",
    sectionSubtitle: "Subtítulo de sección",
    learnMore: "Enlace «ver más»",
    steps: "Pasos",
    addStep: "Agregar paso",
    noSteps: "Sin pasos",
    itemTitle: "Título",
    itemDesc: "Descripción",
    values: "Principios",
    items: "Principios",
    addValue: "Agregar principio",
    noValues: "Sin principios",
    finalCta: "Llamado final",
    button: "Botón",
  },
  en: {
    title: "Home",
    subtitle: "Hero, how it works, principles, and the final call to action",
    hero: "Hero",
    badge: "Badge",
    heroTitle: "Title",
    subtitleF: "Subtitle",
    cta: "Primary button",
    secondary: "Secondary button",
    howItWorks: "How it works",
    sectionTitle: "Section title",
    sectionSubtitle: "Section subtitle",
    learnMore: "“Learn more” link",
    steps: "Steps",
    addStep: "Add step",
    noSteps: "No steps",
    itemTitle: "Title",
    itemDesc: "Description",
    values: "Principles",
    items: "Principles",
    addValue: "Add principle",
    noValues: "No principles",
    finalCta: "Final call to action",
    button: "Button",
  },
} as const;

export default function LandingPage() {
  const { language } = useLanguage();
  const T = STRINGS[language];
  const setLanding = useAdminStore((s) => s.setLanding);
  const initial = useAdminStore((s) => s.landing);
  const { draft, update, save } = useSingletonDraft(initial, "landing.json", setLanding);

  return (
    <div>
      <PageHeader title={T.title} description={T.subtitle} entity="landing.json" value={draft} onSave={save} />

      <div className="space-y-5">
        <AdminCard title={T.hero}>
          <BilingualField label={T.badge} es={draft.hero.badge.es} en={draft.hero.badge.en} onChange={(l, v) => update((d) => (d.hero.badge[l] = v))} />
          <BilingualField label={T.heroTitle} es={draft.hero.title.es} en={draft.hero.title.en} onChange={(l, v) => update((d) => (d.hero.title[l] = v))} />
          <BilingualTextArea label={T.subtitleF} es={draft.hero.subtitle.es} en={draft.hero.subtitle.en} onChange={(l, v) => update((d) => (d.hero.subtitle[l] = v))} hint={RICH_TEXT_HINT} />
          <BilingualField label={T.cta} es={draft.hero.cta.es} en={draft.hero.cta.en} onChange={(l, v) => update((d) => (d.hero.cta[l] = v))} />
          <BilingualField label={T.secondary} es={draft.hero.secondary.es} en={draft.hero.secondary.en} onChange={(l, v) => update((d) => (d.hero.secondary[l] = v))} />
        </AdminCard>

        <AdminCard title={T.howItWorks}>
          <BilingualField label={T.sectionTitle} es={draft.howItWorks.title.es} en={draft.howItWorks.title.en} onChange={(l, v) => update((d) => (d.howItWorks.title[l] = v))} />
          <BilingualField label={T.sectionSubtitle} es={draft.howItWorks.subtitle.es} en={draft.howItWorks.subtitle.en} onChange={(l, v) => update((d) => (d.howItWorks.subtitle[l] = v))} />
          <BilingualField label={T.learnMore} es={draft.howItWorks.learnMore.es} en={draft.howItWorks.learnMore.en} onChange={(l, v) => update((d) => (d.howItWorks.learnMore[l] = v))} />
        </AdminCard>

        <RepeatableList
          title={T.steps}
          items={draft.howItWorks.steps}
          addLabel={T.addStep}
          emptyLabel={T.noSteps}
          onAdd={() => update((d) => d.howItWorks.steps.push({ title: { es: "", en: "" }, description: { es: "", en: "" } }))}
          onRemove={(i) => update((d) => d.howItWorks.steps.splice(i, 1))}
          onMove={(i, dir) => update((d) => moveItem(d.howItWorks.steps, i, dir))}
          renderItem={(step, i) => (
            <>
              <BilingualField label={T.itemTitle} es={step.title.es} en={step.title.en} onChange={(l, v) => update((d) => (d.howItWorks.steps[i].title[l] = v))} />
              <BilingualTextArea label={T.itemDesc} es={step.description.es} en={step.description.en} onChange={(l, v) => update((d) => (d.howItWorks.steps[i].description[l] = v))} hint={RICH_TEXT_HINT} />
            </>
          )}
        />

        <AdminCard title={T.values}>
          <BilingualField label={T.sectionTitle} es={draft.values.title.es} en={draft.values.title.en} onChange={(l, v) => update((d) => (d.values.title[l] = v))} />
          <BilingualField label={T.sectionSubtitle} es={draft.values.subtitle.es} en={draft.values.subtitle.en} onChange={(l, v) => update((d) => (d.values.subtitle[l] = v))} />
        </AdminCard>

        <RepeatableList
          title={T.items}
          items={draft.values.items}
          addLabel={T.addValue}
          emptyLabel={T.noValues}
          onAdd={() => update((d) => d.values.items.push({ title: { es: "", en: "" }, description: { es: "", en: "" } }))}
          onRemove={(i) => update((d) => d.values.items.splice(i, 1))}
          onMove={(i, dir) => update((d) => moveItem(d.values.items, i, dir))}
          renderItem={(item, i) => (
            <>
              <BilingualField label={T.itemTitle} es={item.title.es} en={item.title.en} onChange={(l, v) => update((d) => (d.values.items[i].title[l] = v))} />
              <BilingualTextArea label={T.itemDesc} es={item.description.es} en={item.description.en} onChange={(l, v) => update((d) => (d.values.items[i].description[l] = v))} hint={RICH_TEXT_HINT} />
            </>
          )}
        />

        <AdminCard title={T.finalCta}>
          <BilingualField label={T.sectionTitle} es={draft.finalCta.title.es} en={draft.finalCta.title.en} onChange={(l, v) => update((d) => (d.finalCta.title[l] = v))} />
          <BilingualTextArea label={T.subtitleF} es={draft.finalCta.subtitle.es} en={draft.finalCta.subtitle.en} onChange={(l, v) => update((d) => (d.finalCta.subtitle[l] = v))} hint={RICH_TEXT_HINT} />
          <BilingualField label={T.button} es={draft.finalCta.button.es} en={draft.finalCta.button.en} onChange={(l, v) => update((d) => (d.finalCta.button[l] = v))} />
        </AdminCard>
      </div>
    </div>
  );
}
