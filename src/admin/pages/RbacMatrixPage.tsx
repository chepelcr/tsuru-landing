// RBAC / Platform — submodule-actions availability matrix (contract P17/P18).
// Rows: submodules grouped by module (from P6). Columns: the action catalog
// (P13). A checked cell means the action is grantable on that submodule
// (submodule_actions). Edits are local until "Save changes" bulk-replaces each
// dirty submodule's action set via P18.

import { useMemo, useState } from "react";
import { Info, Loader2, Network, RotateCcw, Save } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader } from "@/components/admin/PageHeader";
import { PlatformAdminGate } from "@/admin/rbac/PlatformAdminGate";
import {
  useModuleCatalog,
  useRbacActions,
  useSetSubmoduleActions,
} from "@/services/platform-rbac.service";
import {
  btnGhostCls,
  btnPrimaryCls,
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/admin/rbac/widgets";

function sameSet(a: Set<string>, b: Set<string>): boolean {
  if (a.size !== b.size) return false;
  for (const v of a) if (!b.has(v)) return false;
  return true;
}

function MatrixScreen() {
  const { t } = useLanguage();
  const catalogQuery = useModuleCatalog();
  const actionsQuery = useRbacActions();
  const setSubmoduleActions = useSetSubmoduleActions();

  // Local edits: submoduleId → selected actionIds. Absent = untouched (server value).
  const [edits, setEdits] = useState<Record<string, Set<string>>>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  const serverSets = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    for (const mod of catalogQuery.data ?? []) {
      for (const sub of mod.submodules) {
        map[sub.id] = new Set(sub.actions.map((a) => a.id));
      }
    }
    return map;
  }, [catalogQuery.data]);

  const currentSet = (submoduleId: string): Set<string> =>
    edits[submoduleId] ?? serverSets[submoduleId] ?? new Set();

  const isDirty = (submoduleId: string): boolean => {
    const edited = edits[submoduleId];
    if (!edited) return false;
    return !sameSet(edited, serverSets[submoduleId] ?? new Set());
  };

  const dirtyIds = Object.keys(edits).filter(isDirty);

  const toggleCell = (submoduleId: string, actionId: string) => {
    setEdits((prev) => {
      const next = new Set(currentSet(submoduleId));
      if (next.has(actionId)) next.delete(actionId);
      else next.add(actionId);
      return { ...prev, [submoduleId]: next };
    });
  };

  const discard = () => {
    setEdits({});
    setSaveError(null);
  };

  const saveAll = async () => {
    setSaveError(null);
    setSaving(true);
    try {
      for (const submoduleId of dirtyIds) {
        await setSubmoduleActions.mutateAsync({
          submoduleId,
          actionIds: Array.from(edits[submoduleId]),
        });
      }
      setEdits({});
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : t("admin.rbac.common.error"));
    } finally {
      setSaving(false);
    }
  };

  const isLoading = catalogQuery.isLoading || actionsQuery.isLoading;
  const isError = catalogQuery.isError || actionsQuery.isError;
  const errorMessage =
    (catalogQuery.error instanceof Error && catalogQuery.error.message) ||
    (actionsQuery.error instanceof Error && actionsQuery.error.message) ||
    t("admin.rbac.common.error");

  const actions = (actionsQuery.data ?? []).slice().sort((a, b) => a.name.localeCompare(b.name));
  const modules = (catalogQuery.data ?? [])
    .slice()
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  return (
    <div>
      <PageHeader
        title={t("admin.rbac.matrix.title")}
        description={t("admin.rbac.matrix.subtitle")}
        actions={
          <div className="flex items-center gap-2">
            {dirtyIds.length > 0 && (
              <button type="button" className={btnGhostCls} disabled={saving} onClick={discard}>
                <RotateCcw className="h-4 w-4" />
                {t("admin.rbac.matrix.discard")}
              </button>
            )}
            <button
              type="button"
              className={btnPrimaryCls}
              disabled={saving || dirtyIds.length === 0}
              onClick={() => void saveAll()}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {savedFlash
                ? t("admin.rbac.matrix.saved")
                : `${t("admin.rbac.matrix.saveChanges")}${dirtyIds.length > 0 ? ` (${dirtyIds.length})` : ""}`}
            </button>
          </div>
        }
      />

      <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <span>{t("admin.rbac.matrix.note")}</span>
      </div>

      {saveError && (
        <div className="mb-5 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {saveError}
        </div>
      )}

      {isLoading && <LoadingState label={t("admin.rbac.common.loading")} />}
      {!isLoading && isError && <ErrorState message={errorMessage} />}

      {!isLoading && !isError && (modules.length === 0 || actions.length === 0) && (
        <EmptyState
          icon={<Network className="h-7 w-7 text-muted-foreground" />}
          label={t("admin.rbac.common.empty")}
        />
      )}

      {!isLoading && !isError && modules.length > 0 && actions.length > 0 && (
        <div className="space-y-6">
          {modules.map((mod) => (
            <div key={mod.id} className="overflow-x-auto rounded-2xl border border-border bg-card">
              <div className="border-b border-border px-5 py-3">
                <span className="text-sm font-semibold text-foreground">{mod.displayName}</span>{" "}
                <code className="text-xs text-muted-foreground">{mod.name}</code>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-2.5">{t("admin.rbac.matrix.colSubmodule")}</th>
                    {actions.map((action) => (
                      <th key={action.id} className="px-3 py-2.5 text-center" title={action.displayName}>
                        {action.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mod.submodules
                    .slice()
                    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
                    .map((sub) => {
                      const selected = currentSet(sub.id);
                      const dirty = isDirty(sub.id);
                      return (
                        <tr key={sub.id} className={dirty ? "bg-amber-500/5" : "hover:bg-muted/40"}>
                          <td className="px-5 py-2.5">
                            <span className="font-medium text-foreground">{sub.displayName}</span>
                            {dirty && (
                              <span
                                className="ml-2 inline-block h-2 w-2 rounded-full bg-amber-500 align-middle"
                                title={t("admin.rbac.matrix.unsaved")}
                              />
                            )}
                          </td>
                          {actions.map((action) => (
                            <td key={action.id} className="px-3 py-2.5 text-center">
                              <input
                                type="checkbox"
                                checked={selected.has(action.id)}
                                disabled={saving}
                                onChange={() => toggleCell(sub.id, action.id)}
                                aria-label={`${sub.name}:${action.name}`}
                                className="h-4 w-4 cursor-pointer accent-[hsl(var(--primary))]"
                              />
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  {mod.submodules.length === 0 && (
                    <tr>
                      <td
                        colSpan={actions.length + 1}
                        className="px-5 py-3 text-sm text-muted-foreground"
                      >
                        {t("admin.rbac.common.empty")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function RbacMatrixPage() {
  return (
    <PlatformAdminGate>
      <MatrixScreen />
    </PlatformAdminGate>
  );
}
