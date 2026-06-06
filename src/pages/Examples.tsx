import { Button } from "@/components/ui/button";
import { CTASecuritySection } from "@/components/sections/cta-security-section";
import { useLanguage } from "@/contexts/LanguageContext";
import { listExampleStores, type ExampleStore } from "@/services/examples.service";
import { resolveIcon } from "@/lib/icons";
import { ExternalLink, Palette } from "lucide-react";

// ─── ExampleCard ─────────────────────────────────────────────────────────────

function ExampleCard({ store }: { store: ExampleStore }) {
  const { t, language } = useLanguage();
  const Icon = resolveIcon(store.iconName);
  const category = store.category[language] ?? store.category.es;
  const title = store.title[language] ?? store.title.es;
  const description = store.description[language] ?? store.description.es;

  return (
    <div className={`relative group rounded-2xl bg-card border transition-all hover:-translate-y-1 hover:shadow-lg flex flex-col overflow-hidden ${
      store.featured ? 'border-primary/40 shadow-sm shadow-primary/10' : 'border-border hover:border-primary/30'
    }`}>
      {store.featured && (
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
            {t('examples.featured')}
          </span>
        </div>
      )}

      {/* Icon area */}
      <div className="p-6 pb-0">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Icon className="h-6 w-6" />
          </div>
          <span className="text-xs font-medium text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-full capitalize border border-border">
            {category}
          </span>
        </div>
        <h3 className="font-serif text-lg font-bold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{description}</p>
      </div>

      {/* Action */}
      <div className="p-6 pt-4 mt-auto">
        <Button
          onClick={() => window.open(store.storeUrl, '_blank', 'noopener,noreferrer')}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl gap-2"
        >
          {t('examples.viewStore')}
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Examples() {
  const { t } = useLanguage();
  const exampleStores = listExampleStores();

  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="relative overflow-hidden py-16 lg:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/8 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Palette className="h-3.5 w-3.5" />
            {t('examples.badge')}
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-5">
            {t('examples.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('examples.subtitle')}
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exampleStores.map((store) => (
              <ExampleCard key={store.id} store={store} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASecuritySection
        titleKey="examples.cta.title"
        subtitleKey="examples.cta.subtitle"
        buttonTextKey="examples.cta.button"
        onClick={() => window.open('https://admin.j-markets.jcampos.dev/register', '_blank', 'noopener,noreferrer')}
        buttonIcon={null}
        variant="light"
      />

    </div>
  );
}
