import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { applyFavicon } from '@/lib/brand-theme';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || 'system';
    }
    return 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;
    let applyTimer: number;
    let transitionTimer: number;

    const applyTheme = (newTheme: Theme) => {
      window.clearTimeout(applyTimer);
      window.clearTimeout(transitionTimer);
      let resolved: 'light' | 'dark';

      if (newTheme === 'system') {
        resolved = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
      } else {
        resolved = newTheme;
      }

      // Add transitioning class for smooth fade effect
      body.classList.add("theme-transitioning");

      // Change theme smoothly with slight delay
      applyTimer = window.setTimeout(() => {
        root.classList.remove('light', 'dark');
        root.classList.add(resolved);
        setResolvedTheme(resolved);
        applyFavicon(resolved);
      }, 200);

      // Remove transitioning class after smooth transition
      transitionTimer = window.setTimeout(() => {
        body.classList.remove("theme-transitioning");
      }, 800);
    };

    applyTheme(theme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.clearTimeout(applyTimer);
      window.clearTimeout(transitionTimer);
      body.classList.remove('theme-transitioning');
    };
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem('theme', newTheme);
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
