// Site Identity — a multi-file page editing branding.json AND themes.json.
// Self-registers its own editor (PageHeader tracks a single entity), writes both
// files on save, and previews the active theme live via applyBrandTheme.

import { useEffect, useState } from "react";
import { Plus, Copy, Trash2, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAdminStore, useEntityDirty, downloadJson } from "@/lib/admin-store";
import { useAdminUi } from "@/lib/admin-ui";
import { applyBrandTheme } from "@/lib/brand-theme";
import {
  AdminCard,
  BilingualField,
  TextField,
  ColorField,
} from "@/components/admin/AdminUI";
import { FloatingSaveButton } from "@/components/admin/PageHeader";
import { MediaPicker } from "@/components/admin/MediaPicker";

type Theme = {
  id: string;
  name: string;
  isActive?: boolean;
  colors: Record<string, string>;
};

const COLOR_KEYS = [
  "primary",
  "accent",
  "secondary",
  "background",
  "foreground",
  "muted",
  "ring",
  "card",
  "border",
  "success",
  "warning",
];

export default function SiteIdentityPage() {
  const { t } = useLanguage();
  const store = useAdminStore();
  const setEditor = useAdminUi((s) => s.setEditor);
  const clearEditor = useAdminUi((s) => s.clearEditor);

  const [bDraft, setBDraft] = useState(() => structuredClone(store.branding));
  const [tDraft, setTDraft] = useState<Theme[]>(() => structuredClone(store.themes) as Theme[]);

  const bDirty = useEntityDirty("branding.json", bDraft);
  const tDirty = useEntityDirty("themes.json", tDraft);
  const dirty = bDirty || tDirty;

  // live preview the active theme
  useEffect(() => {
    const active = tDraft.find((x) => x.isActive) ?? tDraft[0];
    if (active) applyBrandTheme(active);
  }, [tDraft]);

  // re-apply the saved theme on unmount so a discarded edit leaves no stale colours
  useEffect(() => {
    return () => {
      const saved = (useAdminStore.getState().themes as Theme[]).find((x) => x.isActive);
      if (saved) applyBrandTheme(saved);
    };
  }, []);

  const save = async () => {
    store.setBranding(bDraft);
    store.setThemes(tDraft as typeof store.themes);
    await downloadJson("branding.json", bDraft);
    await downloadJson("themes.json", tDraft);
  };

  useEffect(() => {
    setEditor({ dirty, filename: "branding.json", save });
    return () => clearEditor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty]);

  const setBranding = (mut: (b: typeof bDraft) => void) => {
    setBDraft((prev) => {
      const next = structuredClone(prev);
      mut(next);
      return next;
    });
  };
  const setThemes = (mut: (ts: Theme[]) => void) => {
    setTDraft((prev) => {
      const next = structuredClone(prev);
      mut(next);
      return next;
    });
  };

  const addTheme = () =>
    setThemes((ts) =>
      void ts.push({
        id: `theme-${Date.now()}`,
        name: t("admin.identity.newTheme"),
        isActive: false,
        colors: { ...(ts[0]?.colors ?? {}) },
      }),
    );
  const duplicateTheme = (id: string) =>
    setThemes((ts) => {
      const src = ts.find((x) => x.id === id);
      if (src) ts.push({ ...structuredClone(src), id: `theme-${Date.now()}`, name: `${src.name} (copy)`, isActive: false });
    });
  const deleteTheme = (id: string) => {
    if (tDraft.length <= 1) return;
    if (!confirm(t("admin.identity.confirmDeleteTheme"))) return;
    setThemes((ts) => {
      const idx = ts.findIndex((x) => x.id === id);
      const wasActive = ts[idx]?.isActive;
      ts.splice(idx, 1);
      if (wasActive && ts[0]) ts[0].isActive = true;
    });
  };
  const activateTheme = (id: string) =>
    setThemes((ts) => ts.forEach((x) => (x.isActive = x.id === id)));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{t("admin.pages.identity")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("admin.identity.subtitle")}</p>
      </div>

      <div className="space-y-5">
        <AdminCard title={t("admin.identity.branding")}>
          <TextField
            label={t("admin.identity.companyName")}
            value={bDraft.companyName}
            onChange={(v) => setBranding((b) => (b.companyName = v))}
          />
          <BilingualField
            label={t("admin.identity.tagline")}
            es={bDraft.tagline.es}
            en={bDraft.tagline.en}
            onChange={(l, v) => setBranding((b) => (b.tagline[l] = v))}
          />
          <MediaPicker
            label={t("admin.identity.logo")}
            value={bDraft.logoUrl}
            onChange={(v) => setBranding((b) => (b.logoUrl = v))}
          />
          <MediaPicker
            label={t("admin.identity.logoDark")}
            value={bDraft.logoUrlDark}
            onChange={(v) => setBranding((b) => (b.logoUrlDark = v))}
          />
          <MediaPicker
            label={t("admin.identity.favicon")}
            value={bDraft.faviconUrl}
            onChange={(v) => setBranding((b) => (b.faviconUrl = v))}
          />
          <TextField
            label={t("admin.identity.adminLoginUrl")}
            value={bDraft.adminLoginUrl}
            onChange={(v) => setBranding((b) => (b.adminLoginUrl = v))}
          />
          <TextField
            label={t("admin.identity.adminRegisterUrl")}
            value={bDraft.adminRegisterUrl}
            onChange={(v) => setBranding((b) => (b.adminRegisterUrl = v))}
          />
        </AdminCard>

        <AdminCard
          title={t("admin.identity.themes")}
          action={
            <button
              type="button"
              onClick={addTheme}
              className="flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-3.5 w-3.5" /> {t("admin.common.add")}
            </button>
          }
        >
          <div className="space-y-4">
            {tDraft.map((theme, ti) => (
              <div key={theme.id} className="rounded-xl border border-border bg-background/40 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <input
                    className="h-9 flex-1 rounded-lg border border-input bg-background px-3 text-sm text-foreground"
                    value={theme.name}
                    onChange={(e) => setThemes((ts) => (ts[ti].name = e.target.value))}
                  />
                  <button
                    type="button"
                    onClick={() => activateTheme(theme.id)}
                    className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                      theme.isActive
                        ? "bg-emerald-600 text-white"
                        : "border border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {theme.isActive ? t("admin.identity.active") : t("admin.identity.activate")}
                  </button>
                  <button
                    type="button"
                    onClick={() => duplicateTheme(theme.id)}
                    className="rounded-lg border border-border p-1.5 text-muted-foreground hover:text-foreground"
                    title={t("admin.identity.duplicate")}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteTheme(theme.id)}
                    className="rounded-lg border border-border p-1.5 text-destructive hover:bg-destructive/10"
                    title={t("admin.common.delete")}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {COLOR_KEYS.map((ck) => (
                    <ColorField
                      key={ck}
                      label={ck}
                      value={theme.colors[ck] ?? ""}
                      onChange={(v) => setThemes((ts) => (ts[ti].colors[ck] = v))}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>

      <FloatingSaveButton
        dirty={dirty}
        save={save}
        saveLabel={t("admin.common.save")}
        savedLabel={t("admin.common.saved")}
      />
    </div>
  );
}
