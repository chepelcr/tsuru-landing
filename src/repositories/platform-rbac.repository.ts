// Data access for the platform RBAC admin section — one typed function per
// contract endpoint (P1-P18 of docs/roadmap/rbac_express_contract.md) plus the
// user-profile read the auth gate needs. Only imported from the gated admin
// tree, so it never reaches the public bundle.

import { adminRequest, toQuery } from "@/lib/admin-api";
import type {
  ActionUpsertBody,
  AdminOrgListResponse,
  ApplyDefaultsResponse,
  CatalogModule,
  MessageResponse,
  ModuleUpsertBody,
  OrgModuleState,
  OrgSubmoduleState,
  PlatformUserProfile,
  RbacAction,
  RbacModule,
  RbacSubmodule,
  SubmoduleUpsertBody,
} from "@/types/platform-rbac";

// ---- Gate (user-scoped, NOT /api/admin) ----

export function getUserProfile(userId: string): Promise<PlatformUserProfile> {
  return adminRequest("GET", `/api/users/${userId}/profile`);
}

// ---- Org assignment (P1-P5) ----

export function listOrganizations(params: {
  search?: string;
  page?: number;
  pageSize?: number;
  isActive?: boolean;
}): Promise<AdminOrgListResponse> {
  return adminRequest("GET", `/api/admin/organizations${toQuery(params)}`);
}

export function getOrgModules(orgId: string): Promise<OrgModuleState[]> {
  return adminRequest("GET", `/api/admin/organizations/${orgId}/modules`);
}

export function setOrgModule(
  orgId: string,
  moduleId: string,
  body: { assigned: boolean; isEnabled?: boolean },
): Promise<OrgModuleState> {
  return adminRequest("PUT", `/api/admin/organizations/${orgId}/modules/${moduleId}`, body);
}

export function setOrgSubmoduleOverride(
  orgId: string,
  submoduleId: string,
  isEnabled: boolean | null,
): Promise<OrgSubmoduleState> {
  return adminRequest("PUT", `/api/admin/organizations/${orgId}/submodules/${submoduleId}`, {
    isEnabled,
  });
}

export function applyDefaultModules(orgId: string): Promise<ApplyDefaultsResponse> {
  return adminRequest("POST", `/api/admin/organizations/${orgId}/modules/apply-defaults`);
}

// ---- Catalog: modules (P6-P9) ----

export function getModuleCatalog(includeInactive = true): Promise<CatalogModule[]> {
  return adminRequest("GET", `/api/admin/rbac/modules${toQuery({ includeInactive })}`);
}

export function createModule(body: ModuleUpsertBody): Promise<RbacModule> {
  return adminRequest("POST", "/api/admin/rbac/modules", body);
}

export function updateModule(moduleId: string, body: Partial<ModuleUpsertBody>): Promise<RbacModule> {
  return adminRequest("PUT", `/api/admin/rbac/modules/${moduleId}`, body);
}

export function deleteModule(moduleId: string): Promise<MessageResponse> {
  return adminRequest("DELETE", `/api/admin/rbac/modules/${moduleId}`);
}

// ---- Catalog: submodules (P10-P12) ----

export function createSubmodule(
  moduleId: string,
  body: SubmoduleUpsertBody,
): Promise<RbacSubmodule> {
  return adminRequest("POST", `/api/admin/rbac/modules/${moduleId}/submodules`, body);
}

export function updateSubmodule(
  submoduleId: string,
  body: Partial<SubmoduleUpsertBody>,
): Promise<RbacSubmodule> {
  return adminRequest("PUT", `/api/admin/rbac/submodules/${submoduleId}`, body);
}

export function deleteSubmodule(submoduleId: string): Promise<MessageResponse> {
  return adminRequest("DELETE", `/api/admin/rbac/submodules/${submoduleId}`);
}

// ---- Catalog: actions (P13-P16) ----

export function listActions(): Promise<RbacAction[]> {
  return adminRequest("GET", "/api/admin/rbac/actions");
}

export function createAction(body: ActionUpsertBody): Promise<RbacAction> {
  return adminRequest("POST", "/api/admin/rbac/actions", body);
}

export function updateAction(actionId: string, body: Partial<ActionUpsertBody>): Promise<RbacAction> {
  return adminRequest("PUT", `/api/admin/rbac/actions/${actionId}`, body);
}

export function deleteAction(actionId: string): Promise<MessageResponse> {
  return adminRequest("DELETE", `/api/admin/rbac/actions/${actionId}`);
}

// ---- Submodule-actions availability matrix (P17-P18) ----

export function getSubmoduleActions(submoduleId: string): Promise<RbacAction[]> {
  return adminRequest("GET", `/api/admin/rbac/submodules/${submoduleId}/actions`);
}

export function setSubmoduleActions(
  submoduleId: string,
  actionIds: string[],
): Promise<{ message: string; count: number }> {
  return adminRequest("PUT", `/api/admin/rbac/submodules/${submoduleId}/actions`, { actionIds });
}
