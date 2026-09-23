// The image replaces both the placeholder symbol and its text. Site Identity
// controls the light/dark URLs; the fallback stays for incomplete brand config.

import { Leaf } from "lucide-react";
import branding from "@/content/branding.json";
import { resolveAssetUrl } from "@/lib/media";

interface BrandLogoProps {
  /** Wordmark text rendered beside the mark. */
  label: string;
  /** Slot size in px — the mark's box and the logo image's max height. */
  size?: number;
  /** Tailwind classes for the wordmark. */
  labelClassName?: string;
}

export function BrandLogo({
  label,
  size = 32,
  labelClassName = "font-serif text-xl font-bold text-foreground",
}: BrandLogoProps) {
  const light = branding.logoUrl?.trim();
  const dark = branding.logoUrlDark?.trim() || light;

  // The supplied PNGs have generous transparent margins and a tiny tagline.
  // Crop those margins at display size so the wordmark stays readable in chrome.
  const wordmarkStyle = {
    height: size * 1.5,
    maxWidth: "none",
    marginLeft: -size * 0.825,
    marginTop: -size * 0.15,
  };
  if (light) {
    return (
      <span className="relative block shrink-0 overflow-hidden" style={{ width: size * 3, height: size }}>
        <img
          src={resolveAssetUrl(light)}
          alt={label}
          style={wordmarkStyle}
          className="block w-auto dark:hidden"
        />
        <img
          src={resolveAssetUrl(dark)}
          alt={label}
          style={wordmarkStyle}
          className="hidden w-auto dark:block"
        />
      </span>
    );
  }

  // Placeholder: same footprint the real lockup will claim.
  return (
    <>
      <div
        style={{ width: size, height: size }}
        className="flex flex-shrink-0 items-center justify-center rounded-full bg-primary/10"
        aria-hidden="true"
      >
        <Leaf className="text-primary" style={{ width: size / 2, height: size / 2 }} />
      </div>
      <span className={labelClassName}>{label}</span>
    </>
  );
}
