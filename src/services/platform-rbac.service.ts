// React Query orchestration over platform-rbac.repository — the service layer
// of the BE-connected RBAC admin section. Query keys all live under the
// "rbac-admin" root; every mutation invalidates the keys it can stale.
// Admin-tree only; tree-shaken out of normal prod builds.

import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import * as repo from "@/repositories/platform-rbac.repository";
import type {
  ActionUpsertBody,
  ModuleUpsertBody,
  SubmoduleUpsertBody,
} from "@/types/platform-rbac";

const ROOT = "rbac-admin";

export const rbacAdminKeys = {
  profile: (userId: string) => [ROOT, "profile", userId] as const,
  orgs: (params: { search: string; page: number; pageSize: number }) =>
    [ROOT, "orgs", params.search, params.page, params.pageSize] as const,
  orgItem: (orgId: string) => [ROOT, "org-item", orgId] as const,
  orgModules: (orgId: string) => [ROOT, "org-modules", orgId] as const,
  catalog: [ROOT, "catalog"] as const,
  actions: [ROOT, "actions"] as const,
};

// ---- Gate ----

export function usePlatformProfile(userId: string | null) {
  return useQuery({
    queryKey: rbacAdminKeys.profile(userId ?? "anonymous"),
    queryFn: () => repo.getUserProfile(userId!),
    enabled: !!userId,
    retry: false,
  });
}

// ---- Organizations (P1) ----

export function useAdminOrganizations(params: {
  search: string;
  page: number;
  pageSize: number;
}) {
  return useQuery({
    queryKey: rbacAdminKeys.orgs(params),
    queryFn: () =>
      repo.listOrganizations({
        search: params.search || undefined,
        page: params.page,
        pageSize: params.pageSize,
      }),
    placeholderData: keepPreviousData,
  });
}

// ---- Org module assignment (P2-P5) ----

export function useOrgModules(orgId: string) {
  return useQuery({
    queryKey: rbacAdminKeys.orgModules(orgId),
    queryFn: () => repo.getOrgModules(orgId),
  });
}

export function useSetOrgModule(orgId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { moduleId: string; assigned: boolean; isEnabled?: boolean }) =>
      repo.setOrgModule(orgId, vars.moduleId, {
        assigned: vars.assigned,
        isEnabled: vars.isEnabled,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: rbacAdminKeys.orgModules(orgId) });
      qc.invalidateQueries({ queryKey: [ROOT, "orgs"] }); // moduleCount changed
    },
  });
}

export function useSetOrgSubmoduleOverride(orgId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { submoduleId: string; isEnabled: boolean | null }) =>
      repo.setOrgSubmoduleOverride(orgId, vars.submoduleId, vars.isEnabled),
    onSuccess: () => qc.invalidateQueries({ queryKey: rbacAdminKeys.orgModules(orgId) }),
  });
}

export function useApplyDefaultModules(orgId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => repo.applyDefaultModules(orgId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: rbacAdminKeys.orgModules(orgId) });
      qc.invalidateQueries({ queryKey: [ROOT, "orgs"] });
    },
  });
}

// ---- Catalog (P6-P12) ----

export function useModuleCatalog() {
  return useQuery({
    queryKey: rbacAdminKeys.catalog,
    queryFn: () => repo.getModuleCatalog(true),
  });
}

function useInvalidateCatalog() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: rbacAdminKeys.catalog });
  };
}

export function useCreateModule() {
  const invalidate = useInvalidateCatalog();
  return useMutation({
    mutationFn: (body: ModuleUpsertBody) => repo.createModule(body),
    onSuccess: invalidate,
  });
}

export function useUpdateModule() {
  const invalidate = useInvalidateCatalog();
  return useMutation({
    mutationFn: (vars: { moduleId: string; body: Partial<ModuleUpsertBody> }) =>
      repo.updateModule(vars.moduleId, vars.body),
    onSuccess: invalidate,
  });
}

export function useDeleteModule() {
  const invalidate = useInvalidateCatalog();
  return useMutation({
    mutationFn: (moduleId: string) => repo.deleteModule(moduleId),
    onSuccess: invalidate,
  });
}

export function useCreateSubmodule() {
  const invalidate = useInvalidateCatalog();
  return useMutation({
    mutationFn: (vars: { moduleId: string; body: SubmoduleUpsertBody }) =>
      repo.createSubmodule(vars.moduleId, vars.body),
    onSuccess: invalidate,
  });
}

export function useUpdateSubmodule() {
  const invalidate = useInvalidateCatalog();
  return useMutation({
    mutationFn: (vars: { submoduleId: string; body: Partial<SubmoduleUpsertBody> }) =>
      repo.updateSubmodule(vars.submoduleId, vars.body),
    onSuccess: invalidate,
  });
}

export function useDeleteSubmodule() {
  const invalidate = useInvalidateCatalog();
  return useMutation({
    mutationFn: (submoduleId: string) => repo.deleteSubmodule(submoduleId),
    onSuccess: invalidate,
  });
}

// ---- Actions (P13-P16) ----

export function useRbacActions() {
  return useQuery({
    queryKey: rbacAdminKeys.actions,
    queryFn: () => repo.listActions(),
  });
}

function useInvalidateActions() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: rbacAdminKeys.actions });
    qc.invalidateQueries({ queryKey: rbacAdminKeys.catalog }); // chips show actions
  };
}

export function useCreateAction() {
  const invalidate = useInvalidateActions();
  return useMutation({
    mutationFn: (body: ActionUpsertBody) => repo.createAction(body),
    onSuccess: invalidate,
  });
}

export function useUpdateAction() {
  const invalidate = useInvalidateActions();
  return useMutation({
    mutationFn: (vars: { actionId: string; body: Partial<ActionUpsertBody> }) =>
      repo.updateAction(vars.actionId, vars.body),
    onSuccess: invalidate,
  });
}

export function useDeleteAction() {
  const invalidate = useInvalidateActions();
  return useMutation({
    mutationFn: (actionId: string) => repo.deleteAction(actionId),
    onSuccess: invalidate,
  });
}

// ---- Availability matrix (P18) ----

export function useSetSubmoduleActions() {
  const invalidate = useInvalidateCatalog();
  return useMutation({
    mutationFn: (vars: { submoduleId: string; actionIds: string[] }) =>
      repo.setSubmoduleActions(vars.submoduleId, vars.actionIds),
    onSuccess: invalidate,
  });
}
