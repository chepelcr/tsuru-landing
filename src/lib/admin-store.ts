// Admin content store (Zustand).
//
// Loads every src/content/*.json (plus the two translation files) on init,
// exposes each as a slice + setter, tracks dirty state via JSON-string
// snapshots, and provides the single save entry point `downloadJson`.
//
// IMPORTANT: this module must NOT import the admin-ui store. It is also pulled
// into the public bundle by any consumer, so it stays free of admin-only UI
// state and signals the shell via a DOM CustomEvent ("tsuru:content-saved").

import { create } from "zustand";
import { saveContentFile } from "./local-cms";
import type { MediaItem } from "./media";

import brandingData from "@/content/branding.json";
import themesData from "@/content/themes.json";
import navigationData from "@/content/navigation.json";
import mediaData from "@/content/media.json";
import settingsData from "@/content/settings.json";
import blogData from "@/content/blog.json";
import seoData from "@/content/seo.json";
import landingData from "@/content/landing.json";
import featuresData from "@/content/features.json";
import fairsData from "@/content/fairs.json";
import communityData from "@/content/community.json";
import aboutData from "@/content/about.json";
import contactData from "@/content/contact.json";
import termsData from "@/content/terms.json";
import privacyData from "@/content/privacy.json";
import cookiesData from "@/content/cookies.json";
import blogChromeData from "@/content/blog-chrome.json";
import navbarData from "@/content/navbar.json";
import footerData from "@/content/footer.json";
import uiData from "@/content/ui.json";
import ctaSecurityData from "@/content/cta-security.json";

type Branding = typeof brandingData;
type Themes = typeof themesData;
type Navigation = typeof navigationData;
type Media = { items: MediaItem[] };
type Settings = typeof settingsData;
type Blog = typeof blogData;
type Seo = typeof seoData;
type Landing = typeof landingData;
type Features = typeof featuresData;
type Fairs = typeof fairsData;
type Community = typeof communityData;
type About = typeof aboutData;
type Contact = typeof contactData;
type Terms = typeof termsData;
type Privacy = typeof privacyData;
type Cookies = typeof cookiesData;
type BlogChrome = typeof blogChromeData;
type Navbar = typeof navbarData;
type Footer = typeof footerData;
type Ui = typeof uiData;
type CtaSecurity = typeof ctaSecurityData;

interface AdminState {
  branding: Branding;
  themes: Themes;
  navigation: Navigation;
  media: Media;
  settings: Settings;
  blog: Blog;
  seo: Seo;
  landing: Landing;
  features: Features;
  fairs: Fairs;
  community: Community;
  about: About;
  contact: Contact;
  terms: Terms;
  privacy: Privacy;
  cookies: Cookies;
  blogChrome: BlogChrome;
  navbar: Navbar;
  footer: Footer;
  ui: Ui;
  ctaSecurity: CtaSecurity;

  setBranding: (v: Branding) => void;
  setThemes: (v: Themes) => void;
  setNavigation: (v: Navigation) => void;
  setMedia: (v: Media) => void;
  setSettings: (v: Settings) => void;
  setBlog: (v: Blog) => void;
  setSeo: (v: Seo) => void;
  setLanding: (v: Landing) => void;
  setFeatures: (v: Features) => void;
  setFairs: (v: Fairs) => void;
  setCommunity: (v: Community) => void;
  setAbout: (v: About) => void;
  setContact: (v: Contact) => void;
  setTerms: (v: Terms) => void;
  setPrivacy: (v: Privacy) => void;
  setCookies: (v: Cookies) => void;
  setBlogChrome: (v: BlogChrome) => void;
  setNavbar: (v: Navbar) => void;
  setFooter: (v: Footer) => void;
  setUi: (v: Ui) => void;
  setCtaSecurity: (v: CtaSecurity) => void;

  savedSnapshots: Record<string, string>;
  markSaved: (file: string, value: unknown) => void;
  discardEntity: (file: string) => void;
}

// filename (as used in the manifest / downloadJson) → store slice key.
const ENTITY_BY_FILE: Record<string, keyof AdminState> = {
  "branding.json": "branding",
  "themes.json": "themes",
  "navigation.json": "navigation",
  "media.json": "media",
  "settings.json": "settings",
  "blog.json": "blog",
  "seo.json": "seo",
  "landing.json": "landing",
  "features.json": "features",
  "fairs.json": "fairs",
  "community.json": "community",
  "about.json": "about",
  "contact.json": "contact",
  "terms.json": "terms",
  "privacy.json": "privacy",
  "cookies.json": "cookies",
  "blog-chrome.json": "blogChrome",
  "navbar.json": "navbar",
  "footer.json": "footer",
  "ui.json": "ui",
  "cta-security.json": "ctaSecurity",
};

const INITIAL: Record<string, unknown> = {
  "branding.json": brandingData,
  "themes.json": themesData,
  "navigation.json": navigationData,
  "media.json": mediaData,
  "settings.json": settingsData,
  "blog.json": blogData,
  "seo.json": seoData,
  "landing.json": landingData,
  "features.json": featuresData,
  "fairs.json": fairsData,
  "community.json": communityData,
  "about.json": aboutData,
  "contact.json": contactData,
  "terms.json": termsData,
  "privacy.json": privacyData,
  "cookies.json": cookiesData,
  "blog-chrome.json": blogChromeData,
  "navbar.json": navbarData,
  "footer.json": footerData,
  "ui.json": uiData,
  "cta-security.json": ctaSecurityData,
};

const INITIAL_SNAPSHOTS: Record<string, string> = Object.fromEntries(
  Object.keys(ENTITY_BY_FILE).map((file) => [file, JSON.stringify(INITIAL[file])]),
);

export const useAdminStore = create<AdminState>((set) => ({
  branding: brandingData,
  themes: themesData,
  navigation: navigationData,
  media: mediaData as Media,
  settings: settingsData,
  blog: blogData,
  seo: seoData,
  landing: landingData,
  features: featuresData,
  fairs: fairsData,
  community: communityData,
  about: aboutData,
  contact: contactData,
  terms: termsData,
  privacy: privacyData,
  cookies: cookiesData,
  blogChrome: blogChromeData,
  navbar: navbarData,
  footer: footerData,
  ui: uiData,
  ctaSecurity: ctaSecurityData,

  setBranding: (v) => set({ branding: v }),
  setThemes: (v) => set({ themes: v }),
  setNavigation: (v) => set({ navigation: v }),
  setMedia: (v) => set({ media: v }),
  setSettings: (v) => set({ settings: v }),
  setBlog: (v) => set({ blog: v }),
  setSeo: (v) => set({ seo: v }),
  setLanding: (v) => set({ landing: v }),
  setFeatures: (v) => set({ features: v }),
  setFairs: (v) => set({ fairs: v }),
  setCommunity: (v) => set({ community: v }),
  setAbout: (v) => set({ about: v }),
  setContact: (v) => set({ contact: v }),
  setTerms: (v) => set({ terms: v }),
  setPrivacy: (v) => set({ privacy: v }),
  setCookies: (v) => set({ cookies: v }),
  setBlogChrome: (v) => set({ blogChrome: v }),
  setNavbar: (v) => set({ navbar: v }),
  setFooter: (v) => set({ footer: v }),
  setUi: (v) => set({ ui: v }),
  setCtaSecurity: (v) => set({ ctaSecurity: v }),

  savedSnapshots: INITIAL_SNAPSHOTS,
  markSaved: (file, value) =>
    set((s) => ({ savedSnapshots: { ...s.savedSnapshots, [file]: JSON.stringify(value) } })),
  discardEntity: (file) => {
    const snap = useAdminStore.getState().savedSnapshots[file];
    const key = ENTITY_BY_FILE[file];
    if (snap === undefined || !key) return;
    set({ [key]: JSON.parse(snap) } as Partial<AdminState>);
  },
}));

/**
 * Dirty hook — true when the live value differs from the last-saved snapshot.
 * Re-renders when the snapshot changes (after a save), so the floating Save
 * button hides itself.
 */
export function useEntityDirty(filename: string, value: unknown): boolean {
  const snap = useAdminStore((s) => s.savedSnapshots[filename]);
  return JSON.stringify(value) !== snap;
}

/**
 * The single save entry point. Delegates the dev write-back to saveContentFile,
 * falls back to a browser download when unavailable, marks the entity clean and
 * dispatches "tsuru:content-saved" so the topbar re-checks publish state.
 *
 * Translation files are keyed "translations/en.json" / "translations/es.json"
 * in the store + manifest, but the local-cms plugin routes by bare basename
 * (en.json / es.json → src/translations/), so we strip the prefix on the wire.
 */
export async function downloadJson(filename: string, data: unknown): Promise<void> {
  const wireName = filename.startsWith("translations/")
    ? filename.slice("translations/".length)
    : filename;

  const wrote = await saveContentFile(wireName, data);
  if (!wrote) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = wireName;
    a.click();
    URL.revokeObjectURL(url);
  }
  useAdminStore.getState().markSaved(filename, data);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("tsuru:content-saved"));
  }
}
