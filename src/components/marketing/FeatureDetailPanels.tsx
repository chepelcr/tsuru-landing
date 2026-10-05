import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getContent } from '@/repositories/content.repository';
import { useLanguage } from '@/contexts/LanguageContext';
import { RichText } from '@/lib/rich-text';
import { FeatureArt } from './FeatureArt';

const landing = getContent<typeof import('@/content/landing.json')>('landing');
const billing = getContent<typeof import('@/content/billing.json')>('billing');
type Copy = { es: string; en: string };
type Panel = { title: Copy; body: Copy; badge?: Copy; art: string };

export function FeatureDetailPanels({ detail }: { detail: 'orders' | 'store' | 'billing' }) {
  const [index, setIndex] = useState(0);
  const { language } = useLanguage();
  const pick = (copy: Copy) => copy[language] ?? copy.es;
  const panels: Panel[] = detail === 'orders' ? [
    { title: landing.orders.title, body: landing.orders.body, badge: landing.orders.badge, art: 'orders' },
    ...[landing.orders.exampleMessage, landing.orders.exampleOrder, landing.orders.exampleFollowUp, landing.orders.exampleInvoice]
      .map((body, i) => ({ title: landing.orders.exampleSteps[i === 3 ? 4 : i], body, badge: landing.orders.exampleLabel, art: 'orders' })),
  ] : detail === 'store' ? [
    { title: landing.storefront.title, body: landing.storefront.body, badge: landing.storefront.badge, art: 'Store' },
    { title: landing.storefront.currentTitle, body: landing.storefront.currentBody, art: 'Store' },
    { title: landing.storefront.futureTitle, body: landing.storefront.futureBody, badge: landing.storefront.futureStatus, art: 'Store' },
  ] : [
    { title: billing.title, body: billing.subtitle, badge: billing.badge, art: 'ReceiptText' },
    { title: billing.badge, body: billing.note, art: 'ReceiptText' },
    ...billing.points.map(body => ({ title: billing.badge, body, art: 'ReceiptText' })),
  ];
  const panel = panels[index];
  return (
    <div className="feature-detail-panels">
      <div className="feature-detail-panel" key={index} aria-live="polite" aria-atomic="true">
        <div className="feature-panel-art text-primary"><FeatureArt id={panel.art} /></div>
        <div>
          {panel.badge && <p className="text-xs font-medium text-primary mb-2">{pick(panel.badge)}</p>}
          <h3 className="font-serif text-xl font-semibold text-foreground mb-3">{pick(panel.title)}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed"><RichText>{pick(panel.body)}</RichText></p>
        </div>
      </div>
      <nav className="feature-panel-controls" aria-label={language === 'es' ? 'Detalles de la funcionalidad' : 'Feature details'}>
        <button type="button" disabled={index === 0} onClick={() => setIndex(i => i - 1)} aria-label={language === 'es' ? 'Anterior' : 'Previous'}><ArrowLeft size={18} aria-hidden="true" /></button>
        <span className="text-sm text-muted-foreground" aria-live="polite">{index + 1} / {panels.length}</span>
        <button type="button" disabled={index === panels.length - 1} onClick={() => setIndex(i => i + 1)} aria-label={language === 'es' ? 'Siguiente' : 'Next'}><ArrowRight size={18} aria-hidden="true" /></button>
      </nav>
    </div>
  );
}
