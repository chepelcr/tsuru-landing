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
import examplesData from "@/content/examples.json";
import blogData from "@/content/blog.json";
import seoData from "@/content/seo.json";
import enData from "@/translations/en.json";
import esData from "@/translations/es.json";

type Branding = typeof brandingData;
type Themes = typeof themesData;
type Navigation = typeof navigationData;
type Media = { items: MediaItem[] };
type Settings = typeof settingsData;
type Examples = typeof examplesData;
type Blog = typeof blogData;
type Seo = typeof seoData;
type Translation = Record<string, string>;

interface AdminState {
  branding: Branding;
  themes: Themes;
  navigation: Navigation;
  media: Media;
  settings: Settings;
  examples: Examples;
  blog: Blog;
  seo: Seo;
  translationsEn: Translation;
  translationsEs: Translation;

  setBranding: (v: Branding) => void;
  setThemes: (v: Themes) => void;
  setNavigation: (v: Navigation) => void;
  setMedia: (v: Media) => void;
  setSettings: (v: Settings) => void;
  setExamples: (v: Examples) => void;
  setBlog: (v: Blog) => void;
  setSeo: (v: Seo) => void;
  setTranslationsEn: (v: Translation) => void;
  setTranslationsEs: (v: Translation) => void;

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
  "examples.json": "examples",
  "blog.json": "blog",
  "seo.json": "seo",
  "translations/en.json": "translationsEn",
  "translations/es.json": "translationsEs",
};

const INITIAL: Record<string, unknown> = {
  "branding.json": brandingData,
  "themes.json": themesData,
  "navigation.json": navigationData,
  "media.json": mediaData,
  "settings.json": settingsData,
  "examples.json": examplesData,
  "blog.json": blogData,
  "seo.json": seoData,
  "translations/en.json": enData,
  "translations/es.json": esData,
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
  examples: examplesData,
  blog: blogData,
  seo: seoData,
  translationsEn: enData as Translation,
  translationsEs: esData as Translation,

  setBranding: (v) => set({ branding: v }),
  setThemes: (v) => set({ themes: v }),
  setNavigation: (v) => set({ navigation: v }),
  setMedia: (v) => set({ media: v }),
  setSettings: (v) => set({ settings: v }),
  setExamples: (v) => set({ examples: v }),
  setBlog: (v) => set({ blog: v }),
  setSeo: (v) => set({ seo: v }),
  setTranslationsEn: (v) => set({ translationsEn: v }),
  setTranslationsEs: (v) => set({ translationsEs: v }),

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
