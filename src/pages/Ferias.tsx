import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import fairs from "@/content/fairs.json";
import {
  Monitor,
  MapPin,
  ArrowLeftRight,
  ArrowRight,
  Calendar,
} from "lucide-react";

function FairTypeCard({ icon: Icon, title, status, description, accent }: {
  icon: React.ElementType;
  title: string;
  status?: string;
  description: string;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-2xl p-7 border transition-all hover:-translate-y-1 hover:shadow-md ${
      accent ? 'bg-accent/5 border-accent/20 hover:border-accent/40' : 'bg-card border-border hover:border-primary/30'
    }`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
        accent ? 'bg-accent/10' : 'bg-primary/10'
      }`}>
        <Icon className={`h-6 w-6 ${accent ? 'text-accent' : 'text-primary'}`} />
      </div>
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <h3 className="font-serif text-xl font-bold text-foreground">{title}</h3>
        {status && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium">
            {status}
          </span>
        )}
      </div>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

const TYPE_ICONS = [Monitor, MapPin, ArrowLeftRight];

export default function Ferias() {
  const { language: lang } = useLanguage();
  const pick = (f: { es: string; en: string }) => f[lang] ?? f.es;

  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-background to-primary/5 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Calendar className="h-3.5 w-3.5" />
            {pick(fairs.badge)}
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
            {pick(fairs.title)}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {pick(fairs.subtitle)}
          </p>
        </div>
      </section>

      {/* Qué son las ferias */}
      <section className="py-16 bg-card border-y border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-shrink-0 w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
              <Calendar className="h-9 w-9 text-primary" />
            </div>
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">
                {pick(fairs.what.title)}
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {pick(fairs.what.description)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tipos de ferias */}
      <section className="py-20 lg:py-24 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-3">
              {pick(fairs.typesTitle)}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {fairs.types.map((type, i) => (
              <FairTypeCard
                key={i}
                icon={TYPE_ICONS[i]}
                title={pick(type.title)}
                status={type.status ? pick(type.status) : undefined}
                description={pick(type.description)}
                accent={i === 2}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Nota honesta */}
      <section className="py-20 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl p-8 bg-primary/5 border border-primary/20 text-center">
            <p className="text-lg text-foreground leading-relaxed">
              {pick(fairs.note)}
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-primary to-primary/80">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold text-white mb-4">{pick(fairs.cta.title)}</h2>
          <p className="text-white/80 mb-8">{pick(fairs.cta.subtitle)}</p>
          <a href="https://pos.j-markets.jcampos.dev/register" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-10 py-6 text-base font-semibold">
              {pick(fairs.cta.button)}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </div>
      </section>

    </div>
  );
}
