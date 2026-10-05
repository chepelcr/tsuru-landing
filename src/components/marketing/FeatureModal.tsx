import { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { RichText } from '@/lib/rich-text';
import { FeatureDetails } from './FeatureDetails';
import { FeatureArt } from './FeatureArt';

type Feature = (typeof import('@/content/features.json'))['featureCards'][number];

const DETAILS: Record<string, 'orders' | 'billing' | 'store'> = {
  ClipboardList: 'orders', FileCheck: 'billing', Palette: 'store', QrCode: 'store', Globe: 'store',
};
const ART: Record<string, string> = { WifiOff: 'orders', Users: 'Users', ArrowLeftRight: 'Users' };

export function FeatureModal({ card, onClose }: { card: Feature; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const { language } = useLanguage();
  const pick = (field: { es: string; en: string }) => field[language] ?? field.es;
  const detail = DETAILS[card.iconName];
  const status = (card as { status?: { es: string; en: string } }).status;

  useEffect(() => {
    const dialog = dialogRef.current;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      trigger?.focus({ preventScroll: true });
    };
  }, []);

  return (
    <dialog ref={dialogRef} className="feature-modal" aria-labelledby={titleId}
      onCancel={event => { event.preventDefault(); onClose(); }}
      onClick={event => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
      }}>
      <header className="feature-modal-header">
        <h2 id={titleId} className="font-serif text-xl sm:text-2xl font-semibold text-foreground">{pick(card.title)}</h2>
        <button autoFocus type="button" onClick={onClose} className="feature-modal-close"
          aria-label={language === 'es' ? 'Cerrar detalles' : 'Close details'}>
          <X size={20} aria-hidden="true" />
        </button>
      </header>
      <div className="feature-modal-body">
        {detail ? <FeatureDetails detail={detail} /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-6 sm:p-10">
            <div>
              {status && <span className="inline-flex mb-5 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-sm text-accent">{pick(status)}</span>}
              <p className="text-lg text-muted-foreground leading-relaxed"><RichText>{pick(card.description)}</RichText></p>
            </div>
            <div className="rounded-3xl border border-primary/20 bg-primary/5 p-8 text-primary">
              <FeatureArt id={ART[card.iconName] ?? card.iconName} />
            </div>
          </div>
        )}
      </div>
    </dialog>
  );
}
