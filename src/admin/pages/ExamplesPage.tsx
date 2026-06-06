// Examples — list-editor over examples.json stores. Cards + per-item modal:
// bilingual title/description/category, iconName select, storeUrl, featured
// toggle, order. PageHeader tracks the whole array.

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAdminStore, downloadJson } from "@/lib/admin-store";
import { PageHeader, Modal } from "@/components/admin/PageHeader";
import {
  BilingualField,
  BilingualTextArea,
  BilingualSection,
  TextField,
  SelectField,
  Toggle,
} from "@/components/admin/AdminUI";
import { resolveIcon, ICON_NAMES } from "@/lib/icons";

type Store = ReturnType<typeof useAdminStore.getState>["examples"]["stores"][number];
type Lang = "es" | "en";

const empty = (n: number): Store => ({
  id: `store-${Date.now()}`,
  iconName: "store",
  category: { es: "", en: "" },
  title: { es: "", en: "" },
  description: { es: "", en: "" },
  storeUrl: "",
  featured: false,
  order: n + 1,
});

export default function ExamplesPage() {
  const { language, t } = useLanguage();
  const lang = language as Lang;
  const store = useAdminStore();
  const [stores, setStores] = useState<Store[]>(() => structuredClone(store.examples.stores));
  const [editing, setEditing] = useState<Store | null>(null);
  const [isNew, setIsNew] = useState(false);

  const value = { stores };
  const save = async () => {
    store.setExamples(value);
    await downloadJson("examples.json", value);
  };

  const handleApply = () => {
    if (!editing) return;
    if (isNew) setStores((arr) => [...arr, editing]);
    else setStores((arr) => arr.map((s) => (s.id === editing.id ? editing : s)));
    setEditing(null);
  };

  const remove = (id: string) => {
    if (!confirm(t("admin.examples.confirmDelete"))) return;
    setStores((arr) => arr.filter((s) => s.id !== id));
  };

  const setTr = (field: "category" | "title" | "description", l: Lang, v: string) =>
    setEditing((e) => (e ? { ...e, [field]: { ...e[field], [l]: v } } : e));

  return (
    <div>
      <PageHeader
        title={t("admin.pages.examples")}
        description={t("admin.examples.subtitle")}
        entity="examples.json"
        value={value}
        onSave={save}
        actions={
          <button
            type="button"
            onClick={() => {
              setIsNew(true);
              setEditing(empty(stores.length));
            }}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> {t("admin.common.add")}
          </button>
        }
      />

      {stores.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">{t("admin.examples.empty")}</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {stores
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((s) => {
              const Icon = resolveIcon(s.iconName);
              return (
                <div key={s.id} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-semibold text-foreground">{s.title[lang]}</span>
                      {s.featured && (
                        <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600">
                          {t("admin.examples.featured")}
                        </span>
                      )}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">{s.category[lang]}</div>
                  </div>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => { setIsNew(false); setEditing(structuredClone(s)); }} className="rounded-lg border border-border p-1.5 text-muted-foreground hover:text-foreground">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => remove(s.id)} className="rounded-lg border border-border p-1.5 text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {editing && (
        <Modal
          title={isNew ? t("admin.examples.newItem") : t("admin.examples.editItem")}
          onClose={() => setEditing(null)}
          footer={
            <>
              <button type="button" onClick={() => setEditing(null)} className="h-9 rounded-lg border border-border px-4 text-sm font-medium text-foreground hover:bg-muted">
                {t("admin.common.cancel")}
              </button>
              <button type="button" onClick={handleApply} className="h-9 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                {t("admin.common.apply")}
              </button>
            </>
          }
        >
          <BilingualSection>
            <BilingualField label={t("admin.examples.title")} es={editing.title.es} en={editing.title.en} onChange={(l, v) => setTr("title", l, v)} />
            <BilingualField label={t("admin.examples.category")} es={editing.category.es} en={editing.category.en} onChange={(l, v) => setTr("category", l, v)} />
            <BilingualTextArea label={t("admin.examples.description")} es={editing.description.es} en={editing.description.en} onChange={(l, v) => setTr("description", l, v)} />
          </BilingualSection>
          <SelectField label={t("admin.examples.icon")} value={editing.iconName} options={ICON_NAMES} onChange={(v) => setEditing((e) => (e ? { ...e, iconName: v } : e))} />
          <TextField label={t("admin.examples.storeUrl")} value={editing.storeUrl} onChange={(v) => setEditing((e) => (e ? { ...e, storeUrl: v } : e))} />
          <TextField label={t("admin.examples.order")} value={String(editing.order)} onChange={(v) => setEditing((e) => (e ? { ...e, order: Number(v) || 0 } : e))} />
          <Toggle label={t("admin.examples.featured")} checked={editing.featured} onChange={(v) => setEditing((e) => (e ? { ...e, featured: v } : e))} />
        </Modal>
      )}
    </div>
  );
}
