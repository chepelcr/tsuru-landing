// Blog — list-editor over blog.json articles. Bilingual title/excerpt/date,
// author, featured, order. Excerpt uses BilingualTextArea with RICH_TEXT_HINT.

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
  Toggle,
} from "@/components/admin/AdminUI";
import { RICH_TEXT_HINT } from "@/lib/rich-text";

type Article = ReturnType<typeof useAdminStore.getState>["blog"]["articles"][number];
type Lang = "es" | "en";

const empty = (n: number): Article => ({
  id: `article-${Date.now()}`,
  slug: "",
  author: "",
  date: { es: "", en: "" },
  featured: false,
  order: n + 1,
  title: { es: "", en: "" },
  excerpt: { es: "", en: "" },
  content: { es: "", en: "" },
});

export default function BlogPage() {
  const { language, t } = useLanguage();
  const lang = language as Lang;
  const store = useAdminStore();
  const [articles, setArticles] = useState<Article[]>(() => structuredClone(store.blog.articles));
  const [editing, setEditing] = useState<Article | null>(null);
  const [isNew, setIsNew] = useState(false);

  const value = { articles };
  const save = async () => {
    store.setBlog(value);
    await downloadJson("blog.json", value);
  };

  const handleApply = () => {
    if (!editing) return;
    if (isNew) setArticles((arr) => [...arr, editing]);
    else setArticles((arr) => arr.map((a) => (a.id === editing.id ? editing : a)));
    setEditing(null);
  };

  const remove = (id: string) => {
    if (!confirm(t("admin.blog.confirmDelete"))) return;
    setArticles((arr) => arr.filter((a) => a.id !== id));
  };

  const setTr = (field: "date" | "title" | "excerpt" | "content", l: Lang, v: string) =>
    setEditing((e) => (e ? { ...e, [field]: { ...e[field], [l]: v } } : e));

  return (
    <div>
      <PageHeader
        title={t("admin.pages.blog")}
        description={t("admin.blog.subtitle")}
        entity="blog.json"
        value={value}
        onSave={save}
        actions={
          <button
            type="button"
            onClick={() => {
              setIsNew(true);
              setEditing(empty(articles.length));
            }}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> {t("admin.common.add")}
          </button>
        }
      />

      {articles.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">{t("admin.blog.empty")}</p>
      ) : (
        <div className="space-y-3">
          {articles
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((a) => (
              <div key={a.id} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-semibold text-foreground">{a.title[lang]}</span>
                    {a.featured && (
                      <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600">
                        {t("admin.blog.featured")}
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {a.author} · {a.date[lang]}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button type="button" onClick={() => { setIsNew(false); setEditing(structuredClone(a)); }} className="rounded-lg border border-border p-1.5 text-muted-foreground hover:text-foreground">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => remove(a.id)} className="rounded-lg border border-border p-1.5 text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {editing && (
        <Modal
          title={isNew ? t("admin.blog.newItem") : t("admin.blog.editItem")}
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
            <BilingualField label={t("admin.blog.title")} es={editing.title.es} en={editing.title.en} onChange={(l, v) => setTr("title", l, v)} />
            <BilingualTextArea label={t("admin.blog.excerpt")} es={editing.excerpt.es} en={editing.excerpt.en} onChange={(l, v) => setTr("excerpt", l, v)} hint={RICH_TEXT_HINT} />
            <BilingualTextArea label={t("admin.blog.content")} es={editing.content.es} en={editing.content.en} onChange={(l, v) => setTr("content", l, v)} hint={RICH_TEXT_HINT} />
            <BilingualField label={t("admin.blog.date")} es={editing.date.es} en={editing.date.en} onChange={(l, v) => setTr("date", l, v)} />
          </BilingualSection>
          <TextField label={t("admin.blog.slug")} value={editing.slug} onChange={(v) => setEditing((e) => (e ? { ...e, slug: v } : e))} />
          <TextField label={t("admin.blog.author")} value={editing.author} onChange={(v) => setEditing((e) => (e ? { ...e, author: v } : e))} />
          <TextField label={t("admin.blog.order")} value={String(editing.order)} onChange={(v) => setEditing((e) => (e ? { ...e, order: Number(v) || 0 } : e))} />
          <Toggle label={t("admin.blog.featured")} checked={editing.featured} onChange={(v) => setEditing((e) => (e ? { ...e, featured: v } : e))} />
        </Modal>
      )}
    </div>
  );
}
