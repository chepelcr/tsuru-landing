import { MarketingMotion } from '@/components/marketing/MotionSurface';
import { HeroArt } from '@/components/marketing/HeroArt';
import { FeatureArt } from '@/components/marketing/FeatureArt';
import { SetupCard } from '@/components/marketing/SetupCard';
import { getContent } from "@/repositories/content.repository";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { RichText } from "@/lib/rich-text";
import { Button } from "@/components/ui/button";
const landing = getContent<typeof import("@/content/landing.json")>("landing");
import {
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
