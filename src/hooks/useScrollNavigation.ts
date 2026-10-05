import { useEffect, useState } from 'react';
import { activeNavigation } from '@/lib/scroll-navigation';

export function useScrollNavigation(route: string, paused: boolean, language: string) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (route !== '/') { setActive(null); return; }
    if (paused) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const headerBottom = document.querySelector('[data-navbar-bar]')?.getBoundingClientRect().bottom ?? 64;
      const line = Math.min(headerBottom + 96, window.innerHeight * .4);
      const sections = [...document.querySelectorAll<HTMLElement>('main [data-nav-href]')].map(element => {
        const bounds = element.getBoundingClientRect();
        return { href: element.dataset.navHref!, top: bounds.top, bottom: bounds.bottom };
      });
      setActive(activeNavigation(sections, line));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    // Also catches lazy-loaded sections and translated text changing their size.
    const observer = new ResizeObserver(schedule);
    const main = document.querySelector('main');
    if (main) observer.observe(main);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [route, paused, language]);
  return route === '/' ? active : null;
}
