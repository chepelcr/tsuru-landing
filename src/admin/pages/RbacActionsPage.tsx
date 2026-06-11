// RBAC / Platform — global action catalog CRUD (contract P13-P16).

import { useState, type FormEvent } from "react";
import { ClipboardList, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Modal, PageHeader } from "@/components/admin/PageHeader";
import { PlatformAdminGate } from "@/admin/rbac/PlatformAdminGate";
import {
  useCreateAction,
  useDeleteAction,
  useRbacActions,
  useUpdateAction,
} from "@/services/platform-rbac.service";
import type { ActionUpsertBody, RbacAction } from "@/types/platform-rbac";
import {
  btnGhostCls,
  btnPrimaryCls,
  EmptyState,
  ErrorState,
  Field,
  inputCls,
  LoadingState,
} from "@/admin/rbac/widgets";

type ActionModal = { mode: "create" } | { mode: "edit"; action: RbacAction };

function ActionsScreen() {
  const { t } = useLanguage();
  const { data: actions, isLoading, isError, error } = useRbacActions();

  const createAction = useCreateAction();
  const updateAction = useUpdateAction();
  const deleteAction = useDeleteAction();

  const [modal, setModal] = useState<ActionModal | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const busy = createAction.isPending || updateAction.isPending || deleteAction.isPending;

  const run = async (fn: () => Promise<unknown>) => {
    setActionError(null);
    try {
      await fn();
      return true;
    } catch (err) {
      setActionError(err instanceof Error ? err.message : t("admin.rbac.common.error"));
      return false;
    }
  };

  return (
    <div>
      <PageHeader
        title={t("admin.rbac.actions.title")}
        description={t("admin.rbac.actions.subtitle")}
        actions={
          <button
            type="button"
            className={btnPrimaryCls}
            disabled={busy}
            onClick={() => setModal({ mode: "create" })}
          >
            <Plus className="h-4 w-4" />
            {t("admin.rbac.actions.newAction")}
          </button>
        }
      />

      {actionError && (
        <div className="mb-5 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {actionError}
        </div>
      )}

      {isLoading && <LoadingState label={t("admin.rbac.common.loading")} />}
      {isError && (
        <ErrorState
          message={error instanceof Error ? error.message : t("admin.rbac.common.error")}
        />
      )}

      {!isLoading && !isError && actions && actions.length === 0 && (
        <EmptyState
          icon={<ClipboardList className="h-7 w-7 text-muted-foreground" />}
          label={t("admin.rbac.common.empty")}
        />
      )}

      {!isLoading && !isError && actions && actions.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3">{t("admin.rbac.common.name")}</th>
                <th className="px-5 py-3">{t("admin.rbac.common.displayName")}</th>
                <th className="px-5 py-3">{t("admin.rbac.common.description")}</th>
                <th className="px-5 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {actions.map((action) => (
                <tr key={action.id} className="hover:bg-muted/40">
                  <td className="px-5 py-3">
                    <code className="text-xs text-foreground">{action.name}</code>
                  </td>
                  <td className="px-5 py-3 font-medium text-foreground">{action.displayName}</td>
                  <td className="px-5 py-3 text-muted-foreground">{action.description ?? "—"}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border px-2.5 text-xs text-foreground hover:bg-muted disabled:opacity-50"
                        disabled={busy}
                        onClick={() => setModal({ mode: "edit", action })}
                      >
                        <Pencil className="h-3 w-3" />
                        {t("admin.rbac.common.edit")}
                      </button>
                      <button
                        type="button"
                        className="inline-flex h-8 items-center rounded-lg border border-border px-2.5 text-xs text-destructive hover:bg-destructive/10 disabled:opacity-50"
                        disabled={busy}
                        onClick={() => {
                          if (!confirm(t("admin.rbac.actions.confirmDelete"))) return;
                          void run(() => deleteAction.mutateAsync(action.id));
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <ActionFormModal
          state={modal}
          busy={busy}
          onClose={() => setModal(null)}
          onSubmit={async (body) => {
            const ok = await run(() =>
              modal.mode === "create"
                ? createAction.mutateAsync(body)
                : updateAction.mutateAsync({ actionId: modal.action.id, body }),
            );
            if (ok) setModal(null);
          }}
        />
      )}
    </div>
  );
}

function ActionFormModal({
  state,
  busy,
  onClose,
  onSubmit,
}: {
  state: ActionModal;
  busy: boolean;
  onClose: () => void;
  onSubmit: (body: ActionUpsertBody) => Promise<void>;
}) {
  const { t } = useLanguage();
  const editing = state.mode === "edit" ? state.action : null;
  const [name, setName] = useState(editing?.name ?? "");
  const [displayName, setDisplayName] = useState(editing?.displayName ?? "");
  const [description, setDescription] = useState(editing?.description ?? "");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void onSubmit({
      name: name.trim(),
      displayName: displayName.trim(),
      description: description.trim() || undefined,
    });
  };

  return (
    <Modal
      title={editing ? t("admin.rbac.actions.editAction") : t("admin.rbac.actions.newAction")}
      onClose={onClose}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label={t("admin.rbac.common.name")}>
          <input required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
        </Field>
        <Field label={t("admin.rbac.common.displayName")}>
          <input
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label={t("admin.rbac.common.description")}>
          <input value={description} onChange={(e) => setDescription(e.target.value)} className={inputCls} />
        </Field>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className={btnGhostCls} onClick={onClose}>
            {t("admin.rbac.common.cancel")}
          </button>
          <button type="submit" className={btnPrimaryCls} disabled={busy}>
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {t("admin.rbac.common.save")}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function RbacActionsPage() {
  return (
    <PlatformAdminGate>
      <ActionsScreen />
    </PlatformAdminGate>
  );
}
