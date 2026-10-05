import { MarketingMotion, ScrollBlock } from '@/components/marketing/MotionSurface';
import { HeroArt } from '@/components/marketing/HeroArt';
import { FeatureArt } from '@/components/marketing/FeatureArt';
import { SetupCard } from '@/components/marketing/SetupCard';
import { getContent } from "@/repositories/content.repository";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { RichText } from "@/lib/rich-text";
import { Button } from "@/components/ui/button";
const landing = getContent<typeof import("@/content/landing.json")>("landing");
const billing = getContent<typeof import("@/content/billing.json")>("billing");
const plans = getContent<typeof import("@/content/plans.json")>("plans");
import { formatCRC } from "@/lib/currency";
import {
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
        <p className="text-sm text-muted-foreground leading-relaxed text-left"><RichText>{description}</RichText></p>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────


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
    <MarketingMotion><div className="premium-landing min-h-screen bg-background">

      {/* ═══════════════════════════════════════════════════════════ HERO */}
      <section id="home" className="relative overflow-hidden">
        <div className="premium-hero max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hero-copy">
            <div className="hero-eyebrow"><Sprout size={16} aria-hidden="true" />{pick(landing.hero.badge)}</div>
            <h1>{pick(landing.hero.title)}</h1>
            <p className="hero-description"><RichText>{pick(landing.hero.subtitle)}</RichText></p>
            <div className="hero-actions">
              <a href="https://app.tsuru.jcampos.dev/register" target="_blank" rel="noopener noreferrer" className="marketing-button primary">{pick(landing.hero.cta)}<ArrowRight size={18} aria-hidden="true" /></a>
              <Link href="/ejemplos" className="marketing-button secondary">{pick(landing.hero.secondary)}<Eye size={18} aria-hidden="true" /></Link>
            </div>
            <div className="hero-principles">{[fairTradeTitle,localTitle,transparencyTitle].map(title=><span key={title}><Check size={14} aria-hidden="true"/>{title}</span>)}</div>
          </div>
          <div className="hero-visual">
            <div className="hero-visual-heading"><span>{pick(landing.storefront.currentTitle)}</span><span aria-hidden="true">↗</span></div>
            <HeroArt />
            <div className="hero-visual-caption"><span>{pick(landing.orders.exampleLabel)}</span><span className="hero-caption-mark" aria-hidden="true"><Leaf size={18}/></span></div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ CÓMO FUNCIONA */}
      <section id="como-funciona" className="premium-section setup-section bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-14">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">{pick(landing.howItWorks.title)}</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mt-2 mb-4">
              <RichText>{pick(landing.howItWorks.subtitle)}</RichText>
            </h2>
          </div>

          <SetupCard steps={landing.howItWorks.steps} language={lang} label={pick(landing.howItWorks.title)} action={pick(landing.howItWorks.learnMore)} />

        </div>
      </section>

      {/* ══════════════════════════════════════ PEDIDOS */}
      <section id="pedidos" data-nav-href="/funcionalidades" className="py-20 lg:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollBlock className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                <ClipboardList className="h-3.5 w-3.5" />
                {pick(landing.orders.badge)}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-5">
                {pick(landing.orders.title)}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed text-left">
                <RichText>{pick(landing.orders.body)}</RichText>
              </p>
            </div>

            <div className="order-example rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-5">
                {pick(landing.orders.exampleLabel)}
              </p>
              <FeatureArt id="orders" />
              <ol className="space-y-4">
                {[landing.orders.exampleMessage, landing.orders.exampleOrder, landing.orders.exampleFollowUp, landing.orders.exampleInvoice].map((item, i) => {
                  const Icon = ORDER_ICONS[i];
                  return (
                    <li key={i} className="flex gap-3 items-start">
                      <span className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <p className="text-sm text-muted-foreground leading-relaxed text-left sm:text-left pt-1.5">
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
          </ScrollBlock>
        </div>
      </section>

      {/* ══════════════════════════════════════ TIENDA EN LÍNEA */}
      <section id="tienda" data-nav-href="/funcionalidades" className="py-20 lg:py-28 bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollBlock className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
                <Store className="h-3.5 w-3.5" />
                {pick(landing.storefront.badge)}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-5">
                {pick(landing.storefront.title)}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed text-left">
                <RichText>{pick(landing.storefront.body)}</RichText>
              </p>
            </div>
            <div className="storefront-panels space-y-4">
              <FeatureArt id="Store" />
              <div className="rounded-2xl bg-card border border-primary/25 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><Share2 className="h-5 w-5" /></span>
                  <h3 className="font-semibold text-foreground">{pick(landing.storefront.currentTitle)}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed text-left"><RichText>{pick(landing.storefront.currentBody)}</RichText></p>
              </div>
              <div className="rounded-2xl bg-card/60 border border-dashed border-accent/40 p-6">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <h3 className="font-semibold text-foreground">{pick(landing.storefront.futureTitle)}</h3>
                  <span className="flex-shrink-0 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">{pick(landing.storefront.futureStatus)}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed text-left"><RichText>{pick(landing.storefront.futureBody)}</RichText></p>
              </div>
            </div>
          </ScrollBlock>
        </div>
      </section>

      {/* ══════════════════════════════════════ FACTURACIÓN ELECTRÓNICA */}
      <section id="facturacion" data-nav-href="/funcionalidades" className="py-20 lg:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollBlock className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
                <ReceiptText className="h-3.5 w-3.5" />
                {pick(billing.badge)}
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-5">
                {pick(billing.title)}
              </h2>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6 text-left">
                <RichText>{pick(billing.subtitle)}</RichText>
              </p>

              <p className="text-sm text-foreground/80 italic border-l-2 border-accent/40 pl-4 text-left">
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

          </ScrollBlock>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ PLANES (teaser) */}
      {/* Compact tier strip. Full detail — comparison table, add-ons, FAQ —
          lives on /planes; this only has to make the tiers legible and get the
          visitor there. Amounts come from the same plans.json the page uses. */}
      <section id="planes" data-nav-href="/planes" className="py-20 lg:py-28 bg-background">
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
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4 text-left">
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
      <section id="valores" data-nav-href="/comunidad" className="py-20 lg:py-28 bg-muted/30">
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
      <section id="comunidad-spotlight" data-nav-href="/comunidad" className="py-20 lg:py-28 bg-card border-y border-border">
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
            {landing.communitySpotlight.pillars.map((pillar) => {
              const Icon = PILLAR_ICONS[pillar.iconName] ?? Sprout;
              return (
                <div
                  key={pillar.iconName}
                  className="pillar-card rounded-2xl p-6 bg-background border border-border hover:border-primary/30 transition-all"
                >
                  <span className="pillar-status">{pick(pillar.status)}</span>
                  <div className="pillar-heading"><Icon size={23} aria-hidden="true"/><h3>{pick(pillar.title)}</h3></div>
                  <p className="text-sm text-muted-foreground leading-relaxed"><RichText>{pick(pillar.description)}</RichText></p>
                  <FeatureArt id={pillar.iconName} />
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
      <section className="final-action py-20 bg-gradient-to-br from-primary to-primary/80">
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

    </div></MarketingMotion>
  );
}
