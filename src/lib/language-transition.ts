export type LanguageStage = 'idle' | 'exit' | 'enter';

const STEP_MS = 300;

/**
 * The POS language switch (tsuru-pos-system useLanguageSwitch): the page slides
 * out, the language is committed in place, and it slides back in at the same
 * scroll position. Returns a cancel function.
 */
export function transitionLanguage(commit: () => void, setStage: (stage: LanguageStage) => void, reduced: boolean) {
  if (reduced) { commit(); setStage('idle'); return () => {}; }
  const body = document.body;
  const savedScrollY = window.scrollY;
  const release = () => {
    body.classList.remove('language-transitioning', 'language-slide-in');
    body.style.overflow = '';
    body.style.position = '';
    body.style.top = '';
    body.style.width = '';
    window.scrollTo({ top: savedScrollY, behavior: 'instant' });
  };
  // Freeze the page where it is so the swap cannot jump the scroll position.
  body.style.overflow = 'hidden';
  body.style.position = 'fixed';
  body.style.top = `-${savedScrollY}px`;
  body.style.width = '100%';
  body.classList.add('language-transitioning');
  setStage('exit');
  let enterTimer: ReturnType<typeof setTimeout> | undefined;
  const exitTimer = setTimeout(() => {
    commit();
    body.classList.remove('language-transitioning');
    body.classList.add('language-slide-in');
    setStage('enter');
    enterTimer = setTimeout(() => { release(); setStage('idle'); }, STEP_MS);
  }, STEP_MS);
  return () => { clearTimeout(exitTimer); clearTimeout(enterTimer); release(); };
}
