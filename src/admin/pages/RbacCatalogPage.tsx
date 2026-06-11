// RBAC / Platform — module & submodule catalog CRUD (contract P6-P12).
// Each submodule also shows its available-action chips (submodule_actions);
// the chips are edited on the action-matrix page (P17/P18).

import { useState, type FormEvent } from "react";
import { ChevronDown, Loader2, Package, Pencil, Plus, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Modal, PageHeader } from "@/components/admin/PageHeader";
import { PlatformAdminGate } from "@/admin/rbac/PlatformAdminGate";
import {
  useCreateModule,
  useCreateSubmodule,
  useDeleteModule,
  useDeleteSubmodule,
  useModuleCatalog,
  useUpdateModule,
  useUpdateSubmodule,
} from "@/services/platform-rbac.service";
import type {
  CatalogModule,
  CatalogSubmodule,
  ModuleUpsertBody,
  SubmoduleUpsertBody,
} from "@/types/platform-rbac";
import {
  btnGhostCls,
  btnPrimaryCls,
  EmptyState,
  ErrorState,
  Field,
  inputCls,
  LoadingState,
  StateBadge,
  Toggle,
} from "@/admin/rbac/widgets";

type ModuleModal = { mode: "create" } | { mode: "edit"; module: CatalogModule };
type SubmoduleModal =
  | { mode: "create"; moduleId: string }
  | { mode: "edit"; submodule: CatalogSubmodule };

function CatalogScreen() {
  const { t } = useLanguage();
  const { data: catalog, isLoading, isError, error } = useModuleCatalog();

  const createModule = useCreateModule();
  const updateModule = useUpdateModule();
  const deleteModule = useDeleteModule();
  const createSubmodule = useCreateSubmodule();
  const updateSubmodule = useUpdateSubmodule();
  const deleteSubmodule = useDeleteSubmodule();

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [moduleModal, setModuleModal] = useState<ModuleModal | null>(null);
  const [submoduleModal, setSubmoduleModal] = useState<SubmoduleModal | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

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

  const busy =
    createModule.isPending ||
    updateModule.isPending ||
    deleteModule.isPending ||
    createSubmodule.isPending ||
    updateSubmodule.isPending ||
    deleteSubmodule.isPending;

  const modules = (catalog ?? [])
    .slice()
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  return (
    <div>
      <PageHeader
        title={t("admin.rbac.catalog.title")}
        description={t("admin.rbac.catalog.subtitle")}
        actions={
          <button
            type="button"
            className={btnPrimaryCls}
            disabled={busy}
            onClick={() => setModuleModal({ mode: "create" })}
          >
            <Plus className="h-4 w-4" />
            {t("admin.rbac.catalog.newModule")}
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

      {!isLoading && !isError && modules.length === 0 && (
        <EmptyState
          icon={<Package className="h-7 w-7 text-muted-foreground" />}
          label={t("admin.rbac.common.empty")}
        />
      )}

      {!isLoading && !isError && modules.length > 0 && (
        <div className="space-y-3">
          {modules.map((mod) => (
            <div key={mod.id} className="rounded-2xl border border-border bg-card">
              <div className="flex flex-wrap items-center gap-3 px-5 py-4">
                <button
                  type="button"
                  onClick={() =>
                    setExpanded((prev) => ({ ...prev, [mod.id]: !prev[mod.id] }))
                  }
                  className="inline-flex items-center gap-2 text-sm font-semibold text-foreground"
                >
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform ${
                      expanded[mod.id] ? "" : "-rotate-90"
                    }`}
                  />
                  {mod.displayName}
                  <code className="text-xs font-normal text-muted-foreground">{mod.name}</code>
                </button>
                <StateBadge tone={mod.isActive ? "ok" : "muted"}>
                  {mod.isActive ? t("admin.rbac.common.active") : t("admin.rbac.common.inactive")}
                </StateBadge>
                <span className="text-xs text-muted-foreground">
                  {mod.submodules.length} {t("admin.rbac.catalog.submodulesCount")}
                </span>

                <div className="ml-auto flex items-center gap-2">
                  <div className="mr-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{t("admin.rbac.common.active")}</span>
                    <Toggle
                      checked={mod.isActive}
                      disabled={busy}
                      label={t("admin.rbac.common.active")}
                      onChange={(isActive) =>
                        void run(() =>
                          updateModule.mutateAsync({ moduleId: mod.id, body: { isActive } }),
                        )
                      }
                    />
                  </div>
                  <button
                    type="button"
                    className={btnGhostCls}
                    disabled={busy}
                    onClick={() => setModuleModal({ mode: "edit", module: mod })}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    {t("admin.rbac.common.edit")}
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm text-destructive hover:bg-destructive/10 disabled:opacity-50"
                    disabled={busy}
                    onClick={() => {
                      if (!confirm(t("admin.rbac.catalog.confirmDeleteModule"))) return;
                      void run(() => deleteModule.mutateAsync(mod.id));
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {expanded[mod.id] && (
                <div className="border-t border-border px-5 py-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {t("admin.rbac.orgDetail.submodules")}
                    </h4>
                    <button
                      type="button"
                      className={btnGhostCls}
                      disabled={busy}
                      onClick={() => setSubmoduleModal({ mode: "create", moduleId: mod.id })}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      {t("admin.rbac.catalog.newSubmodule")}
                    </button>
                  </div>

                  {mod.submodules.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{t("admin.rbac.common.empty")}</p>
                  ) : (
                    <div className="space-y-2">
                      {mod.submodules
                        .slice()
                        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
                        .map((sub) => (
                          <div
                            key={sub.id}
                            className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-background px-4 py-2.5"
                          >
                            <div className="min-w-[160px]">
                              <span className="text-sm font-medium text-foreground">
                                {sub.displayName}
                              </span>{" "}
                              <code className="text-xs text-muted-foreground">{sub.name}</code>
                            </div>
                            <StateBadge tone={sub.isActive ? "ok" : "muted"}>
                              {sub.isActive
                                ? t("admin.rbac.common.active")
                                : t("admin.rbac.common.inactive")}
                            </StateBadge>
                            <div className="flex flex-wrap items-center gap-1.5">
                              {sub.actions.length === 0 ? (
                                <span
                                  className="text-xs text-muted-foreground"
                                  title={t("admin.rbac.catalog.editInMatrix")}
                                >
                                  {t("admin.rbac.catalog.noActions")}
                                </span>
                              ) : (
                                sub.actions.map((action) => (
                                  <span
                                    key={action.id}
                                    title={t("admin.rbac.catalog.editInMatrix")}
                                    className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary"
                                  >
                                    {action.name}
                                  </span>
                                ))
                              )}
                            </div>
                            <div className="ml-auto flex items-center gap-2">
                              <button
                                type="button"
                                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border px-2.5 text-xs text-foreground hover:bg-muted disabled:opacity-50"
                                disabled={busy}
                                onClick={() => setSubmoduleModal({ mode: "edit", submodule: sub })}
                              >
                                <Pencil className="h-3 w-3" />
                                {t("admin.rbac.common.edit")}
                              </button>
                              <button
                                type="button"
                                className="inline-flex h-8 items-center rounded-lg border border-border px-2.5 text-xs text-destructive hover:bg-destructive/10 disabled:opacity-50"
                                disabled={busy}
                                onClick={() => {
                                  if (!confirm(t("admin.rbac.catalog.confirmDeleteSubmodule")))
                                    return;
                                  void run(() => deleteSubmodule.mutateAsync(sub.id));
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {moduleModal && (
        <ModuleFormModal
          state={moduleModal}
          busy={busy}
          onClose={() => setModuleModal(null)}
          onSubmit={async (body) => {
            const ok = await run(() =>
              moduleModal.mode === "create"
                ? createModule.mutateAsync(body)
                : updateModule.mutateAsync({ moduleId: moduleModal.module.id, body }),
            );
            if (ok) setModuleModal(null);
          }}
        />
      )}

      {submoduleModal && (
        <SubmoduleFormModal
          state={submoduleModal}
          busy={busy}
          onClose={() => setSubmoduleModal(null)}
          onSubmit={async (body) => {
            const ok = await run(() =>
              submoduleModal.mode === "create"
                ? createSubmodule.mutateAsync({ moduleId: submoduleModal.moduleId, body })
                : updateSubmodule.mutateAsync({
                    submoduleId: submoduleModal.submodule.id,
                    body,
                  }),
            );
            if (ok) setSubmoduleModal(null);
          }}
        />
      )}
    </div>
  );
}

function ModuleFormModal({
  state,
  busy,
  onClose,
  onSubmit,
}: {
  state: ModuleModal;
  busy: boolean;
  onClose: () => void;
  onSubmit: (body: ModuleUpsertBody) => Promise<void>;
}) {
  const { t } = useLanguage();
  const editing = state.mode === "edit" ? state.module : null;
  const [name, setName] = useState(editing?.name ?? "");
  const [displayName, setDisplayName] = useState(editing?.displayName ?? "");
  const [description, setDescription] = useState(editing?.description ?? "");
  const [icon, setIcon] = useState(editing?.icon ?? "");
  const [isActive, setIsActive] = useState(editing?.isActive ?? true);
  const [sortOrder, setSortOrder] = useState(String(editing?.sortOrder ?? 0));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void onSubmit({
      name: name.trim(),
      displayName: displayName.trim(),
      description: description.trim() || undefined,
      icon: icon.trim() || undefined,
      isActive,
      sortOrder: Number(sortOrder) || 0,
    });
  };

  return (
    <Modal
      title={editing ? t("admin.rbac.catalog.editModule") : t("admin.rbac.catalog.newModule")}
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
        <div className="grid grid-cols-2 gap-4">
          <Field label={t("admin.rbac.catalog.icon")}>
            <input value={icon} onChange={(e) => setIcon(e.target.value)} className={inputCls} />
          </Field>
          <Field label={t("admin.rbac.catalog.sortOrder")}>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>
        <div className="flex items-center gap-2 text-sm text-foreground">
          <Toggle checked={isActive} onChange={setIsActive} label={t("admin.rbac.common.active")} />
          <span>{t("admin.rbac.common.active")}</span>
        </div>
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

function SubmoduleFormModal({
  state,
  busy,
  onClose,
  onSubmit,
}: {
  state: SubmoduleModal;
  busy: boolean;
  onClose: () => void;
  onSubmit: (body: SubmoduleUpsertBody) => Promise<void>;
}) {
  const { t } = useLanguage();
  const editing = state.mode === "edit" ? state.submodule : null;
  const [name, setName] = useState(editing?.name ?? "");
  const [displayName, setDisplayName] = useState(editing?.displayName ?? "");
  const [description, setDescription] = useState(editing?.description ?? "");
  const [isActive, setIsActive] = useState(editing?.isActive ?? true);
  const [sortOrder, setSortOrder] = useState(String(editing?.sortOrder ?? 0));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void onSubmit({
      name: name.trim(),
      displayName: displayName.trim(),
      description: description.trim() || undefined,
      isActive,
      sortOrder: Number(sortOrder) || 0,
    });
  };

  return (
    <Modal
      title={
        editing ? t("admin.rbac.catalog.editSubmodule") : t("admin.rbac.catalog.newSubmodule")
      }
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
        <Field label={t("admin.rbac.catalog.sortOrder")}>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className={inputCls}
          />
        </Field>
        <div className="flex items-center gap-2 text-sm text-foreground">
          <Toggle checked={isActive} onChange={setIsActive} label={t("admin.rbac.common.active")} />
          <span>{t("admin.rbac.common.active")}</span>
        </div>
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

export default function RbacCatalogPage() {
  return (
    <PlatformAdminGate>
      <CatalogScreen />
    </PlatformAdminGate>
  );
}
