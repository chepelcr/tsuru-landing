// BrandLogo — the reserved slot for the incoming Tsuru logo.
//
// The wordmark logo is still being produced (see docs/roadmap/
// tsuru_brand_asset_guide.md §2: L1 wordmark + L2 dark-mode variant). Until the
// files exist, this renders the botanical placeholder mark at exactly the size
// the real logo will occupy, so dropping the asset in causes no layout shift.
//
// To go live: upload the artwork through the admin Media library and set
// `logoUrl` / `logoUrlDark` on the Site identity page (writes branding.json).
// No code change needed — this component switches over on its own.

import { Leaf } from "lucide-react";
import branding from "@/content/branding.json";

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

  // Once artwork is set, the image replaces the whole lockup (mark + wordmark),
  // since the L1/L4 assets already contain the "Tsuru" wordmark themselves.
  if (light) {
    return (
      <>
        <img
          src={light}
          alt={label}
          style={{ height: size }}
          className="w-auto dark:hidden"
        />
        <img
          src={dark}
          alt={label}
          style={{ height: size }}
          className="hidden w-auto dark:block"
        />
      </>
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
