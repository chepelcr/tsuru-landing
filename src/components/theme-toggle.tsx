import { useLanguage } from '@/contexts/LanguageContext';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { language } = useLanguage();
  const { setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="nav-control w-11 h-11 rounded-full relative"
      aria-label={language === "es" ? (resolvedTheme === "dark" ? "Activar tema claro" : "Activar tema oscuro") : (resolvedTheme === "dark" ? "Use light theme" : "Use dark theme")}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />

    </Button>
  );
}
