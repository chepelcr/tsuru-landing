// Media — gallery of media.json items with upload, add-URL, and remove.

import { useRef, useState, type DragEvent } from "react";
import { Upload, Trash2, Film } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAdminStore } from "@/lib/admin-store";
import { resolveMediaUrl } from "@/lib/media";
import { uploadToLibrary, addExternalToLibrary, removeFromLibrary } from "@/lib/media-upload";
import { PageHeader } from "@/components/admin/PageHeader";
import { inputCls } from "@/components/admin/AdminUI";

export default function MediaPage() {
  const { language, t } = useLanguage();
  const lang = language as "es" | "en";
  const media = useAdminStore((s) => s.media);
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function onUpload(file: File) {
    setBusy(true);
    setHint("");
    const item = await uploadToLibrary(file);
    setBusy(false);
    if (!item) setHint(t("admin.media.devServerHint"));
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) void onUpload(f);
  };

  return (
    <div>
      <PageHeader title={t("admin.pages.media")} description={t("admin.media.subtitle")} />

      <div className="mb-6 space-y-3 rounded-2xl border border-border bg-card p-5">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-8 text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
        >
          <Upload className="h-7 w-7" />
          <span className="text-sm">{t("admin.media.dropzone")}</span>
          {busy && <span className="text-xs">{t("admin.common.loading")}</span>}
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void onUpload(f);
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <input className={inputCls} value={url} onChange={(e) => setUrl(e.target.value)} placeholder={t("admin.media.urlPlaceholder")} />
          <button
            type="button"
            onClick={async () => {
              if (!url.trim()) return;
              await addExternalToLibrary(url.trim());
              setUrl("");
            }}
            className="h-10 shrink-0 rounded-xl border border-border px-4 text-sm font-medium text-foreground hover:bg-muted"
          >
            {t("admin.media.addUrl")}
          </button>
        </div>
        {hint && <p className="text-xs text-amber-500">{hint}</p>}
      </div>

      {media.items.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">{t("admin.media.empty")}</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {media.items.map((i) => (
            <div key={i.id} className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="aspect-video bg-muted">
                {i.kind === "image" ? (
                  <img src={resolveMediaUrl(i)} alt={i.alt?.[lang] ?? i.filename} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Film className="h-7 w-7 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between gap-2 p-2">
                <span className="truncate text-xs text-muted-foreground">{i.filename}</span>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(t("admin.media.confirmDelete"))) void removeFromLibrary(i.id);
                  }}
                  className="shrink-0 rounded-lg p-1 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
