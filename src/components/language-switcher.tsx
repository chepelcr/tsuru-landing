import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

export function LanguageSwitcher() {
  const { language, languageStage, setLanguage } = useLanguage();
  return <Button variant="ghost" size="icon" onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
    className="nav-control w-11 h-11 rounded-full text-xs font-semibold"
    disabled={languageStage !== 'idle'}
    aria-label={language === 'es' ? 'Idioma: Español. Cambiar a English' : 'Language: English. Switch to Español'}>
    <svg key={language} className="locale-flag" viewBox="0 0 30 20" width="28" height="20" aria-hidden="true">
      {language === 'es' ? <>
        <path fill="#002b7f" d="M0 0h30v20H0z" />
        <path fill="#fff" d="M0 3.33h30v13.34H0z" />
        <path fill="#ce1126" d="M0 6.67h30v6.66H0z" />
      </> : <>
        <path fill="#012169" d="M0 0h30v20H0z" />
        <path stroke="#fff" strokeWidth="5" d="m0 0 30 20M30 0 0 20" />
        <path stroke="#c8102e" strokeWidth="2" d="m0 0 30 20M30 0 0 20" />
        <path stroke="#fff" strokeWidth="7" d="M15 0v20M0 10h30" />
        <path stroke="#c8102e" strokeWidth="4" d="M15 0v20M0 10h30" />
      </>}
    </svg>
  </Button>;
}
