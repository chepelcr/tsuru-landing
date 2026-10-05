import { useRef, useState, type ElementType } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, ArrowRight, UserPlus, Package, ClipboardList } from 'lucide-react';
import { AnimatePresence, m, useInView, useReducedMotion } from 'motion/react';
import { RichText } from '@/lib/rich-text';

type BiText = { es: string; en: string };
type Step = { id?: string; title: BiText; description: BiText };
const icons: ElementType[] = [UserPlus, Package, ClipboardList];

export function SetupCard({ steps, language, label, action }: { steps: Step[]; language: 'es' | 'en'; label: string; action: string }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const visible = useInView(ref, {amount:.3});
  const active = visible && !reduced;
  const current = Math.min(index, Math.max(0, steps.length - 1));
  const step = steps[current];
  const Icon = icons[current] ?? ClipboardList;
  const pick = (text: BiText) => text[language] ?? text.es;
  const go = (delta: number) => { setDirection(delta); setIndex(value => Math.max(0, Math.min(steps.length-1, value+delta))); };
  if (!step) return null;
  return <div ref={ref} className="setup-card" id="setup-card">
    <div className="setup-card-header"><span>{label}</span><span className="tabular-nums">{String(current+1).padStart(2,'0')} / {String(steps.length).padStart(2,'0')}</span></div>
    <div className="setup-stage">
      <button type="button" className="setup-arrow" disabled={current===0} onClick={()=>go(-1)} aria-label={language==='es'?'Paso anterior':'Previous step'} aria-controls="setup-content"><ArrowLeft size={20} aria-hidden="true"/></button>
      <div className="setup-symbol">
        <svg viewBox="0 0 180 180" aria-hidden="true" className="setup-rings" fill="none" stroke="currentColor">
          <m.circle cx="90" cy="90" r="58" animate={{r:active?[58,63,58]:58}} transition={{duration:4,repeat:active?Infinity:0,ease:'easeInOut'}} opacity=".18"/>
          <m.circle cx="90" cy="90" r="78" animate={{r:active?[78,83,78]:78}} transition={{duration:4,repeat:active?Infinity:0,ease:'easeInOut',delay:.3}} opacity=".1"/>
        </svg>
        <Icon className="setup-icon" aria-hidden="true" strokeWidth={1.4}/>
      </div>
      <button type="button" className="setup-arrow" disabled={current===steps.length-1} onClick={()=>go(1)} aria-label={language==='es'?'Paso siguiente':'Next step'} aria-controls="setup-content"><ArrowRight size={20} aria-hidden="true"/></button>
    </div>
    <div className="setup-instruction" id="setup-content" aria-live="polite" aria-atomic="true">
      <AnimatePresence initial={false} mode="wait" custom={direction}>
        <m.div key={step.id ?? step.title.es} custom={direction}
          variants={{enter:(d:number)=>({opacity:0,x:reduced?0:d*12}),exit:(d:number)=>({opacity:0,x:reduced?0:-d*12})}}
          initial="enter" animate={{opacity:1,x:0}} exit="exit" transition={{duration:reduced?0:.18}}>
          <h3>{pick(step.title)}</h3><p><RichText>{pick(step.description)}</RichText></p>
        </m.div>
      </AnimatePresence>
      <Link href="/funcionalidades" className="marketing-link">{action}<ArrowRight size={16} aria-hidden="true"/></Link>
    </div>
    <div className="setup-progress" aria-hidden="true">{steps.map((s,i)=><span key={s.id??s.title.es} className={i===current?'active':''}/>)}</div>
  </div>;
}
