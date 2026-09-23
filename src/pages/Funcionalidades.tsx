import { useLanguage } from "@/contexts/LanguageContext";
import { RichText } from "@/lib/rich-text";
import { Button } from "@/components/ui/button";
import features from "@/content/features.json";
import {
  Palette,
  FileCheck,
  WifiOff,
  QrCode,
  ClipboardList,
  Globe,
  ArrowRight,
  ArrowLeftRight,
  Hammer,
  UtensilsCrossed,
  Users,
} from "lucide-react";

function FeatureCard({ icon: Icon, title, description, color = 'green', status }: {
  icon: React.ElementType;
  title: string;
  description: string;
  color?: 'green' | 'earth';
  status?: string;
}) {
  const isEarth = color === 'earth';
  return (
    <div className={`group flex h-full gap-4 rounded-2xl p-6 border transition-all hover:-translate-y-1 hover:shadow-md ${
      isEarth ? 'bg-accent/5 border-accent/20 hover:border-accent/40' : 'bg-card border-border hover:border-primary/30'
    }`}>
      <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
        isEarth ? 'bg-accent/10' : 'bg-primary/10'
      }`}>
        <Icon className={`h-6 w-6 ${isEarth ? 'text-accent' : 'text-primary'}`} />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <h3 className="font-semibold text-foreground text-lg">{title}</h3>
          {status && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium">
              {status}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed text-justify"><RichText>{description}</RichText></p>
      </div>
    </div>
  );
}

function UseCaseCard({ icon: Icon, title, description }: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 p-5 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all">
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <h3 className="font-semibold text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed text-justify"><RichText>{description}</RichText></p>
      </div>
    </div>
  );
}

const FEATURE_ICONS: Record<string, React.ElementType> = {
  ClipboardList,
  FileCheck,
  WifiOff,
  Palette,
  QrCode,
  Globe,
  Users,
  ArrowLeftRight,
};
const USE_CASE_ICONS = [Hammer, UtensilsCrossed, Users];

export default function Funcionalidades() {
  const { language: lang } = useLanguage();
  const pick = (f: { es: string; en: string }) => f[lang] ?? f.es;

  // A 3-wide grid leaves the 7th card orphaned on its own row. When the card
  // count leaves a remainder of 1, the last four cards drop to 2-per-row, so
  // 7 lays out as 3 / 2 / 2. Derived from the count because the cards are
  // admin-editable and the total can change.
  const cardCount = features.featureCards.length;
  const pairFrom =
    cardCount >= 4 && cardCount % 3 === 1 ? cardCount - 4 : cardCount;

  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/8 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            {pick(features.page.badge)}
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
            {pick(features.page.title)}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            <RichText>{pick(features.page.subtitle)}</RichText>
          </p>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-16 bg-muted/20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
            {features.featureCards.map((card, i) => {
              const status = (card as { status?: { es: string; en: string } }).status;
              return (
                <div
                  key={i}
                  className={i < pairFrom ? 'lg:col-span-2' : 'lg:col-span-3'}
                >
                  <FeatureCard
                    icon={FEATURE_ICONS[card.iconName] ?? ClipboardList}
                    title={pick(card.title)}
                    description={pick(card.description)}
                    color={card.color as 'green' | 'earth'}
                    status={status ? pick(status) : undefined}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-3">
              {pick(features.useCasesSection.title)}
            </h2>
            <p className="text-muted-foreground"><RichText>{pick(features.useCasesSection.subtitle)}</RichText></p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {features.useCases.map((uc, i) => (
              <UseCaseCard key={i} icon={USE_CASE_ICONS[i]} title={pick(uc.title)} description={pick(uc.description)} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-primary to-primary/80">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold text-white mb-4">{pick(features.cta.title)}</h2>
          <p className="text-white/80 mb-8"><RichText>{pick(features.cta.subtitle)}</RichText></p>
          <a href="https://app.tsuru.jcampos.dev/register" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-10 py-6 text-base font-semibold">
              {pick(features.cta.button)}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </div>
      </section>

    </div>
  );
}
