import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
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

export function LanguageProvider({ children }: { children: ReactNode }) {
  const translations = {
    en: getContent<Record<string, string>>('translations-en'),
    es: getContent<Record<string, string>>('translations-es'),
  };
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language;
    if (saved) return saved;
    const browserLang = navigator.language.toLowerCase();
    return browserLang.startsWith('es') ? 'es' : 'en';
  });

  const [languageStage, setLanguageStage] = useState<LanguageStage>('idle');
  const cancelTransition = useRef<(() => void) | undefined>();
  useEffect(() => () => cancelTransition.current?.(), []);

  const handleSetLanguage = (lang: Language) => {
    cancelTransition.current?.();
    if (lang === language) { setLanguageStage('idle'); return; }
    cancelTransition.current = transitionLanguage(() => {
      setLanguage(lang);
      localStorage.setItem('language', lang);
    }, setLanguageStage, window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  };

  const t = (key: string): string => {
    return (translations[language] as Record<string, string>)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, languageStage, setLanguage: handleSetLanguage, t }}>
      {children}
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
