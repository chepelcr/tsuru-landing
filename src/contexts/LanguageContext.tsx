import { createContext, useContext, useState, ReactNode } from 'react';
import { getContent } from '@/repositories/content.repository';
import { type LanguageStage } from '@/lib/language-transition';

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
  const [language] = useState<Language>(() => {
    // Stable URLs determine the public language, independent of browser/storage.
    const siteBase = import.meta.env.BASE_URL.replace(/\/$/, '');
    return /^\/en(?:\/|$)/.test(window.location.pathname.slice(siteBase.length)) ? 'en' : 'es';
  });

  const languageStage: LanguageStage = 'idle';

  const handleSetLanguage = (lang: Language) => {
    if (lang === language) return;
    const siteBase = import.meta.env.BASE_URL.replace(/\/$/, '');
    const rest = window.location.pathname.slice(siteBase.length).replace(/^\/(en|es)(?=\/|$)/, '') || '/';
    const target = lang === 'en' ? '/en' + (rest === '/' ? '' : rest) : rest;
    window.location.assign(siteBase + target + window.location.search + window.location.hash);
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
