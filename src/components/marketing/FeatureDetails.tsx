import { FeatureArt } from '@/components/marketing/FeatureArt';
import { getContent } from '@/repositories/content.repository';
import { useLanguage } from '@/contexts/LanguageContext';
import { RichText } from '@/lib/rich-text';
import { MessageCircle, ClipboardList, Truck, FileCheck2, Store, Share2, ReceiptText, Check } from 'lucide-react';

const landing = getContent<typeof import('@/content/landing.json')>('landing');
const billing = getContent<typeof import('@/content/billing.json')>('billing');
const ORDER_ICONS = [MessageCircle, ClipboardList, Truck, FileCheck2];

export function FeatureDetails({ detail }: { detail: 'orders' | 'store' | 'billing' }) {
  const { language: lang } = useLanguage();
  const pick = (field: { es: string; en: string }) => field[lang] ?? field.es;

  return (
    <div className="premium-landing">
      {/* ══════════════════════════════════════ PEDIDOS */}
      {detail === 'orders' && <section id="pedidos" className="py-20 lg:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
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
          </div>
        </div>
      </section>}

      {/* ══════════════════════════════════════ TIENDA EN LÍNEA */}
      {detail === 'store' && <section id="tienda" className="py-20 lg:py-28 bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
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
          </div>
        </div>
      </section>}

      {/* ══════════════════════════════════════ FACTURACIÓN ELECTRÓNICA */}
      {detail === 'billing' && <section id="facturacion" className="py-20 lg:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

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

          </div>
        </div>
      </section>}

    </div>
  );
}
