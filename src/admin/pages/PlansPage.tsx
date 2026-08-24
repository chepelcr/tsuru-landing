// Plans & pricing — singleton editor for plans.json: the monetization surface.
// Covers the page intro, the solidarity promise, billing-cycle chrome, the four
// tier cards (with amounts and per-tier feature lists), add-ons, the comparison
// table, the plan FAQ, and the closing CTA. Chrome is bilingual via a per-page
// T dict, matching every other editor here.

import { useLanguage } from "@/contexts/LanguageContext";
import { useAdminStore } from "@/lib/admin-store";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  AdminCard,
  BilingualField,
  BilingualTextArea,
  RepeatableList,
  TextField,
  Toggle,
} from "@/components/admin/AdminUI";
import { RICH_TEXT_HINT } from "@/lib/rich-text";
import { useSingletonDraft, moveItem } from "@/admin/useSingletonDraft";

const TIER_IDS = ["semilla", "cosecha", "cooperativa", "feria"] as const;

const STRINGS = {
  es: {
    title: "Planes y precios",
    subtitle: "Tarifas, promesa solidaria, comparación y preguntas frecuentes",
    intro: "Encabezado",
    badge: "Insignia",
    pageTitle: "Título",
    pageSubtitle: "Subtítulo",
    config: "Configuración de cobro",
    currency: "Moneda",
    annualDiscountMonths: "Meses de regalo en el plan anual",
    moneyBackDays: "Días de garantía de devolución",
    defaultBillingCycle: "Ciclo por defecto (monthly / annual)",
    draftPricing: "Precios preliminares (muestra el aviso «en revisión»)",
    draftHint:
      "Mientras esté activo, la página muestra un aviso de que los montos pueden cambiar. Desactivalo solo cuando los precios sean definitivos.",
    ctaComingSoon: "Botones en «Próximamente» (desactiva la compra)",
    ctaComingSoonHint:
      "Mientras esté activo, los botones de todos los planes salen desactivados con la etiqueta «Próximamente». Desactivalo cuando el backend de suscripciones esté listo.",
    promise: "Promesa solidaria",
    promiseTitle: "Título de la promesa",
    promisePoints: "Puntos de la promesa",
    addPromisePoint: "Agregar punto",
    noPromisePoints: "Sin puntos",
    point: "Punto",
    toggle: "Selector mensual / anual",
    monthly: "Etiqueta «Mensual»",
    annual: "Etiqueta «Anual»",
    toggleBadge: "Insignia de ahorro",
    savingsNote: "Nota de ahorro",
    labels: "Etiquetas de precio",
    perMonth: "Sufijo mensual",
    perYear: "Sufijo anual",
    forever: "Sufijo «para siempre»",
    customPrice: "Texto de precio a convenir",
    mostPopular: "Etiqueta «más elegido»",
    draftNotice: "Aviso de precios preliminares",
    comingSoonLabel: "Etiqueta «Próximamente»",
    plans: "Planes",
    addPlan: "Agregar plan",
    noPlans: "Sin planes",
    planId: "ID (usado por la tabla de comparación)",
    iconName: "Ícono (Sprout, Wheat, Users, Tent)",
    planName: "Nombre",
    tagline: "Descripción corta",
    priceMonthly: "Precio mensual (₡)",
    priceAnnual: "Precio anual (₡)",
    isCustomPrice: "Precio a convenir (oculta los montos)",
    planBadge: "Insignia (vacío = sin insignia)",
    highlighted: "Destacado",
    subline: "Línea bajo el precio",
    ctaLabel: "Texto del botón",
    ctaHref: "Enlace del botón",
    planFeatures: "Funciones del plan",
    addFeature: "Agregar función",
    noFeatures: "Sin funciones",
    featureLabel: "Función",
    featureEnabled: "Incluida",
    addons: "Complementos",
    addAddon: "Agregar complemento",
    noAddons: "Sin complementos",
    addonIcon: "Ícono (Building2, Cloud, GraduationCap)",
    itemTitle: "Título",
    itemDesc: "Descripción",
    comparison: "Tabla de comparación",
    compTitle: "Título",
    compSubtitle: "Subtítulo",
    yes: "Texto «incluido»",
    no: "Texto «no incluido»",
    rows: "Filas",
    addRow: "Agregar fila",
    noRows: "Sin filas",
    rowLabel: "Función",
    faq: "Preguntas frecuentes",
    faqTitle: "Título",
    faqItems: "Preguntas",
    addFaq: "Agregar pregunta",
    noFaq: "Sin preguntas",
    question: "Pregunta",
    answer: "Respuesta",
    cta: "Llamado a la acción",
    ctaTitle: "Título",
    ctaSubtitle: "Subtítulo",
    button: "Botón",
    buttonHref: "Enlace del botón",
  },
  en: {
    title: "Plans & pricing",
    subtitle: "Rates, solidarity promise, comparison, and FAQ",
    intro: "Header",
    badge: "Badge",
    pageTitle: "Title",
    pageSubtitle: "Subtitle",
    config: "Billing configuration",
    currency: "Currency",
    annualDiscountMonths: "Free months on the annual plan",
    moneyBackDays: "Money-back guarantee days",
    defaultBillingCycle: "Default cycle (monthly / annual)",
    draftPricing: "Preliminary pricing (shows the “under review” notice)",
    draftHint:
      "While this is on, the page shows a notice that amounts may change. Turn it off only once pricing is final.",
    ctaComingSoon: "CTAs show “Coming soon” (purchase disabled)",
    ctaComingSoonHint:
      "While this is on, every plan's button renders disabled with the “Coming soon” label. Turn it off when the subscription backend is ready.",
    promise: "Solidarity promise",
    promiseTitle: "Promise title",
    promisePoints: "Promise points",
    addPromisePoint: "Add point",
    noPromisePoints: "No points",
    point: "Point",
    toggle: "Monthly / annual toggle",
    monthly: "“Monthly” label",
    annual: "“Annual” label",
    toggleBadge: "Savings badge",
    savingsNote: "Savings note",
    labels: "Price labels",
    perMonth: "Monthly suffix",
    perYear: "Annual suffix",
    forever: "“Forever” suffix",
    customPrice: "Custom-price text",
    mostPopular: "“Most chosen” label",
    draftNotice: "Preliminary-pricing notice",
    comingSoonLabel: "“Coming soon” label",
    plans: "Plans",
    addPlan: "Add plan",
    noPlans: "No plans",
    planId: "ID (used by the comparison table)",
    iconName: "Icon (Sprout, Wheat, Users, Tent)",
    planName: "Name",
    tagline: "Short description",
    priceMonthly: "Monthly price (₡)",
    priceAnnual: "Annual price (₡)",
    isCustomPrice: "Custom price (hides the amounts)",
    planBadge: "Badge (empty = no badge)",
    highlighted: "Highlighted",
    subline: "Line under the price",
    ctaLabel: "Button text",
    ctaHref: "Button link",
    planFeatures: "Plan features",
    addFeature: "Add feature",
    noFeatures: "No features",
    featureLabel: "Feature",
    featureEnabled: "Included",
    addons: "Add-ons",
    addAddon: "Add add-on",
    noAddons: "No add-ons",
    addonIcon: "Icon (Building2, Cloud, GraduationCap)",
    itemTitle: "Title",
    itemDesc: "Description",
    comparison: "Comparison table",
    compTitle: "Title",
    compSubtitle: "Subtitle",
    yes: "“Included” text",
    no: "“Not included” text",
    rows: "Rows",
    addRow: "Add row",
    noRows: "No rows",
    rowLabel: "Feature",
    faq: "FAQ",
    faqTitle: "Title",
    faqItems: "Questions",
    addFaq: "Add question",
    noFaq: "No questions",
    question: "Question",
    answer: "Answer",
    cta: "Call to action",
    ctaTitle: "Title",
    ctaSubtitle: "Subtitle",
    button: "Button",
    buttonHref: "Button link",
  },
} as const;

export default function PlansPage() {
  const { language } = useLanguage();
  const T = STRINGS[language];
  const setPlans = useAdminStore((s) => s.setPlans);
  const initial = useAdminStore((s) => s.plans);
  const { draft, update, save } = useSingletonDraft(initial, "plans.json", setPlans);

  return (
    <div>
      <PageHeader
        title={T.title}
        description={T.subtitle}
        entity="plans.json"
        value={draft}
        onSave={save}
      />

      <div className="space-y-5">
        <AdminCard title={T.intro}>
          <BilingualField label={T.badge} es={draft.page.badge.es} en={draft.page.badge.en} onChange={(l, v) => update((d) => (d.page.badge[l] = v))} />
          <BilingualField label={T.pageTitle} es={draft.page.title.es} en={draft.page.title.en} onChange={(l, v) => update((d) => (d.page.title[l] = v))} />
          <BilingualTextArea label={T.pageSubtitle} es={draft.page.subtitle.es} en={draft.page.subtitle.en} onChange={(l, v) => update((d) => (d.page.subtitle[l] = v))} hint={RICH_TEXT_HINT} />
        </AdminCard>

        <AdminCard title={T.config}>
          <div className="grid grid-cols-2 gap-2">
            <TextField label={T.currency} value={draft.config.currency} onChange={(v) => update((d) => (d.config.currency = v))} />
            <TextField label={T.defaultBillingCycle} value={draft.config.defaultBillingCycle} onChange={(v) => update((d) => (d.config.defaultBillingCycle = v))} />
            <TextField label={T.annualDiscountMonths} value={String(draft.config.annualDiscountMonths)} onChange={(v) => update((d) => (d.config.annualDiscountMonths = Number(v) || 0))} />
            <TextField label={T.moneyBackDays} value={String(draft.config.moneyBackDays)} onChange={(v) => update((d) => (d.config.moneyBackDays = Number(v) || 0))} />
          </div>
          <Toggle label={T.draftPricing} checked={draft.config.draftPricing} onChange={(v) => update((d) => (d.config.draftPricing = v))} />
          <p className="text-xs text-muted-foreground">{T.draftHint}</p>
          <Toggle label={T.ctaComingSoon} checked={draft.config.ctaComingSoon} onChange={(v) => update((d) => (d.config.ctaComingSoon = v))} />
          <p className="text-xs text-muted-foreground">{T.ctaComingSoonHint}</p>
        </AdminCard>

        <AdminCard title={T.promise}>
          <BilingualField label={T.promiseTitle} es={draft.promise.title.es} en={draft.promise.title.en} onChange={(l, v) => update((d) => (d.promise.title[l] = v))} />
        </AdminCard>

        <RepeatableList
          title={T.promisePoints}
          items={draft.promise.points}
          addLabel={T.addPromisePoint}
          emptyLabel={T.noPromisePoints}
          onAdd={() => update((d) => d.promise.points.push({ es: "", en: "" }))}
          onRemove={(i) => update((d) => d.promise.points.splice(i, 1))}
          onMove={(i, dir) => update((d) => moveItem(d.promise.points, i, dir))}
          renderItem={(point, i) => (
            <BilingualTextArea label={T.point} es={point.es} en={point.en} onChange={(l, v) => update((d) => (d.promise.points[i][l] = v))} hint={RICH_TEXT_HINT} />
          )}
        />

        <AdminCard title={T.toggle}>
          <BilingualField label={T.monthly} es={draft.billingToggle.monthly.es} en={draft.billingToggle.monthly.en} onChange={(l, v) => update((d) => (d.billingToggle.monthly[l] = v))} />
          <BilingualField label={T.annual} es={draft.billingToggle.annual.es} en={draft.billingToggle.annual.en} onChange={(l, v) => update((d) => (d.billingToggle.annual[l] = v))} />
          <BilingualField label={T.toggleBadge} es={draft.billingToggle.badge.es} en={draft.billingToggle.badge.en} onChange={(l, v) => update((d) => (d.billingToggle.badge[l] = v))} />
          <BilingualField label={T.savingsNote} es={draft.billingToggle.savingsNote.es} en={draft.billingToggle.savingsNote.en} onChange={(l, v) => update((d) => (d.billingToggle.savingsNote[l] = v))} />
        </AdminCard>

        <AdminCard title={T.labels}>
          <BilingualField label={T.perMonth} es={draft.planLabels.perMonth.es} en={draft.planLabels.perMonth.en} onChange={(l, v) => update((d) => (d.planLabels.perMonth[l] = v))} />
          <BilingualField label={T.perYear} es={draft.planLabels.perYear.es} en={draft.planLabels.perYear.en} onChange={(l, v) => update((d) => (d.planLabels.perYear[l] = v))} />
          <BilingualField label={T.forever} es={draft.planLabels.forever.es} en={draft.planLabels.forever.en} onChange={(l, v) => update((d) => (d.planLabels.forever[l] = v))} />
          <BilingualField label={T.customPrice} es={draft.planLabels.customPrice.es} en={draft.planLabels.customPrice.en} onChange={(l, v) => update((d) => (d.planLabels.customPrice[l] = v))} />
          <BilingualField label={T.mostPopular} es={draft.planLabels.mostPopular.es} en={draft.planLabels.mostPopular.en} onChange={(l, v) => update((d) => (d.planLabels.mostPopular[l] = v))} />
          <BilingualTextArea label={T.draftNotice} es={draft.planLabels.draftNotice.es} en={draft.planLabels.draftNotice.en} onChange={(l, v) => update((d) => (d.planLabels.draftNotice[l] = v))} />
          <BilingualField label={T.comingSoonLabel} es={draft.planLabels.comingSoon.es} en={draft.planLabels.comingSoon.en} onChange={(l, v) => update((d) => (d.planLabels.comingSoon[l] = v))} />
        </AdminCard>

        <RepeatableList
          title={T.plans}
          items={draft.plans}
          addLabel={T.addPlan}
          emptyLabel={T.noPlans}
          onAdd={() =>
            update((d) =>
              d.plans.push({
                id: "",
                iconName: "Sprout",
                name: { es: "", en: "" },
                tagline: { es: "", en: "" },
                priceMonthly: 0,
                priceAnnual: 0,
                customPrice: false,
                badge: { es: "", en: "" },
                highlighted: false,
                subline: { es: "", en: "" },
                ctaLabel: { es: "", en: "" },
                ctaHref: "",
                features: [],
              }),
            )
          }
          onRemove={(i) => update((d) => d.plans.splice(i, 1))}
          onMove={(i, dir) => update((d) => moveItem(d.plans, i, dir))}
          renderItem={(plan, i) => (
            <>
              <div className="grid grid-cols-2 gap-2">
                <TextField label={T.planId} value={plan.id} onChange={(v) => update((d) => (d.plans[i].id = v))} />
                <TextField label={T.iconName} value={plan.iconName} onChange={(v) => update((d) => (d.plans[i].iconName = v))} />
              </div>
              <BilingualField label={T.planName} es={plan.name.es} en={plan.name.en} onChange={(l, v) => update((d) => (d.plans[i].name[l] = v))} />
              <BilingualTextArea label={T.tagline} es={plan.tagline.es} en={plan.tagline.en} onChange={(l, v) => update((d) => (d.plans[i].tagline[l] = v))} hint={RICH_TEXT_HINT} />

              <div className="grid grid-cols-2 gap-2">
                <TextField label={T.priceMonthly} value={String(plan.priceMonthly)} onChange={(v) => update((d) => (d.plans[i].priceMonthly = Number(v) || 0))} />
                <TextField label={T.priceAnnual} value={String(plan.priceAnnual)} onChange={(v) => update((d) => (d.plans[i].priceAnnual = Number(v) || 0))} />
              </div>
              <Toggle label={T.isCustomPrice} checked={plan.customPrice} onChange={(v) => update((d) => (d.plans[i].customPrice = v))} />
              <Toggle label={T.highlighted} checked={plan.highlighted} onChange={(v) => update((d) => (d.plans[i].highlighted = v))} />

              <BilingualField label={T.planBadge} es={plan.badge.es} en={plan.badge.en} onChange={(l, v) => update((d) => (d.plans[i].badge[l] = v))} />
              <BilingualField label={T.subline} es={plan.subline.es} en={plan.subline.en} onChange={(l, v) => update((d) => (d.plans[i].subline[l] = v))} />
              <BilingualField label={T.ctaLabel} es={plan.ctaLabel.es} en={plan.ctaLabel.en} onChange={(l, v) => update((d) => (d.plans[i].ctaLabel[l] = v))} />
              <TextField label={T.ctaHref} value={plan.ctaHref} onChange={(v) => update((d) => (d.plans[i].ctaHref = v))} />

              <RepeatableList
                title={T.planFeatures}
                items={plan.features}
                addLabel={T.addFeature}
                emptyLabel={T.noFeatures}
                onAdd={() => update((d) => d.plans[i].features.push({ label: { es: "", en: "" }, enabled: true }))}
                onRemove={(j) => update((d) => d.plans[i].features.splice(j, 1))}
                onMove={(j, dir) => update((d) => moveItem(d.plans[i].features, j, dir))}
                renderItem={(feature, j) => (
                  <>
                    <BilingualField label={T.featureLabel} es={feature.label.es} en={feature.label.en} onChange={(l, v) => update((d) => (d.plans[i].features[j].label[l] = v))} />
                    <Toggle label={T.featureEnabled} checked={feature.enabled} onChange={(v) => update((d) => (d.plans[i].features[j].enabled = v))} />
                  </>
                )}
              />
            </>
          )}
        />

        <RepeatableList
          title={T.addons}
          items={draft.addons}
          addLabel={T.addAddon}
          emptyLabel={T.noAddons}
          onAdd={() => update((d) => d.addons.push({ iconName: "Building2", title: { es: "", en: "" }, description: { es: "", en: "" } }))}
          onRemove={(i) => update((d) => d.addons.splice(i, 1))}
          onMove={(i, dir) => update((d) => moveItem(d.addons, i, dir))}
          renderItem={(addon, i) => (
            <>
              <TextField label={T.addonIcon} value={addon.iconName} onChange={(v) => update((d) => (d.addons[i].iconName = v))} />
              <BilingualField label={T.itemTitle} es={addon.title.es} en={addon.title.en} onChange={(l, v) => update((d) => (d.addons[i].title[l] = v))} />
              <BilingualTextArea label={T.itemDesc} es={addon.description.es} en={addon.description.en} onChange={(l, v) => update((d) => (d.addons[i].description[l] = v))} hint={RICH_TEXT_HINT} />
            </>
          )}
        />

        <AdminCard title={T.comparison}>
          <BilingualField label={T.compTitle} es={draft.comparison.title.es} en={draft.comparison.title.en} onChange={(l, v) => update((d) => (d.comparison.title[l] = v))} />
          <BilingualField label={T.compSubtitle} es={draft.comparison.subtitle.es} en={draft.comparison.subtitle.en} onChange={(l, v) => update((d) => (d.comparison.subtitle[l] = v))} />
          <div className="grid grid-cols-2 gap-2">
            <BilingualField label={T.yes} es={draft.comparison.yes.es} en={draft.comparison.yes.en} onChange={(l, v) => update((d) => (d.comparison.yes[l] = v))} />
            <BilingualField label={T.no} es={draft.comparison.no.es} en={draft.comparison.no.en} onChange={(l, v) => update((d) => (d.comparison.no[l] = v))} />
          </div>
        </AdminCard>

        <RepeatableList
          title={T.rows}
          items={draft.comparison.rows}
          addLabel={T.addRow}
          emptyLabel={T.noRows}
          onAdd={() =>
            update((d) =>
              d.comparison.rows.push({
                label: { es: "", en: "" },
                values: {
                  semilla: { es: "", en: "" },
                  cosecha: { es: "", en: "" },
                  cooperativa: { es: "", en: "" },
                  feria: { es: "", en: "" },
                },
              }),
            )
          }
          onRemove={(i) => update((d) => d.comparison.rows.splice(i, 1))}
          onMove={(i, dir) => update((d) => moveItem(d.comparison.rows, i, dir))}
          renderItem={(row, i) => (
            <>
              <BilingualField label={T.rowLabel} es={row.label.es} en={row.label.en} onChange={(l, v) => update((d) => (d.comparison.rows[i].label[l] = v))} />
              {TIER_IDS.map((tier) => (
                <BilingualField
                  key={tier}
                  label={tier}
                  es={row.values[tier].es}
                  en={row.values[tier].en}
                  onChange={(l, v) => update((d) => (d.comparison.rows[i].values[tier][l] = v))}
                />
              ))}
            </>
          )}
        />

        <AdminCard title={T.faq}>
          <BilingualField label={T.faqTitle} es={draft.faq.title.es} en={draft.faq.title.en} onChange={(l, v) => update((d) => (d.faq.title[l] = v))} />
        </AdminCard>

        <RepeatableList
          title={T.faqItems}
          items={draft.faq.items}
          addLabel={T.addFaq}
          emptyLabel={T.noFaq}
          onAdd={() => update((d) => d.faq.items.push({ question: { es: "", en: "" }, answer: { es: "", en: "" } }))}
          onRemove={(i) => update((d) => d.faq.items.splice(i, 1))}
          onMove={(i, dir) => update((d) => moveItem(d.faq.items, i, dir))}
          renderItem={(item, i) => (
            <>
              <BilingualField label={T.question} es={item.question.es} en={item.question.en} onChange={(l, v) => update((d) => (d.faq.items[i].question[l] = v))} />
              <BilingualTextArea label={T.answer} es={item.answer.es} en={item.answer.en} onChange={(l, v) => update((d) => (d.faq.items[i].answer[l] = v))} hint={RICH_TEXT_HINT} />
            </>
          )}
        />

        <AdminCard title={T.cta}>
          <BilingualField label={T.ctaTitle} es={draft.cta.title.es} en={draft.cta.title.en} onChange={(l, v) => update((d) => (d.cta.title[l] = v))} />
          <BilingualTextArea label={T.ctaSubtitle} es={draft.cta.subtitle.es} en={draft.cta.subtitle.en} onChange={(l, v) => update((d) => (d.cta.subtitle[l] = v))} hint={RICH_TEXT_HINT} />
          <BilingualField label={T.button} es={draft.cta.button.es} en={draft.cta.button.en} onChange={(l, v) => update((d) => (d.cta.button[l] = v))} />
          <TextField label={T.buttonHref} value={draft.cta.buttonHref} onChange={(v) => update((d) => (d.cta.buttonHref = v))} />
        </AdminCard>
      </div>
    </div>
  );
}
