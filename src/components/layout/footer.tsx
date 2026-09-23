import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import footer from "@/content/footer.json";
import { BrandLogo } from "@/components/layout/brand-logo";
import { resolveAssetUrl } from "@/lib/media";

export default function LandingFooter() {
  const { language: lang } = useLanguage();
  const pick = (f: { es: string; en: string }) => f[lang] ?? f.es;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/40 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity">
              <BrandLogo label={pick(footer.brand)} size={36} />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {pick(footer.description)}
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-semibold text-sm mb-3 text-foreground">{pick(footer.groups.product)}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/funcionalidades" className="hover:text-primary transition-colors">{pick(footer.links.features)}</Link></li>
              <li><Link href="/planes" className="hover:text-primary transition-colors">{pick(footer.links.plans)}</Link></li>
              <li><Link href="/ferias" className="hover:text-primary transition-colors">{pick(footer.links.fairs)}</Link></li>
              <li><Link href="/comunidad" className="hover:text-primary transition-colors">{pick(footer.links.community)}</Link></li>
              <li><Link href="/ejemplos" className="hover:text-primary transition-colors">{pick(footer.links.examples)}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-sm mb-3 text-foreground">{pick(footer.groups.company)}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/quienes-somos" className="hover:text-primary transition-colors">{pick(footer.links.about)}</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">{pick(footer.links.blog)}</Link></li>
              <li><Link href="/contacto" className="hover:text-primary transition-colors">{pick(footer.links.contact)}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-sm mb-3 text-foreground">{pick(footer.groups.legal)}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/terminos" className="hover:text-primary transition-colors">{pick(footer.links.terms)}</Link></li>
              <li><Link href="/privacidad" className="hover:text-primary transition-colors">{pick(footer.links.privacy)}</Link></li>
              <li><Link href="/cookies" className="hover:text-primary transition-colors">{pick(footer.links.cookies)}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>{pick(footer.copyright).replace('© 2026', `© ${currentYear}`)}</p>

          {/* Studio attribution — the logo already ships with alpha, so it sits
              on both themes without a plate behind it. */}
          <a
            href={footer.madeBy.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-primary transition-colors group"
          >
            <span>{pick(footer.madeBy.label)}</span>
            <img
              src={resolveAssetUrl(footer.madeBy.logoUrl)}
              alt={footer.madeBy.name}
              className="h-7 w-auto opacity-90 group-hover:opacity-100 transition-opacity"
              loading="lazy"
            />
            <span className="font-medium text-foreground/80 group-hover:text-primary transition-colors">
              {footer.madeBy.name}
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
