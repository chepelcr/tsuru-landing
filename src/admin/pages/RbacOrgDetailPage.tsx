// RBAC / Platform — per-organization module assignment (contract P2-P5).
// Toggle assigned/enabled per module; expand a module to override submodules.
// Effective availability (V1) is shown per submodule:
//   module.isActive AND assigned AND isEnabled AND COALESCE(override, true).

import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ChevronDown, Info, Loader2, PackagePlus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader } from "@/components/admin/PageHeader";
import { PlatformAdminGate } from "@/admin/rbac/PlatformAdminGate";
import {
  rbacAdminKeys,
  useApplyDefaultModules,
  useOrgModules,
  useSetOrgModule,
  useSetOrgSubmoduleOverride,
} from "@/services/platform-rbac.service";
import type { AdminOrgListItem, OrgModuleState } from "@/types/platform-rbac";
import {
  btnPrimaryCls,
  ErrorState,
  LoadingState,
  StateBadge,
  Toggle,
} from "@/admin/rbac/widgets";

function OrgModulesScreen({ orgId }: { orgId: string }) {
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const org = queryClient.getQueryData<AdminOrgListItem>(rbacAdminKeys.orgItem(orgId));

  const { data: rows, isLoading, isError, error } = useOrgModules(orgId);
  const setModule = useSetOrgModule(orgId);
  const setOverride = useSetOrgSubmoduleOverride(orgId);
  const applyDefaults = useApplyDefaultModules(orgId);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [actionError, setActionError] = useState<string | null>(null);

  const run = async (fn: () => Promise<unknown>) => {
    setActionError(null);
    try {
      await fn();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : t("admin.rbac.common.error"));
    }
  };

  const busy = setModule.isPending || setOverride.isPending || applyDefaults.isPending;

  return (
    <div>
      <button
        type="button"
        onClick={() => navigate("/admin/rbac/organizations")}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("admin.rbac.orgDetail.back")}
      </button>

      <PageHeader
        title={org ? org.name : t("admin.rbac.orgDetail.title")}
        description={`${t("admin.rbac.orgDetail.subtitle")} — ${org ? org.slug : orgId}`}
        actions={
          <button
            type="button"
            className={btnPrimaryCls}
            disabled={busy}
            onClick={() => void run(() => applyDefaults.mutateAsync())}
          >
            {applyDefaults.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <PackagePlus className="h-4 w-4" />
            )}
            {t("admin.rbac.orgDetail.applyDefaults")}
          </button>
        }
      />

      <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <span>{t("admin.rbac.orgDetail.legend")}</span>
      </div>

      {applyDefaults.isSuccess && applyDefaults.data && (
        <div className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">
          {t("admin.rbac.orgDetail.applyDefaultsDone")}
          {applyDefaults.data.added.length > 0 && (
            <span className="ml-1 font-medium">{applyDefaults.data.added.join(", ")}</span>
          )}
        </div>
      )}

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

      {!isLoading && !isError && rows && (
        <div className="space-y-3">
          {rows.map((row) => (
            <ModuleCard
              key={row.module.id}
              row={row}
              expanded={!!expanded[row.module.id]}
              onToggleExpand={() =>
                setExpanded((prev) => ({ ...prev, [row.module.id]: !prev[row.module.id] }))
              }
              busy={busy}
              onSetAssigned={(assigned) =>
                void run(() =>
                  setModule.mutateAsync({
                    moduleId: row.module.id,
                    assigned,
                    isEnabled: assigned ? true : undefined,
                  }),
                )
              }
              onSetEnabled={(isEnabled) =>
                void run(() =>
                  setModule.mutateAsync({ moduleId: row.module.id, assigned: true, isEnabled }),
                )
              }
              onSetOverride={(submoduleId, isEnabled) =>
                void run(() => setOverride.mutateAsync({ submoduleId, isEnabled }))
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ModuleCard({
  row,
  expanded,
  onToggleExpand,
  busy,
  onSetAssigned,
  onSetEnabled,
  onSetOverride,
}: {
  row: OrgModuleState;
  expanded: boolean;
  onToggleExpand: () => void;
  busy: boolean;
  onSetAssigned: (assigned: boolean) => void;
  onSetEnabled: (isEnabled: boolean) => void;
  onSetOverride: (submoduleId: string, isEnabled: boolean | null) => void;
}) {
  const { t } = useLanguage();
  const moduleAvailable = row.module.isActive && row.assigned && row.isEnabled;

  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="flex flex-wrap items-center gap-3 px-5 py-4">
        <button
          type="button"
          onClick={onToggleExpand}
          className="inline-flex items-center gap-2 text-sm font-semibold text-foreground"
        >
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${expanded ? "" : "-rotate-90"}`}
          />
          {row.module.displayName}
          <code className="text-xs font-normal text-muted-foreground">{row.module.name}</code>
        </button>

        {!row.module.isActive && (
          <StateBadge tone="warn">{t("admin.rbac.orgDetail.inactiveCatalog")}</StateBadge>
        )}
        <StateBadge tone={moduleAvailable ? "ok" : "off"}>
          {moduleAvailable
            ? t("admin.rbac.orgDetail.available")
            : t("admin.rbac.orgDetail.unavailable")}
        </StateBadge>

        <div className="ml-auto flex flex-wrap items-center gap-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{t("admin.rbac.orgDetail.assigned")}</span>
            <Toggle
              checked={row.assigned}
              disabled={busy}
              onChange={onSetAssigned}
              label={t("admin.rbac.orgDetail.assigned")}
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{t("admin.rbac.orgDetail.enabled")}</span>
            <Toggle
              checked={row.assigned && row.isEnabled}
              disabled={busy || !row.assigned}
              onChange={onSetEnabled}
              label={t("admin.rbac.orgDetail.enabled")}
            />
          </div>
        </div>
      </div>

      {row.assigned && row.assignedAt && (
        <div className="border-t border-border px-5 py-2 text-xs text-muted-foreground">
          {t("admin.rbac.orgDetail.assignedAt")}: {new Date(row.assignedAt).toLocaleString()}
          {row.assignedBy && (
            <>
              {" · "}
              {t("admin.rbac.orgDetail.assignedBy")}: <code>{row.assignedBy}</code>
            </>
          )}
        </div>
      )}
      {!row.assigned && (
        <div className="border-t border-border px-5 py-2 text-xs text-muted-foreground">
          {t("admin.rbac.orgDetail.unassignWarning")}
        </div>
      )}

      {expanded && (
        <div className="border-t border-border px-5 py-4">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("admin.rbac.orgDetail.submodules")}
          </h4>
          {row.submodules.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("admin.rbac.common.empty")}</p>
          ) : (
            <div className="space-y-2">
              {row.submodules.map((sub) => {
                const effective = moduleAvailable && sub.effectiveEnabled;
                const overrideValue =
                  sub.override === null ? "inherit" : sub.override ? "on" : "off";
                return (
                  <div
                    key={sub.submodule.id}
                    className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-background px-4 py-2.5"
                  >
                    <div className="min-w-[160px]">
                      <span className="text-sm font-medium text-foreground">
                        {sub.submodule.displayName}
                      </span>{" "}
                      <code className="text-xs text-muted-foreground">{sub.submodule.name}</code>
                    </div>
                    <StateBadge tone={effective ? "ok" : "off"}>
                      {t("admin.rbac.orgDetail.effective")}:{" "}
                      {effective
                        ? t("admin.rbac.orgDetail.available")
                        : t("admin.rbac.orgDetail.unavailable")}
                    </StateBadge>
                    <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{t("admin.rbac.orgDetail.override")}</span>
                      <select
                        value={overrideValue}
                        disabled={busy || !row.assigned}
                        onChange={(e) => {
                          const v = e.target.value;
                          onSetOverride(
                            sub.submodule.id,
                            v === "inherit" ? null : v === "on",
                          );
                        }}
                        className="h-8 rounded-lg border border-border bg-background px-2 text-xs text-foreground outline-none focus:border-primary"
                      >
                        <option value="inherit">{t("admin.rbac.orgDetail.inherit")}</option>
                        <option value="on">{t("admin.rbac.orgDetail.overrideOn")}</option>
                        <option value="off">{t("admin.rbac.orgDetail.overrideOff")}</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function RbacOrgDetailPage() {
  const params = useParams<{ orgId: string }>();
  return (
    <PlatformAdminGate>
      <OrgModulesScreen orgId={params.orgId} />
    </PlatformAdminGate>
  );
}
