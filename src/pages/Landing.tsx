import { MarketingMotion } from '@/components/marketing/MotionSurface';
import { HeroArt } from '@/components/marketing/HeroArt';
import { SetupCard } from '@/components/marketing/SetupCard';
import { getContent } from "@/repositories/content.repository";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { RichText } from "@/lib/rich-text";
import { Button } from "@/components/ui/button";
const landing = getContent<typeof import("@/content/landing.json")>("landing");
import {
  Leaf,
  Eye,
  ArrowRight,
  Sprout,
  Users,
  Check,
} from "lucide-react";

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

      {/* Compact invitation; community navigation activates only on its page. */}
      <section id="community-preview" className="community-preview bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex-1">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-accent mb-3"><Users size={16} aria-hidden="true" />{pick(landing.communitySpotlight.badge)}</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">{pick(landing.communitySpotlight.title)}</h2>
            <p className="text-muted-foreground leading-relaxed max-w-2xl"><RichText>{pick(landing.communitySpotlight.subtitle)}</RichText></p>
          </div>
          <Link href="/comunidad" className="marketing-button secondary self-start sm:self-center shrink-0">
            {pick(landing.communitySpotlight.link)}<ArrowRight size={18} aria-hidden="true" />
          </Link>
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
