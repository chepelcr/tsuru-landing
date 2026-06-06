// PageHeader + Modal + FloatingSaveButton + UnsavedChangesModal.
//
// PageHeader registers { dirty, save, filename } with the admin-ui store for the
// open editor and renders the floating Save FAB while dirty/saving/saved. The
// hand-rolled Modal is the admin overlay convention. UnsavedChangesModal reads
// the nav guard state and offers keep/discard/save.

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation } from "wouter";
import { Check, Save, AlertTriangle, X, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAdminStore, useEntityDirty } from "@/lib/admin-store";
import { useAdminUi } from "@/lib/admin-ui";

export function PageHeader({
  title,
  description,
  actions,
  entity,
  value,
  onSave,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  /** Tracked filename; omit for read-only pages. */
  entity?: string;
  value?: unknown;
  onSave?: () => Promise<void>;
}) {
  const { t } = useLanguage();
  const setEditor = useAdminUi((s) => s.setEditor);
  const clearEditor = useAdminUi((s) => s.clearEditor);
  const tracked = !!entity && !!onSave;
  const computedDirty = useEntityDirty(entity ?? "__untracked", value);
  const dirty = tracked ? computedDirty : false;

  const saveRef = useRef(onSave);
  saveRef.current = onSave;

  useEffect(() => {
    if (!tracked) return;
    setEditor({
      dirty,
      filename: entity!,
      save: async () => {
        await saveRef.current?.();
      },
    });
    return () => clearEditor();
  }, [tracked, dirty, entity, setEditor, clearEditor]);

  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="flex items-center gap-2">{actions}</div>
      {tracked && (
        <FloatingSaveButton
          dirty={dirty}
          save={async () => {
            await saveRef.current?.();
          }}
          saveLabel={t("admin.common.save")}
          savedLabel={t("admin.common.saved")}
        />
      )}
    </div>
  );
}

export function FloatingSaveButton({
  dirty,
  save,
  saveLabel,
  savedLabel,
}: {
  dirty: boolean;
  save: () => Promise<void>;
  saveLabel: string;
  savedLabel: string;
}) {
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  useEffect(() => {
    if (dirty) setState("idle");
  }, [dirty]);
  if (!dirty && state !== "saved" && state !== "saving") return null;

  const handle = async () => {
    setState("saving");
    await save();
    setState("saved");
    setTimeout(() => setState("idle"), 2000);
  };

  const saved = state === "saved";
  return (
    <button
      type="button"
      onClick={handle}
      title={saved ? savedLabel : saveLabel}
      className={`fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-colors ${
        saved ? "bg-emerald-600" : "bg-primary hover:bg-primary/90"
      }`}
    >
      {state === "saving" ? (
        <Loader2 className="h-6 w-6 animate-spin" />
      ) : saved ? (
        <Check className="h-6 w-6" />
      ) : (
        <Save className="h-6 w-6" />
      )}
    </button>
  );
}

export function Modal({
  title,
  children,
  footer,
  onClose,
  maxWidth = "max-w-2xl",
}: {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
  maxWidth?: string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className={`max-h-[90vh] w-full ${maxWidth} overflow-y-auto rounded-2xl bg-card p-6 shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4">{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

export function UnsavedChangesModal() {
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const navTarget = useAdminUi((s) => s.navTarget);
  const save = useAdminUi((s) => s.save);
  const filename = useAdminUi((s) => s.filename);
  const closeNav = useAdminUi((s) => s.closeNav);
  const clearEditor = useAdminUi((s) => s.clearEditor);
  const discardEntity = useAdminStore((s) => s.discardEntity);

  if (!navTarget) return null;

  const go = () => {
    const target = navTarget;
    closeNav();
    if (target.startsWith("/admin")) navigate(target);
    else window.location.href = target;
  };

  return (
    <Modal title={t("admin.unsaved.title")} onClose={closeNav} maxWidth="max-w-md">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-amber-500" />
        <p className="text-sm text-muted-foreground">{t("admin.unsaved.body")}</p>
      </div>
      <div className="mt-6 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={closeNav}
          className="h-9 rounded-lg border border-border px-4 text-sm font-medium text-foreground hover:bg-muted"
        >
          {t("admin.unsaved.keep")}
        </button>
        <button
          type="button"
          onClick={() => {
            if (filename) discardEntity(filename);
            clearEditor();
            go();
          }}
          className="h-9 rounded-lg bg-destructive px-4 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
        >
          {t("admin.unsaved.discard")}
        </button>
        <button
          type="button"
          onClick={async () => {
            await save?.();
            clearEditor();
            go();
          }}
          className="h-9 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {t("admin.unsaved.save")}
        </button>
      </div>
    </Modal>
  );
}
