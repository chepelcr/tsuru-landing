// Planes — the monetization surface. Reads plans.json (bilingual content
// entity) and renders: the solidarity promise, a monthly/annual toggle, the
// four tier cards, add-ons, a full comparison table, and the plan FAQ.
//
// Amounts live in plans.json and are formatted here; `config.draftPricing`
// flips a visible "pricing under review" notice so preliminary numbers can
// never read as final.

import { useState } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { RichText } from "@/lib/rich-text";
import { Button } from "@/components/ui/button";
import plans from "@/content/plans.json";
import { formatCRC } from "@/lib/currency";
import {
  Sprout,
  Wheat,
  Users,
  Tent,
  Building2,
  Cloud,
  GraduationCap,
  Check,
  Minus,
  HeartHandshake,
  ArrowRight,
  Info,
} from "lucide-react";

type Bi = { es: string; en: string };
type Lang = "es" | "en";

// Editable iconName → component. Keyed by the PascalCase names stored in
// plans.json (same approach as Landing.tsx's PILLAR_ICONS).
const PLAN_ICONS: Record<string, React.ElementType> = {
  Sprout,
  Wheat,
  Users,
  Tent,
};

const ADDON_ICONS: Record<string, React.ElementType> = {
  Building2,
  Cloud,
  GraduationCap,
};

const TIER_IDS = ["semilla", "cosecha", "cooperativa", "feria"] as const;
type TierId = (typeof TIER_IDS)[number];

// ─── Sub-components ───────────────────────────────────────────────────────────

function PlanCard({
  plan,
  cycle,
  lang,
  labels,
  comingSoon,
}: {
  plan: (typeof plans.plans)[number];
  cycle: "monthly" | "annual";
  lang: Lang;
  labels: typeof plans.planLabels;
  /** Plans aren't purchasable yet — render the CTA inert. */
  comingSoon: boolean;
}) {
  const pick = (f: Bi) => f[lang] ?? f.es;
  const Icon = PLAN_ICONS[plan.iconName] ?? Sprout;

  const isFree = !plan.customPrice && plan.priceMonthly === 0 && plan.priceAnnual === 0;
  const amount = cycle === "annual" ? plan.priceAnnual : plan.priceMonthly;
  const suffix = plan.customPrice
    ? ""
    : isFree
      ? pick(labels.forever)
      : cycle === "annual"
        ? pick(labels.perYear)
        : pick(labels.perMonth);

  const badge = pick(plan.badge);
  const isInternalCta = plan.ctaHref.startsWith("/");

  const ctaClass = `w-full rounded-full ${
    plan.highlighted
      ? "bg-primary text-primary-foreground hover:bg-primary/90"
      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
  }`;

  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-6 transition-all hover:-translate-y-1 ${
        plan.highlighted
          ? "bg-primary/5 border-primary/40 shadow-lg ring-1 ring-primary/20"
          : "bg-card border-border hover:border-primary/30 hover:shadow-md"
      }`}
    >
      {badge && (
        <span
          className={`absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${
            plan.highlighted
              ? "bg-primary text-primary-foreground"
              : "bg-accent/15 text-accent border border-accent/30"
          }`}
        >
          {badge}
        </span>
      )}

      <div className="mb-4 flex items-center gap-3">
        <div
          className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${
            plan.highlighted ? "bg-primary/15" : "bg-primary/10"
          }`}
        >
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-foreground">{pick(plan.name)}</h3>
      </div>

      <p className="mb-5 min-h-[4.5rem] text-sm leading-relaxed text-muted-foreground text-justify">
        <RichText>{pick(plan.tagline)}</RichText>
      </p>

      <div className="mb-1 flex min-h-[2.75rem] items-baseline gap-1.5">
        {plan.customPrice ? (
          <span className="font-serif text-3xl font-bold text-foreground">
            {pick(labels.customPrice)}
          </span>
        ) : (
          <>
            <span className="font-serif text-4xl font-bold text-foreground">
              {formatCRC(amount)}
            </span>
            <span className="text-sm text-muted-foreground">{suffix}</span>
          </>
        )}
      </div>
      <p className="mb-6 min-h-[4rem] text-xs leading-relaxed text-muted-foreground text-justify">
        {pick(plan.subline)}
      </p>

      {comingSoon ? (
        // No link wrapper at all — an inert button, not a navigable control.
        <Button disabled className="w-full rounded-full" aria-disabled="true">
          {pick(labels.comingSoon)}
        </Button>
      ) : isInternalCta ? (
        <Link href={plan.ctaHref}>
          <Button className={ctaClass}>{pick(plan.ctaLabel)}</Button>
        </Link>
      ) : (
        <a href={plan.ctaHref} target="_blank" rel="noopener noreferrer">
          <Button className={ctaClass}>{pick(plan.ctaLabel)}</Button>
        </a>
      )}

      <ul className="mt-6 flex-1 space-y-2.5 border-t border-border pt-6">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm">
            {feature.enabled ? (
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
            ) : (
              <Minus className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground/40" />
            )}
            <span
              className={
                feature.enabled ? "text-foreground/90" : "text-muted-foreground/60 line-through"
              }
            >
              <RichText>{pick(feature.label)}</RichText>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Planes() {
  const { language } = useLanguage();
  const lang = language as Lang;
  const pick = (f: Bi) => f[lang] ?? f.es;

  const [cycle, setCycle] = useState<"monthly" | "annual">(
    plans.config.defaultBillingCycle === "monthly" ? "monthly" : "annual",
  );

  return (
    <div className="min-h-screen bg-background">

      {/* ═══════════════════════════════════════════════════════════════ HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10" />
        <div className="pointer-events-none absolute -top-10 left-1/2 h-72 w-[640px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-20 sm:px-6 lg:px-8 lg:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Sprout className="h-3.5 w-3.5" />
              {pick(plans.page.badge)}
            </div>

            <h1 className="mb-6 font-serif text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              <RichText>{pick(plans.page.title)}</RichText>
            </h1>

            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
              <RichText>{pick(plans.page.subtitle)}</RichText>
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════ BILLING + PLANS */}
      <section id="planes" className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Monthly / annual toggle */}
          <div className="mb-4 flex justify-center">
            <div className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/60 p-1.5">
              <button
                type="button"
                onClick={() => setCycle("monthly")}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                  cycle === "monthly"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {pick(plans.billingToggle.monthly)}
              </button>
              <button
                type="button"
                onClick={() => setCycle("annual")}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                  cycle === "annual"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {pick(plans.billingToggle.annual)}
                {plans.config.annualDiscountMonths > 0 && (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                    {pick(plans.billingToggle.badge)}
                  </span>
                )}
              </button>
            </div>
          </div>

          <p className="mb-2 text-center text-sm text-muted-foreground">
            {pick(plans.billingToggle.savingsNote)}
          </p>

          {/* Stated next to the amounts, not buried in the FAQ — "sin cargos
              ocultos" only holds if the tax treatment is visible where the
              price is. */}
          <p className="mb-8 text-center text-sm text-muted-foreground">
            <RichText>{pick(plans.planLabels.taxNote)}</RichText>
          </p>

          {/* Preliminary-pricing notice — hidden once draftPricing is false */}
          {plans.config.draftPricing && (
            <div className="mx-auto mb-10 flex max-w-2xl items-start gap-2.5 rounded-xl border border-accent/30 bg-accent/5 px-4 py-3">
              <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
              <p className="text-sm leading-relaxed text-muted-foreground text-justify">
                {pick(plans.planLabels.draftNotice)}
              </p>
            </div>
          )}

          {/* Tier cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {plans.plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                cycle={cycle}
                lang={lang}
                labels={plans.planLabels}
                comingSoon={plans.config.ctaComingSoon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════ PROMISE */}
      <section className="border-y border-border bg-muted/30 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-center gap-3">
            <HeartHandshake className="h-6 w-6 text-primary" />
            <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
              {pick(plans.promise.title)}
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {plans.promise.points.map((point, i) => (
              <div
                key={i}
                className="flex gap-3 rounded-2xl border border-border bg-card p-5"
              >
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                <p className="text-sm leading-relaxed text-muted-foreground text-justify">
                  <RichText>{pick(point)}</RichText>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════ ADDONS */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-3">
            {plans.addons.map((addon, i) => {
              const Icon = ADDON_ICONS[addon.iconName] ?? Building2;
              return (
                <div
                  key={i}
                  className="flex gap-3 rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10">
                    <Icon className="h-4.5 w-4.5 text-accent" />
                  </div>
                  <div>
                    <h3 className="mb-1.5 font-semibold text-foreground">{pick(addon.title)}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground text-justify">
                      <RichText>{pick(addon.description)}</RichText>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════ COMPARISON */}
      <section className="pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="mb-3 font-serif text-3xl font-bold text-foreground">
              {pick(plans.comparison.title)}
            </h2>
            <p className="text-muted-foreground">
              <RichText>{pick(plans.comparison.subtitle)}</RichText>
            </p>
          </div>

          {/* Wide table scrolls inside its own container on small screens */}
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-5 py-4 text-left font-semibold text-foreground">
                    {pick(plans.comparison.title)}
                  </th>
                  {plans.plans.map((plan) => (
                    <th
                      key={plan.id}
                      className={`px-5 py-4 text-center font-semibold ${
                        plan.highlighted ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {pick(plan.name)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {plans.comparison.rows.map((row, i) => (
                  <tr
                    key={i}
                    className={`border-t border-border ${i % 2 === 1 ? "bg-muted/20" : ""}`}
                  >
                    <td className="px-5 py-3.5 font-medium text-foreground">
                      {pick(row.label)}
                    </td>
                    {TIER_IDS.map((tier) => {
                      const value = pick(row.values[tier as TierId]);
                      const isNegative =
                        value === plans.comparison.no.es || value === plans.comparison.no.en;
                      return (
                        <td
                          key={tier}
                          className={`px-5 py-3.5 text-center ${
                            isNegative ? "text-muted-foreground/50" : "text-muted-foreground"
                          }`}
                        >
                          {value}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ FAQ */}
      <section className="border-t border-border bg-muted/30 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-center font-serif text-3xl font-bold text-foreground">
            {pick(plans.faq.title)}
          </h2>

          <div className="space-y-4">
            {plans.faq.items.map((item, i) => (
              <details
                key={i}
                className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-foreground">
                  {pick(item.question)}
                  <ArrowRight className="h-4 w-4 flex-shrink-0 text-primary transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-justify">
                  <RichText>{pick(item.answer)}</RichText>
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 font-serif text-3xl font-bold text-foreground">
            {pick(plans.cta.title)}
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            <RichText>{pick(plans.cta.subtitle)}</RichText>
          </p>
          <Link href={plans.cta.buttonHref}>
            <Button
              size="lg"
              className="rounded-full bg-primary px-8 text-primary-foreground hover:bg-primary/90"
            >
              {pick(plans.cta.button)}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
