// Landing — singleton editor for landing.json: hero, "how it works" (+ steps),
// orders, storefront, values (+ items), and the final CTA. Steps and value items are reorderable
// repeatable lists. Chrome is bilingual via a per-page T dict.

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
    title: "Inicio",
    subtitle: "Sección principal, pedidos, tienda, principios y llamado final",
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
    orders: "Pedidos · ejemplo ilustrativo",
    storefront: "Tienda en línea · hoy y próximamente",
    body: "Texto principal",
    exampleLabel: "Etiqueta del ejemplo",
    exampleMessage: "Mensaje del cliente",
    exampleOrder: "Pedido preparado",
    exampleFollowUp: "Seguimiento y entrega",
    exampleInvoice: "Factura, si corresponde",
    exampleSteps: "Etiquetas de la secuencia",
    currentTitle: "Título de lo disponible hoy",
    currentBody: "Descripción de lo disponible hoy",
    futureStatus: "Estado del plan",
    futureTitle: "Título del plan",
    futureBody: "Descripción del plan",
    itemTitle: "Título",
    itemDesc: "Descripción",
    values: "Principios",
    items: "Principios",
    addValue: "Agregar principio",
    noValues: "Sin principios",
    spotlight: "Comunidad (3 pilares)",
    spotlightLink: "Enlace «comunidad»",
    pillarStatus: "Estado",
    pillarIcon: "Ícono",
    pillars: "Pilares",
    addPillar: "Agregar pilar",
    noPillars: "Sin pilares",
    finalCta: "Llamado final",
    button: "Botón",
  },
  en: {
    title: "Home",
    subtitle: "Hero, orders, store, principles, and the final call to action",
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
    orders: "Orders · illustrative example",
    storefront: "Online store · today and coming soon",
    body: "Main copy",
    exampleLabel: "Example label",
    exampleMessage: "Customer message",
    exampleOrder: "Prepared order",
    exampleFollowUp: "Tracking and delivery",
    exampleInvoice: "Invoice, if applicable",
    exampleSteps: "Sequence labels",
    currentTitle: "Available today title",
    currentBody: "Available today description",
    futureStatus: "Planned status",
    futureTitle: "Planned title",
    futureBody: "Planned description",
    itemTitle: "Title",
    itemDesc: "Description",
    values: "Principles",
    items: "Principles",
    addValue: "Add principle",
    noValues: "No principles",
    spotlight: "Community (3 pillars)",
    spotlightLink: "“Community” link",
    pillarStatus: "Status",
    pillarIcon: "Icon",
    pillars: "Pillars",
    addPillar: "Add pillar",
    noPillars: "No pillars",
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

        <AdminCard title={T.orders}>
          <BilingualField label={T.badge} es={draft.orders.badge.es} en={draft.orders.badge.en} onChange={(l, v) => update((d) => (d.orders.badge[l] = v))} />
          <BilingualField label={T.sectionTitle} es={draft.orders.title.es} en={draft.orders.title.en} onChange={(l, v) => update((d) => (d.orders.title[l] = v))} />
          <BilingualTextArea label={T.body} es={draft.orders.body.es} en={draft.orders.body.en} onChange={(l, v) => update((d) => (d.orders.body[l] = v))} hint={RICH_TEXT_HINT} />
          <BilingualField label={T.exampleLabel} es={draft.orders.exampleLabel.es} en={draft.orders.exampleLabel.en} onChange={(l, v) => update((d) => (d.orders.exampleLabel[l] = v))} />
          <BilingualTextArea label={T.exampleMessage} es={draft.orders.exampleMessage.es} en={draft.orders.exampleMessage.en} onChange={(l, v) => update((d) => (d.orders.exampleMessage[l] = v))} hint={RICH_TEXT_HINT} />
          <BilingualTextArea label={T.exampleOrder} es={draft.orders.exampleOrder.es} en={draft.orders.exampleOrder.en} onChange={(l, v) => update((d) => (d.orders.exampleOrder[l] = v))} hint={RICH_TEXT_HINT} />
          <BilingualTextArea label={T.exampleFollowUp} es={draft.orders.exampleFollowUp.es} en={draft.orders.exampleFollowUp.en} onChange={(l, v) => update((d) => (d.orders.exampleFollowUp[l] = v))} hint={RICH_TEXT_HINT} />
          <BilingualTextArea label={T.exampleInvoice} es={draft.orders.exampleInvoice.es} en={draft.orders.exampleInvoice.en} onChange={(l, v) => update((d) => (d.orders.exampleInvoice[l] = v))} hint={RICH_TEXT_HINT} />
        </AdminCard>

        <RepeatableList
          title={T.exampleSteps}
          items={draft.orders.exampleSteps}
          addLabel={T.addStep}
          emptyLabel={T.noSteps}
          onAdd={() => update((d) => d.orders.exampleSteps.push({ es: "", en: "" }))}
          onRemove={(i) => update((d) => d.orders.exampleSteps.splice(i, 1))}
          onMove={(i, dir) => update((d) => moveItem(d.orders.exampleSteps, i, dir))}
          renderItem={(step, i) => (
            <BilingualField label={T.itemTitle} es={step.es} en={step.en} onChange={(l, v) => update((d) => (d.orders.exampleSteps[i][l] = v))} />
          )}
        />

        <AdminCard title={T.storefront}>
          <BilingualField label={T.badge} es={draft.storefront.badge.es} en={draft.storefront.badge.en} onChange={(l, v) => update((d) => (d.storefront.badge[l] = v))} />
          <BilingualField label={T.sectionTitle} es={draft.storefront.title.es} en={draft.storefront.title.en} onChange={(l, v) => update((d) => (d.storefront.title[l] = v))} />
          <BilingualTextArea label={T.body} es={draft.storefront.body.es} en={draft.storefront.body.en} onChange={(l, v) => update((d) => (d.storefront.body[l] = v))} hint={RICH_TEXT_HINT} />
          <BilingualField label={T.currentTitle} es={draft.storefront.currentTitle.es} en={draft.storefront.currentTitle.en} onChange={(l, v) => update((d) => (d.storefront.currentTitle[l] = v))} />
          <BilingualTextArea label={T.currentBody} es={draft.storefront.currentBody.es} en={draft.storefront.currentBody.en} onChange={(l, v) => update((d) => (d.storefront.currentBody[l] = v))} hint={RICH_TEXT_HINT} />
          <BilingualField label={T.futureStatus} es={draft.storefront.futureStatus.es} en={draft.storefront.futureStatus.en} onChange={(l, v) => update((d) => (d.storefront.futureStatus[l] = v))} />
          <BilingualField label={T.futureTitle} es={draft.storefront.futureTitle.es} en={draft.storefront.futureTitle.en} onChange={(l, v) => update((d) => (d.storefront.futureTitle[l] = v))} />
          <BilingualTextArea label={T.futureBody} es={draft.storefront.futureBody.es} en={draft.storefront.futureBody.en} onChange={(l, v) => update((d) => (d.storefront.futureBody[l] = v))} hint={RICH_TEXT_HINT} />
        </AdminCard>

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

        <AdminCard title={T.spotlight}>
          <BilingualField label={T.badge} es={draft.communitySpotlight.badge.es} en={draft.communitySpotlight.badge.en} onChange={(l, v) => update((d) => (d.communitySpotlight.badge[l] = v))} />
          <BilingualField label={T.sectionTitle} es={draft.communitySpotlight.title.es} en={draft.communitySpotlight.title.en} onChange={(l, v) => update((d) => (d.communitySpotlight.title[l] = v))} />
          <BilingualTextArea label={T.sectionSubtitle} es={draft.communitySpotlight.subtitle.es} en={draft.communitySpotlight.subtitle.en} onChange={(l, v) => update((d) => (d.communitySpotlight.subtitle[l] = v))} hint={RICH_TEXT_HINT} />
          <BilingualField label={T.spotlightLink} es={draft.communitySpotlight.link.es} en={draft.communitySpotlight.link.en} onChange={(l, v) => update((d) => (d.communitySpotlight.link[l] = v))} />
        </AdminCard>

        <RepeatableList
          title={T.pillars}
          items={draft.communitySpotlight.pillars}
          addLabel={T.addPillar}
          emptyLabel={T.noPillars}
          onAdd={() => update((d) => d.communitySpotlight.pillars.push({ iconName: "Sprout", status: { es: "", en: "" }, title: { es: "", en: "" }, description: { es: "", en: "" } }))}
          onRemove={(i) => update((d) => d.communitySpotlight.pillars.splice(i, 1))}
          onMove={(i, dir) => update((d) => moveItem(d.communitySpotlight.pillars, i, dir))}
          renderItem={(pillar, i) => (
            <>
              <TextField label={T.pillarIcon} value={pillar.iconName} onChange={(v) => update((d) => (d.communitySpotlight.pillars[i].iconName = v))} />
              <BilingualField label={T.pillarStatus} es={pillar.status.es} en={pillar.status.en} onChange={(l, v) => update((d) => (d.communitySpotlight.pillars[i].status[l] = v))} />
              <BilingualField label={T.itemTitle} es={pillar.title.es} en={pillar.title.en} onChange={(l, v) => update((d) => (d.communitySpotlight.pillars[i].title[l] = v))} />
              <BilingualTextArea label={T.itemDesc} es={pillar.description.es} en={pillar.description.en} onChange={(l, v) => update((d) => (d.communitySpotlight.pillars[i].description[l] = v))} hint={RICH_TEXT_HINT} />
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
