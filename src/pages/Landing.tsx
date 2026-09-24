import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { RichText } from "@/lib/rich-text";
import { Button } from "@/components/ui/button";
import landing from "@/content/landing.json";
import billing from "@/content/billing.json";
import plans from "@/content/plans.json";
import { formatCRC } from "@/lib/currency";
import {
  UserPlus,
  Package,
  Share2,
  MessageCircle,
  ClipboardList,
  Truck,
  FileCheck2,
  Scale,
  Leaf,
  MapPin,
  Eye,
  ArrowRight,
  Sprout,
  ReceiptText,
  Store,
  Users,
  Check,
  Minus,
} from "lucide-react";

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepCard({ number, icon: Icon, title, description }: {
  number: number;
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="relative flex flex-col items-center text-center px-6">
      <div className="relative mb-5">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
          <Icon className="h-7 w-7 text-primary" />
        </div>
        <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
          {number}
        </span>
      </div>
      <h3 className="font-serif text-lg font-bold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed"><RichText>{description}</RichText></p>
    </div>
  );
}

function ValueCard({ icon: Icon, title, description, accent }: {
  icon: React.ElementType;
  title: string;
  description: string;
  accent?: boolean;
}) {
  return (
    <div className={`group flex gap-4 rounded-2xl p-6 border transition-all hover:-translate-y-1 hover:shadow-md ${
      accent
        ? 'bg-accent/5 border-accent/20 hover:border-accent/40'
        : 'bg-card border-border hover:border-primary/30'
    }`}>
      <div className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${
        accent ? 'bg-accent/10' : 'bg-primary/10'
      }`}>
        <Icon className={`h-5 w-5 ${accent ? 'text-accent' : 'text-primary'}`} />
      </div>
      <div>
        <h3 className="font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed text-justify"><RichText>{description}</RichText></p>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const STEP_ICONS = [UserPlus, Package, ClipboardList];
const ORDER_ICONS = [MessageCircle, ClipboardList, Truck, FileCheck2];
const VALUE_ICONS = [Scale, Leaf, MapPin, Eye];
// Community-spotlight pillar icons, keyed by the iconName in landing.json.
const PILLAR_ICONS: Record<string, React.ElementType> = {
  ReceiptText,
  Store,
  Users,
};

export default function Landing() {
  const { language: lang } = useLanguage();
  const pick = (f: { es: string; en: string }) => f[lang] ?? f.es;

  const values = landing.values.items;
  // hero/footer pills reuse the value titles (fair trade, local, transparency)
  const fairTradeTitle = pick(values[0].title);
  const localTitle = pick(values[2].title);
  const transparencyTitle = pick(values[3].title);

  return (
    <div className="min-h-screen bg-background">

      {/* ═══════════════════════════════════════════════════════════ HERO */}
      <section id="home" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10 pointer-events-none" />
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-secondary/10 blur-2xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="max-w-3xl mx-auto text-center">

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
              <Sprout className="h-3.5 w-3.5" />
              {pick(landing.hero.badge)}
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] tracking-tight mb-6">
              {pick(landing.hero.title)}
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
              <RichText>{pick(landing.hero.subtitle)}</RichText>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://app.tsuru.jcampos.dev/register"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-6 text-base font-semibold gap-2 shadow-lg shadow-primary/20"
                >
                  {pick(landing.hero.cta)}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
              <Link href="/ejemplos">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 py-6 text-base border-border text-foreground hover:bg-muted/50"
                >
                  {pick(landing.hero.secondary)}
                </Button>
              </Link>
            </div>

            <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                {fairTradeTitle}
              </span>
              <span className="text-border">·</span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                {localTitle}
              </span>
              <span className="text-border">·</span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                {transparencyTitle}
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ CÓMO FUNCIONA */}
      <section id="como-funciona" className="py-20 lg:py-28 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-14">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">{pick(landing.howItWorks.title)}</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mt-2 mb-4">
              <RichText>{pick(landing.howItWorks.subtitle)}</RichText>
            </h2>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
            {landing.howItWorks.steps.map((step, i) => (
              <StepCard
                key={i}
                number={i + 1}
                icon={STEP_ICONS[i]}
                title={pick(step.title)}
                description={pick(step.description)}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/funcionalidades">
              <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10 gap-2 rounded-full">
                {pick(landing.howItWorks.learnMore)}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════ PEDIDOS */}
      <section id="pedidos" className="py-20 lg:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                <ClipboardList className="h-3.5 w-3.5" />
                {pick(landing.orders.badge)}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-5">
                {pick(landing.orders.title)}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed text-justify">
                <RichText>{pick(landing.orders.body)}</RichText>
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-5">
                {pick(landing.orders.exampleLabel)}
              </p>
              <ol className="space-y-4">
                {[landing.orders.exampleMessage, landing.orders.exampleOrder, landing.orders.exampleFollowUp, landing.orders.exampleInvoice].map((item, i) => {
                  const Icon = ORDER_ICONS[i];
                  return (
                    <li key={i} className="flex gap-3 items-start">
                      <span className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <p className="text-sm text-muted-foreground leading-relaxed text-left sm:text-justify pt-1.5">
                        <RichText>{pick(item)}</RichText>
                      </p>
                    </li>
                  );
                })}
              </ol>
              <div className="mt-6 border-t border-border pt-5 flex flex-wrap gap-2">
                {landing.orders.exampleSteps.map((step, i) => (
                  <span key={i} className={`rounded-full px-3 py-1.5 text-xs font-medium ${i === landing.orders.exampleSteps.length - 1 ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-muted text-foreground'}`}>
                    {pick(step)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ TIENDA EN LÍNEA */}
      <section id="tienda" className="py-20 lg:py-28 bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
                <Store className="h-3.5 w-3.5" />
                {pick(landing.storefront.badge)}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-5">
                {pick(landing.storefront.title)}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed text-justify">
                <RichText>{pick(landing.storefront.body)}</RichText>
              </p>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl bg-card border border-primary/25 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><Share2 className="h-5 w-5" /></span>
                  <h3 className="font-semibold text-foreground">{pick(landing.storefront.currentTitle)}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed text-justify"><RichText>{pick(landing.storefront.currentBody)}</RichText></p>
              </div>
              <div className="rounded-2xl bg-card/60 border border-dashed border-accent/40 p-6">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <h3 className="font-semibold text-foreground">{pick(landing.storefront.futureTitle)}</h3>
                  <span className="flex-shrink-0 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">{pick(landing.storefront.futureStatus)}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed text-justify"><RichText>{pick(landing.storefront.futureBody)}</RichText></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ FACTURACIÓN ELECTRÓNICA */}
      <section id="facturacion" className="py-20 lg:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
                <ReceiptText className="h-3.5 w-3.5" />
                {pick(billing.badge)}
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-5">
                {pick(billing.title)}
              </h2>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6 text-justify">
                <RichText>{pick(billing.subtitle)}</RichText>
              </p>

              <p className="text-sm text-foreground/80 italic border-l-2 border-accent/40 pl-4 text-justify">
                <RichText>{pick(billing.note)}</RichText>
              </p>
            </div>

            <ul className="space-y-4">
              {billing.points.map((point, i) => (
                <li
                  key={i}
                  className="flex items-start gap-4 rounded-2xl p-5 bg-card border border-border"
                >
                  <span className="flex-shrink-0 w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Check className="h-5 w-5 text-primary" />
                  </span>
                  <span className="text-foreground font-medium leading-snug pt-1">
                    {pick(point)}
                  </span>
                </li>
              ))}
            </ul>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ PLANES (teaser) */}
      {/* Compact tier strip. Full detail — comparison table, add-ons, FAQ —
          lives on /planes; this only has to make the tiers legible and get the
          visitor there. Amounts come from the same plans.json the page uses. */}
      <section id="planes" className="py-20 lg:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-12 max-w-2xl mx-auto">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">
              {pick(plans.page.badge)}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mt-2 mb-4">
              <RichText>{pick(plans.page.title)}</RichText>
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              <RichText>{pick(plans.page.subtitle)}</RichText>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {plans.plans.map((plan) => {
              const isFree =
                !plan.customPrice && plan.priceMonthly === 0 && plan.priceAnnual === 0;
              const price = plan.customPrice
                ? pick(plans.planLabels.customPrice)
                : formatCRC(plan.priceMonthly);
              const suffix = plan.customPrice
                ? ""
                : isFree
                  ? pick(plans.planLabels.forever)
                  : pick(plans.planLabels.perMonth);

              return (
                <div
                  key={plan.id}
                  className={`row-span-4 grid grid-rows-subgrid gap-y-0 rounded-2xl p-6 border transition-all hover:-translate-y-1 hover:shadow-md ${
                    plan.highlighted
                      ? 'bg-primary/5 border-primary/40 ring-1 ring-primary/20'
                      : 'bg-card border-border hover:border-primary/30'
                  }`}
                >
                  <h3 className="font-serif text-xl font-bold text-foreground mb-1">
                    {pick(plan.name)}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4 text-justify">
                    {pick(plan.tagline)}
                  </p>

                  <div className="flex items-baseline gap-1.5 mb-5">
                    <span className="font-serif text-2xl font-bold text-foreground">{price}</span>
                    {suffix && <span className="text-xs text-muted-foreground">{suffix}</span>}
                  </div>

                  {/* First four features are enough to differentiate the tiers here. */}
                  <ul className="space-y-2 text-sm">
                    {plan.features.slice(0, 4).map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        {feature.enabled ? (
                          <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        ) : (
                          <Minus className="h-4 w-4 text-muted-foreground/40 flex-shrink-0 mt-0.5" />
                        )}
                        <span className="text-muted-foreground leading-snug">
                          {pick(feature.label)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <a href={plans.teaser.buttonHref} target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8"
              >
                {pick(plans.teaser.button)}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════ VALORES */}
      <section id="valores" className="py-20 lg:py-28 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-14">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">{pick(landing.values.title)}</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mt-2 mb-4">
              <RichText>{pick(landing.values.subtitle)}</RichText>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((value, i) => (
              <ValueCard
                key={i}
                icon={VALUE_ICONS[i]}
                title={pick(value.title)}
                description={pick(value.description)}
                accent={i >= 2}
              />
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════ COMUNIDAD (3 PILARES) */}
      <section id="comunidad-spotlight" className="py-20 lg:py-28 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-14 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-5">
              <Users className="h-3.5 w-3.5" />
              {pick(landing.communitySpotlight.badge)}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {pick(landing.communitySpotlight.title)}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              <RichText>{pick(landing.communitySpotlight.subtitle)}</RichText>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {landing.communitySpotlight.pillars.map((pillar, i) => {
              const Icon = PILLAR_ICONS[pillar.iconName] ?? Sprout;
              return (
                <div
                  key={i}
                  className="rounded-2xl p-6 bg-background border border-border hover:border-primary/30 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 flex-shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h3 className="min-w-0 font-semibold text-foreground">{pick(pillar.title)}</h3>
                        <span className="flex-shrink-0 inline-flex items-center px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium">
                          {pick(pillar.status)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed text-justify"><RichText>{pick(pillar.description)}</RichText></p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link href="/comunidad">
              <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10 gap-2 rounded-full">
                {pick(landing.communitySpotlight.link)}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════ FINAL CTA */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
            {pick(landing.finalCta.title)}
          </h2>
          <p className="text-lg text-white/80 mb-8">
            <RichText>{pick(landing.finalCta.subtitle)}</RichText>
          </p>
          <a
            href="https://app.tsuru.jcampos.dev/register"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 rounded-full px-10 py-6 text-base font-semibold shadow-lg"
            >
              {pick(landing.finalCta.button)}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </a>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {[transparencyTitle, fairTradeTitle, localTitle].map((label) => (
              <span
                key={label}
                className="px-4 py-1.5 rounded-full bg-white/15 text-white/90 text-sm font-medium border border-white/20"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
