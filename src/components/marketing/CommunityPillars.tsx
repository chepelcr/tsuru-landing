import { ReceiptText, Store, Users, Sprout } from 'lucide-react';
import { FeatureArt } from './FeatureArt';
import { ScrollBlock } from './MotionSurface';
import { getContent } from '@/repositories/content.repository';
import { useLanguage } from '@/contexts/LanguageContext';
import { RichText } from '@/lib/rich-text';

const landing = getContent<typeof import('@/content/landing.json')>('landing');
const ICONS: Record<string, React.ElementType> = { ReceiptText, Store, Users };

export function CommunityPillars() {
  const { language } = useLanguage();
  const pick = (copy: { es: string; en: string }) => copy[language] ?? copy.es;
  return (
    <section className="py-16 lg:py-20 bg-card border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-5">
            <Users size={14} aria-hidden="true" />{pick(landing.communitySpotlight.badge)}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">{pick(landing.communitySpotlight.title)}</h2>
          <p className="text-lg text-muted-foreground leading-relaxed"><RichText>{pick(landing.communitySpotlight.subtitle)}</RichText></p>
        </div>
        <ScrollBlock className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {landing.communitySpotlight.pillars.map(pillar => {
            const Icon = ICONS[pillar.iconName] ?? Sprout;
            return (
              <div key={pillar.iconName} className="pillar-card rounded-2xl p-6 bg-background border border-border hover:border-primary/30 transition-colors">
                <span className="pillar-status">{pick(pillar.status)}</span>
                <div className="pillar-heading"><Icon size={23} aria-hidden="true" /><h3>{pick(pillar.title)}</h3></div>
                <p className="text-sm text-muted-foreground leading-relaxed"><RichText>{pick(pillar.description)}</RichText></p>
                <FeatureArt id={pillar.iconName} />
              </div>
            );
          })}
        </ScrollBlock>
      </div>
    </section>
  );
}
