import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  return <Button variant="ghost" size="icon" onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
    className="nav-control w-11 h-11 rounded-full text-xs font-semibold"
    aria-label={language === 'es' ? 'Idioma: Español. Cambiar a English' : 'Language: English. Switch to Español'}>
    {language.toUpperCase()}
  </Button>;
}
