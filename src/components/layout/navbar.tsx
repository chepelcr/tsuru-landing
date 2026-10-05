import { getContent } from "@/repositories/content.repository";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useScrollNavigation } from '@/hooks/useScrollNavigation';
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from 'motion/react';
const navbar = getContent<typeof import("@/content/navbar.json")>("navbar");
import { BrandLogo } from "@/components/layout/brand-logo";

interface LandingNavbarProps {
  transitionStage?: string;
  displayLocation?: string;
}

interface NavLinkProps {
  href: string;
  label: string;
  aliases?: string[];
  onClick?: () => void;
  activeLocation: string | null;
  sectionNavigation: boolean;
}

const NavLink = ({ href, label, aliases = [], onClick, activeLocation, sectionNavigation }: NavLinkProps) => {
  const active = activeLocation === href || (activeLocation !== null && aliases.includes(activeLocation));
  return (
    <Link
      href={href}
      aria-current={active ? (sectionNavigation ? "location" : "page") : undefined}
      onClick={onClick}
      className={`relative text-sm transition-colors hover:text-primary ${
        active ? 'text-primary font-medium' : 'text-muted-foreground'
      }`}
    >
      {label}
      <span
        aria-hidden="true"
        className={`absolute left-0 -bottom-1 h-0.5 w-full origin-left bg-primary rounded-full transition-transform duration-200 ${
          active ? 'scale-x-100' : 'scale-x-0'
        }`}
      />
    </Link>
  );
};


export default function LandingNavbar({ transitionStage = '', displayLocation }: LandingNavbarProps) {
  const { language: lang } = useLanguage();
  const pick = (f: { es: string; en: string }) => f[lang] ?? f.es;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [nosotrosDropdownOpen, setNosotrosDropdownOpen] = useState(false);
  const [location] = useLocation();
  const route = displayLocation ?? location;
  const activeSection = useScrollNavigation(route, mobileMenuOpen, lang);
  const reduced = useReducedMotion();
  // ReturnType<typeof setTimeout> rather than NodeJS.Timeout: this is browser
  // code and the repo has no @types/node, so the NodeJS namespace isn't declared.
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMobileMenuOpen(false);
    setNosotrosDropdownOpen(false);
  }, [location]);
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)');
    const closeOnDesktop = () => { if (desktop.matches) setMobileMenuOpen(false); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);
  useEffect(() => {
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { setMobileMenuOpen(false); setNosotrosDropdownOpen(false); } };
    window.addEventListener('keydown', escape);
    return () => { window.removeEventListener('keydown', escape); if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current); };
  }, []);

  const isActive = (href: string, aliases: string[] = []) =>
    route === '/' ? activeSection === href : route === href || aliases.includes(route);


  return (
    <header className={`marketing-navbar sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border ${transitionStage}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 xl:px-8">
        <div data-navbar-bar className="flex h-16 flex-nowrap items-center justify-between gap-2">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <BrandLogo label={pick(navbar.brand)} size={40} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex shrink-0 items-center gap-2 xl:gap-6 relative whitespace-nowrap">
            <NavLink activeLocation={route === '/' ? activeSection : route} sectionNavigation={route === '/'} href="/funcionalidades" label={pick(navbar.links.features)} />
            <NavLink activeLocation={route === '/' ? activeSection : route} sectionNavigation={route === '/'} href="/planes" label={pick(navbar.links.plans)} aliases={["/pricing"]} />
            <NavLink activeLocation={route === '/' ? activeSection : route} sectionNavigation={route === '/'} href="/ferias" label={pick(navbar.links.fairs)} />
            <NavLink activeLocation={route === '/' ? activeSection : route} sectionNavigation={route === '/'} href="/comunidad" label={pick(navbar.links.community)} />
            <NavLink activeLocation={route === '/' ? activeSection : route} sectionNavigation={route === '/'} href="/ejemplos" label={pick(navbar.links.examples)} aliases={["/examples"]} />

            {/* Nosotros Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => {
                if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
                setNosotrosDropdownOpen(true);
              }}
              onMouseLeave={() => {
                dropdownTimeoutRef.current = setTimeout(() => {
                  setNosotrosDropdownOpen(false);
                }, 150);
              }}
            >
              <button
                aria-expanded={nosotrosDropdownOpen}
                aria-controls="about-navigation"
                onKeyDown={event => { if (event.key === "Escape") setNosotrosDropdownOpen(false); }}
                onClick={() => setNosotrosDropdownOpen(!nosotrosDropdownOpen)}
                className={`text-sm flex items-center gap-1 transition-colors hover:text-primary ${
                  isActive("/quienes-somos") || isActive("/contacto") ? 'text-primary font-medium' : 'text-muted-foreground'
                }`}
              >
                {pick(navbar.links.nosotros)}
                <ChevronDown className={`h-4 w-4 transition-transform ${nosotrosDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <div id="about-navigation"
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 min-w-max bg-card rounded-lg shadow-lg border border-border py-2 transition-opacity pointer-events-none z-50 ${
                  nosotrosDropdownOpen ? 'opacity-100 pointer-events-auto visible' : 'opacity-0 invisible'
                }`}
              >
                <Link
                  href="/quienes-somos"
                  className={`block px-4 py-2 text-sm hover:text-primary hover:bg-muted/50 ${
                    isActive("/quienes-somos") ? 'text-primary font-medium' : 'text-muted-foreground'
                  }`}
                  onClick={() => setNosotrosDropdownOpen(false)}
                >
                  {pick(navbar.links.about)}
                </Link>
                <Link
                  href="/contacto"
                  className={`block px-4 py-2 text-sm hover:text-primary hover:bg-muted/50 ${
                    isActive("/contacto") ? 'text-primary font-medium' : 'text-muted-foreground'
                  }`}
                  onClick={() => setNosotrosDropdownOpen(false)}
                >
                  {pick(navbar.links.contact)}
                </Link>
              </div>
            </div>

            <a href="https://blogs.tsuru.jcampos.dev/" className="text-sm text-muted-foreground hover:text-primary transition-colors">{pick(navbar.links.blog)}</a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex shrink-0 items-center gap-1 xl:gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <a href="https://app.tsuru.jcampos.dev" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary px-2 xl:px-3 text-sm">
                {pick(navbar.login)}
              </Button>
            </a>
            <a href="https://app.tsuru.jcampos.dev/register" target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-3 xl:px-5 text-sm">
                {pick(navbar.register)}
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              className="nav-control inline-flex items-center justify-center text-foreground"
              aria-label={lang === "es" ? "Menú de navegación" : "Navigation menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <LazyMotion features={domAnimation} strict><AnimatePresence initial={false}>{mobileMenuOpen && (
          <m.div id="mobile-navigation" className="lg:hidden py-4 border-t border-border max-h-[calc(100dvh-4rem)] overflow-y-auto"
            initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : -6 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : -4 }} transition={{ duration: reduced ? 0 : .16 }}>
            <nav className="flex flex-col gap-4">
              <NavLink activeLocation={route === '/' ? activeSection : route} sectionNavigation={route === '/'}
                href="/funcionalidades"
                label={pick(navbar.links.features)}
                onClick={() => setMobileMenuOpen(false)}
              />
              <NavLink activeLocation={route === '/' ? activeSection : route} sectionNavigation={route === '/'}
                href="/planes"
                label={pick(navbar.links.plans)}
                aliases={["/pricing"]}
                onClick={() => setMobileMenuOpen(false)}
              />
              <NavLink activeLocation={route === '/' ? activeSection : route} sectionNavigation={route === '/'}
                href="/ferias"
                label={pick(navbar.links.fairs)}
                onClick={() => setMobileMenuOpen(false)}
              />
              <NavLink activeLocation={route === '/' ? activeSection : route} sectionNavigation={route === '/'}
                href="/comunidad"
                label={pick(navbar.links.community)}
                onClick={() => setMobileMenuOpen(false)}
              />
              <NavLink activeLocation={route === '/' ? activeSection : route} sectionNavigation={route === '/'}
                href="/ejemplos"
                label={pick(navbar.links.examples)}
                aliases={["/examples"]}
                onClick={() => setMobileMenuOpen(false)}
              />

              {/* Mobile Nosotros */}
              <div className="border-t border-border pt-4">
                <button
                  className={`text-sm text-left font-medium mb-2 hover:text-primary ${
                    isActive("/quienes-somos") || isActive("/contacto") ? 'text-primary' : 'text-muted-foreground'
                  }`}
                  onClick={() => setNosotrosDropdownOpen(!nosotrosDropdownOpen)}
                >
                  {pick(navbar.links.nosotros)}
                </button>
                {nosotrosDropdownOpen && (
                  <div className="flex flex-col gap-2 pl-4">
                    <Link
                      href="/quienes-somos"
                      className={`text-sm hover:text-primary ${
                        isActive("/quienes-somos") ? 'text-primary font-medium' : 'text-muted-foreground'
                      }`}
                      onClick={() => { setMobileMenuOpen(false); setNosotrosDropdownOpen(false); }}
                    >
                      {pick(navbar.links.about)}
                    </Link>
                    <Link
                      href="/contacto"
                      className={`text-sm hover:text-primary ${
                        isActive("/contacto") ? 'text-primary font-medium' : 'text-muted-foreground'
                      }`}
                      onClick={() => { setMobileMenuOpen(false); setNosotrosDropdownOpen(false); }}
                    >
                      {pick(navbar.links.contact)}
                    </Link>
                  </div>
                )}
              </div>

              <a href="https://blogs.tsuru.jcampos.dev/" className="text-sm text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}>{pick(navbar.links.blog)}</a>

              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <a href="https://app.tsuru.jcampos.dev" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                    {pick(navbar.login)}
                  </Button>
                </a>
                <a href="https://app.tsuru.jcampos.dev/register" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    {pick(navbar.register)}
                  </Button>
                </a>
              </div>
            </nav>
          </m.div>
        )}</AnimatePresence></LazyMotion>
      </div>
    </header>
  );
}
