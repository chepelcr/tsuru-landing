import { getContent } from "@/repositories/content.repository";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
const navbar = getContent<typeof import("@/content/navbar.json")>("navbar");
import { BrandLogo } from "@/components/layout/brand-logo";

interface LandingNavbarProps {
  transitionStage?: string;
}

export default function LandingNavbar({ transitionStage = '' }: LandingNavbarProps) {
  const { language: lang } = useLanguage();
  const pick = (f: { es: string; en: string }) => f[lang] ?? f.es;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [nosotrosDropdownOpen, setNosotrosDropdownOpen] = useState(false);
  const [location] = useLocation();
  // ReturnType<typeof setTimeout> rather than NodeJS.Timeout: this is browser
  // code and the repo has no @types/node, so the NodeJS namespace isn't declared.
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMobileMenuOpen(false);
    setNosotrosDropdownOpen(false);
  }, [location]);
  useEffect(() => {
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { setMobileMenuOpen(false); setNosotrosDropdownOpen(false); } };
    window.addEventListener('keydown', escape);
    return () => { window.removeEventListener('keydown', escape); if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current); };
  }, []);

  const isActive = (href: string, aliases: string[] = []) =>
    location === href || aliases.includes(location);

  interface NavLinkProps {
    href: string;
    label: string;
    aliases?: string[];
    onClick?: () => void;
  }

  const NavLink = ({ href, label, aliases = [], onClick }: NavLinkProps) => {
    const active = isActive(href, aliases);
    return (
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        onClick={onClick}
        className={`relative text-sm transition-colors hover:text-primary ${
          active ? 'text-primary font-medium' : 'text-muted-foreground'
        }`}
      >
        {label}
        <span
          className={`absolute left-0 -bottom-1 h-0.5 bg-primary rounded-full transition-all duration-200 ${
            active ? 'w-full' : 'w-0'
          }`}
        />
      </Link>
    );
  };

  return (
    <header className={`marketing-navbar sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border ${transitionStage}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <BrandLogo label={pick(navbar.brand)} size={40} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-4 relative">
            <NavLink href="/funcionalidades" label={pick(navbar.links.features)} />
            <NavLink href="/planes" label={pick(navbar.links.plans)} aliases={["/pricing"]} />
            <NavLink href="/ferias" label={pick(navbar.links.fairs)} />
            <NavLink href="/comunidad" label={pick(navbar.links.community)} />
            <NavLink href="/ejemplos" label={pick(navbar.links.examples)} aliases={["/examples"]} />

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
          <div className="hidden xl:flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <a href="https://app.tsuru.jcampos.dev" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                {pick(navbar.login)}
              </Button>
            </a>
            <a href="https://app.tsuru.jcampos.dev/register" target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5">
                {pick(navbar.register)}
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden items-center gap-2">
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
        {mobileMenuOpen && (
          <div id="mobile-navigation" className="xl:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              <NavLink
                href="/funcionalidades"
                label={pick(navbar.links.features)}
                onClick={() => setMobileMenuOpen(false)}
              />
              <NavLink
                href="/planes"
                label={pick(navbar.links.plans)}
                aliases={["/pricing"]}
                onClick={() => setMobileMenuOpen(false)}
              />
              <NavLink
                href="/ferias"
                label={pick(navbar.links.fairs)}
                onClick={() => setMobileMenuOpen(false)}
              />
              <NavLink
                href="/comunidad"
                label={pick(navbar.links.community)}
                onClick={() => setMobileMenuOpen(false)}
              />
              <NavLink
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
          </div>
        )}
      </div>
    </header>
  );
}
