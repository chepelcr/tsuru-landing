export type LanguageStage = 'idle' | 'exit' | 'enter';

export function transitionLanguage(commit: () => void, setStage: (stage: LanguageStage) => void, reduced: boolean) {
  if (reduced) { commit(); setStage('idle'); return () => {}; }
  let enterTimer: ReturnType<typeof setTimeout> | undefined;
  setStage('exit');
  const exitTimer = setTimeout(() => {
    commit();
    setStage('enter');
    enterTimer = setTimeout(() => setStage('idle'), 220);
  }, 160);
  return () => { clearTimeout(exitTimer); clearTimeout(enterTimer); };
}
