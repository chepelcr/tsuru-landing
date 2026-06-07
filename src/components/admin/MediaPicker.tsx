// The reusable asset field. Stores a single string ref (root-relative path for
// local, absolute url for external). The modal has an Add card (upload dropzone
// + URL add) and a gallery grid filtered by kinds, with the current ref
// ring-highlighted. All chrome via t().

import { useRef, useState, type DragEvent } from "react";
import { ImageIcon, Upload, Film } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAdminStore } from "@/lib/admin-store";
import { resolveAssetUrl, resolveMediaUrl, mediaRef, type MediaKind } from "@/lib/media";
import { uploadToLibrary, addExternalToLibrary } from "@/lib/media-upload";
import { Modal } from "@/components/admin/PageHeader";
import { inputCls, labelCls } from "@/components/admin/AdminUI";

interface Props {
  value: string;
  onChange: (ref: string) => void;
  label?: string;
  kinds?: MediaKind[];
}

function Thumb({ src, kind }: { src: string; kind: MediaKind }) {
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
      {src && kind === "image" ? (
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : kind === "video" ? (
        <Film className="h-5 w-5 text-muted-foreground" />
      ) : (
        <ImageIcon className="h-5 w-5 text-muted-foreground" />
      )}
    </div>
  );
}

export function MediaPicker({ value, onChange, label, kinds = ["image"] }: Props) {
  const { t } = useLanguage();
  const media = useAdminStore((s) => s.media);
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const primaryKind = kinds[0] ?? "image";
  const items = media.items.filter((i) => kinds.includes(i.kind));

  const choose = (ref: string) => {
    onChange(ref);
    setOpen(false);
    setHint("");
  };

  async function onUpload(file: File) {
    setBusy(true);
    setHint("");
    const item = await uploadToLibrary(file);
    setBusy(false);
    if (item) choose(mediaRef(item));
    else setHint(t("admin.media.devServerHint"));
  }

  async function onAddUrl() {
    if (!url.trim()) return;
    const item = await addExternalToLibrary(url.trim(), primaryKind);
    setUrl("");
    choose(mediaRef(item));
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) void onUpload(f);
  };

  return (
    <div>
      {label && <label className={labelCls}>{label}</label>}
      <div className="flex items-center gap-3">
        <Thumb src={resolveAssetUrl(value)} kind={primaryKind} />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="h-10 shrink-0 rounded-xl bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {value ? t("admin.media.change") : t("admin.media.select")}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="h-10 shrink-0 rounded-xl border border-border px-3 text-sm text-muted-foreground hover:text-foreground"
          >
            {t("admin.media.clear")}
          </button>
        )}
        <input
          className={inputCls}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/media/… · https://…"
        />
      </div>

      {open && (
        <Modal title={t("admin.media.libraryTitle")} onClose={() => setOpen(false)} maxWidth="max-w-3xl">
          {/* Add card */}
          <div className="space-y-3 rounded-xl border border-border bg-background/40 p-4">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border py-6 text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
            >
              <Upload className="h-6 w-6" />
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
              <input
                className={inputCls}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={t("admin.media.urlPlaceholder")}
              />
              <button
                type="button"
                onClick={onAddUrl}
                className="h-10 shrink-0 rounded-xl border border-border px-4 text-sm font-medium text-foreground hover:bg-muted"
              >
                {t("admin.media.addUrl")}
              </button>
            </div>
            {hint && <p className="text-xs text-warning">{hint}</p>}
          </div>

          {/* Gallery */}
          {items.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">{t("admin.media.empty")}</p>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {items.map((i) => {
                const ref = mediaRef(i);
                return (
                  <button
                    key={i.id}
                    type="button"
                    onClick={() => choose(ref)}
                    className={`aspect-square overflow-hidden rounded-lg border border-border bg-muted ${
                      ref === value ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    {i.kind === "image" ? (
                      <img
                        src={resolveMediaUrl(i)}
                        alt={i.alt?.es ?? i.filename}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Film className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
