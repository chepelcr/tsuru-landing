// Navigation — singleton draft editing navigation.json: primary links (reorder /
// add / remove) + footer groups. labelKey is chosen from the available
// translation keys (or typed free) via a datalist-backed input.

import { useState } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAdminStore, downloadJson } from "@/lib/admin-store";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminCard, TextField, inputCls, labelCls } from "@/components/admin/AdminUI";
import enKeys from "@/translations/en.json";

const TRANSLATION_KEYS = Object.keys(enKeys);

type Nav = ReturnType<typeof useAdminStore.getState>["navigation"];

function KeyField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <input className={inputCls} list="translation-keys" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export default function NavigationPage() {
  const { t } = useLanguage();
  const store = useAdminStore();
  const [draft, setDraft] = useState<Nav>(() => structuredClone(store.navigation));

  const update = (mut: (d: Nav) => void) => {
    setDraft((prev) => {
      const next = structuredClone(prev);
      mut(next);
      return next;
    });
  };

  const save = async () => {
    store.setNavigation(draft);
    await downloadJson("navigation.json", draft);
  };

  const move = (arr: { order?: number }[], i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    arr.forEach((x, idx) => (x.order = idx + 1));
  };

  return (
    <div>
      <datalist id="translation-keys">
        {TRANSLATION_KEYS.map((k) => (
          <option key={k} value={k} />
        ))}
      </datalist>

      <PageHeader
        title={t("admin.pages.navigation")}
        description={t("admin.navigation.subtitle")}
        entity="navigation.json"
        value={draft}
        onSave={save}
      />

      <div className="space-y-5">
        <AdminCard
          title={t("admin.navigation.primary")}
          action={
            <button
              type="button"
              onClick={() =>
                update((d) =>
                  d.primary.push({
                    id: `nav-${Date.now()}`,
                    labelKey: "",
                    href: "/",
                    order: d.primary.length + 1,
                  }),
                )
              }
              className="flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-3.5 w-3.5" /> {t("admin.common.add")}
            </button>
          }
        >
          {draft.primary.map((link, i) => (
            <div key={link.id} className="flex items-end gap-2 rounded-xl border border-border bg-background/40 p-3">
              <div className="flex-1">
                <KeyField
                  label={t("admin.navigation.labelKey")}
                  value={link.labelKey}
                  onChange={(v) => update((d) => (d.primary[i].labelKey = v))}
                />
              </div>
              <div className="flex-1">
                <TextField
                  label={t("admin.navigation.href")}
                  value={link.href}
                  onChange={(v) => update((d) => (d.primary[i].href = v))}
                />
              </div>
              <div className="flex gap-1 pb-0.5">
                <button type="button" onClick={() => update((d) => move(d.primary, i, -1))} className="rounded-lg border border-border p-2 text-muted-foreground hover:text-foreground">
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => update((d) => move(d.primary, i, 1))} className="rounded-lg border border-border p-2 text-muted-foreground hover:text-foreground">
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => update((d) => d.primary.splice(i, 1))} className="rounded-lg border border-border p-2 text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </AdminCard>

        <AdminCard
          title={t("admin.navigation.footer")}
          action={
            <button
              type="button"
              onClick={() => update((d) => d.footerGroups.push({ titleKey: "", links: [] }))}
              className="flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-3.5 w-3.5" /> {t("admin.common.add")}
            </button>
          }
        >
          {draft.footerGroups.map((group, gi) => (
            <div key={gi} className="space-y-3 rounded-xl border border-border bg-background/40 p-3">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <KeyField
                    label={t("admin.navigation.titleKey")}
                    value={group.titleKey}
                    onChange={(v) => update((d) => (d.footerGroups[gi].titleKey = v))}
                  />
                </div>
                <button type="button" onClick={() => update((d) => d.footerGroups.splice(gi, 1))} className="rounded-lg border border-border p-2 text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {group.links.map((lnk, li) => (
                <div key={li} className="flex items-end gap-2 pl-4">
                  <div className="flex-1">
                    <KeyField
                      label={t("admin.navigation.labelKey")}
                      value={lnk.labelKey}
                      onChange={(v) => update((d) => (d.footerGroups[gi].links[li].labelKey = v))}
                    />
                  </div>
                  <div className="flex-1">
                    <TextField
                      label={t("admin.navigation.href")}
                      value={lnk.href}
                      onChange={(v) => update((d) => (d.footerGroups[gi].links[li].href = v))}
                    />
                  </div>
                  <button type="button" onClick={() => update((d) => d.footerGroups[gi].links.splice(li, 1))} className="rounded-lg border border-border p-2 text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => update((d) => d.footerGroups[gi].links.push({ labelKey: "", href: "/" }))}
                className="ml-4 flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <Plus className="h-3.5 w-3.5" /> {t("admin.navigation.addLink")}
              </button>
            </div>
          ))}
        </AdminCard>
      </div>
    </div>
  );
}
