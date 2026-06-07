// Theme applier — distinct from ThemeContext (which owns the .dark class + the
// "theme" localStorage key). This reads the active theme from themes.json and
// the favicon from branding.json, and writes them into the DOM:
//
//  - a single managed <style id="brand-theme"> element so it never fights inline
//    styles. It sets brand tokens (--brand-*) on :root and the SEMANTIC light-mode
//    tokens (--primary, --accent, ...) scoped to :root:not(.dark), so the .dark
//    palette (a more-specific .dark class selector) keeps precedence.
//  - the <link rel="icon"> from branding.faviconUrl (no-op when empty).
//
// The seeded "default" theme mirrors the current :root light palette, so calling
// initBrand() at boot is a visual no-op.

import themesData from "@/content/themes.json";
import brandingData from "@/content/branding.json";
import { resolveAssetUrl } from "@/lib/media";

type ThemeColors = Record<string, string>;
type Theme = { id: string; name: string; isActive?: boolean; colors: ThemeColors };

// Semantic token name -> CSS variable it writes (light-mode only).
const SEMANTIC_VARS: Record<string, string> = {
  primary: "--primary",
  accent: "--accent",
  secondary: "--secondary",
  background: "--background",
  foreground: "--foreground",
  muted: "--muted",
  ring: "--ring",
  card: "--card",
  border: "--border",
  success: "--success",
  warning: "--warning",
};

/** "#2f7f33" (or "#abc") -> "123 46% 34%" — the bare H S% L% triplet HSL vars expect. */
export function hexToHsl(hex: string): string {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let s = 0;
  let hue = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: hue = (g - b) / d + (g < b ? 6 : 0); break;
      case g: hue = (b - r) / d + 2; break;
      default: hue = (r - g) / d + 4; break;
    }
    hue /= 6;
  }
  return `${Math.round(hue * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

/**
 * Accepts a color stored either as a hex string ("#2f7f33") or as a bare HSL
 * triplet ("123 46% 34%", the form the CSS vars use). Hex is converted; an HSL
 * triplet passes through verbatim so it round-trips exactly.
 */
function toHslTriplet(value: string): string {
  return value.trim().startsWith("#") ? hexToHsl(value) : value.trim();
}

function buildCss(colors: ThemeColors): string {
  const brandLines: string[] = [];
  const semanticLines: string[] = [];
  for (const [name, value] of Object.entries(colors)) {
    if (!value) continue;
    const hsl = toHslTriplet(value);
    brandLines.push(`  --brand-${name}: ${hsl};`);
    const semantic = SEMANTIC_VARS[name];
    if (semantic) semanticLines.push(`  ${semantic}: ${hsl};`);
  }
  return [
    `:root {\n${brandLines.join("\n")}\n}`,
    `:root:not(.dark) {\n${semanticLines.join("\n")}\n}`,
  ].join("\n");
}

export function applyBrandTheme(theme: Theme): void {
  if (typeof document === "undefined") return;
  let el = document.getElementById("brand-theme") as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement("style");
    el.id = "brand-theme";
    document.head.appendChild(el);
  }
  el.textContent = buildCss(theme.colors);
}

export function applyFavicon(ref?: string | null): void {
  if (typeof document === "undefined") return;
  const href = resolveAssetUrl(ref);
  if (!href) return; // no-op when branding.faviconUrl is empty
  let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = href;
}

export function initBrand(): void {
  const themes = themesData as Theme[];
  const active = themes.find((t) => t.isActive) ?? themes[0];
  if (active) applyBrandTheme(active);
  applyFavicon(brandingData.faviconUrl);
}
