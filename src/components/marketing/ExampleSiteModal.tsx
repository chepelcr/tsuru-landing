import { useEffect, useId, useRef, useState } from 'react';
import { Loader2, RotateCw, Store, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function ExampleSiteModal({ title, url, onClose }: { title: string; url: string; onClose: () => void }) {
  const { language } = useLanguage();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);
  const es = language === 'es';

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

  return <dialog ref={dialogRef} aria-labelledby={titleId}
    className="m-auto w-[calc(100vw-1rem)] sm:w-[calc(100vw-2rem)] max-w-[1440px] h-[92dvh] max-h-[92dvh] p-0 rounded-2xl border border-border bg-card text-foreground shadow-xl backdrop:bg-foreground/50"
    onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => {
      if (event.target !== event.currentTarget) return;
      const rect = event.currentTarget.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
    }}>
    <div className="h-full min-h-0 flex flex-col">
      <header className="flex items-center gap-3 p-3 sm:px-5 border-b border-border shrink-0">
        <span className="rounded-xl bg-primary/10 p-2 text-primary shrink-0"><Store size={22} aria-hidden="true" /></span>
        <h2 id={titleId} className="font-serif text-lg sm:text-xl font-semibold min-w-0 flex-1 truncate">{title}</h2>
        <button type="button" className="p-3 rounded-lg hover:bg-muted shrink-0" aria-label={es ? 'Recargar sitio' : 'Reload site'}
          onClick={() => { setLoading(true); setReload(value => value + 1); }}><RotateCw size={18} aria-hidden="true" /></button>
        <button autoFocus type="button" className="p-3 rounded-lg hover:bg-muted shrink-0" aria-label={es ? 'Cerrar vista previa' : 'Close preview'}
          onClick={onClose}><X size={20} aria-hidden="true" /></button>
      </header>
      <div className="relative flex-1 min-h-0 bg-background">
        {loading && <div className="absolute inset-0 flex items-center justify-center gap-2 text-muted-foreground pointer-events-none" role="status">
          <Loader2 className="animate-spin" size={20} aria-hidden="true" />{es ? 'Cargando sitio…' : 'Loading site…'}
        </div>}
        <iframe key={reload} src={url} title={title} className="relative w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms" referrerPolicy="strict-origin-when-cross-origin" onLoad={() => setLoading(false)} />
      </div>
    </div>
  </dialog>;
}
