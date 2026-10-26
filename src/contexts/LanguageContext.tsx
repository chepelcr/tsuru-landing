import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { Router as LocationRouter } from 'wouter';
import { useReducedMotion } from 'motion/react';
import { getContent } from '@/repositories/content.repository';
import { transitionLanguage, type LanguageStage } from '@/lib/language-transition';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  languageStage: LanguageStage;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const siteBase = import.meta.env.BASE_URL.replace(/\/$/, '');
// /es/... is the legacy Spanish prefix; keep routing it until the first switch.
const spanishBase = /^\/es(?:\/|$)/.test(window.location.pathname.slice(siteBase.length)) ? '/es' : '';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const translations = {
    en: getContent<Record<string, string>>('translations-en'),
    es: getContent<Record<string, string>>('translations-es'),
  };
  // Stable URLs determine the public language, independent of browser/storage.
  const [language, setLanguageState] = useState<Language>(() =>
    /^\/en(?:\/|$)/.test(window.location.pathname.slice(siteBase.length)) ? 'en' : 'es');
  const [languageStage, setLanguageStage] = useState<LanguageStage>('idle');
  const reduced = useReducedMotion() ?? false;
  const cancelTransition = useRef<() => void>();
  useEffect(() => () => cancelTransition.current?.(), []);

  const handleSetLanguage = (lang: Language) => {
    if (lang === language || languageStage !== 'idle') return;
    cancelTransition.current = transitionLanguage(() => {
      // Swap in place like the POS: rewrite the URL to the language's stable
      // form, then re-render. The unpatched replaceState keeps wouter (and
      // PageTransition) from treating the swap as a page change.
      const rest = window.location.pathname.slice(siteBase.length).replace(/^\/(en|es)(?=\/|$)/, '') || '/';
      const target = lang === 'en' ? '/en' + (rest === '/' ? '' : rest) : rest;
      History.prototype.replaceState.call(window.history, window.history.state, '', siteBase + target + window.location.search + window.location.hash);
      setLanguageState(lang);
    }, setLanguageStage, reduced);
  };

  const t = (key: string): string => {
    return (translations[language] as Record<string, string>)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, languageStage, setLanguage: handleSetLanguage, t }}>
      {/* Routes are language-neutral; the /en prefix is the router base. */}
      <LocationRouter base={siteBase + (language === 'en' ? '/en' : spanishBase)}>{children}</LocationRouter>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
