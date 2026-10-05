import { useRef, useState, type ReactNode } from 'react';
import { LazyMotion, domAnimation, MotionConfig, m, useReducedMotion, useScroll, useTransform } from 'motion/react';

export function MarketingMotion({ children }: { children: ReactNode }) {
  return <LazyMotion features={domAnimation} strict><MotionConfig reducedMotion="user">{children}</MotionConfig></LazyMotion>;
}

// Fade only in the small bands at the viewport edges; focused content stays readable.
export function ScrollBlock({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [focused, setFocused] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const opacity = useTransform(scrollYProgress, progress => {
    if (!ref.current) return 1;
    const height = ref.current.offsetHeight;
    const viewport = window.innerHeight;
    const top = viewport - progress * (viewport + height);
    return Math.max(0, Math.min(1, (viewport - top) / 72, (top + height - 72) / Math.min(96, height * .5)));
  });
  return <m.div ref={ref} className={className} style={{ opacity: reduced || focused ? 1 : opacity }}
    onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
    {children}
  </m.div>;
}
