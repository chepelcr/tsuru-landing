// DTO vocabulary for the platform RBAC admin section (BE-connected).
// Mirrors the contract in docs/roadmap/rbac_express_contract.md (monorepo):
// /api/admin endpoints P1-P18 served by the Express server (markets-api),
// guarded server-side by requirePlatformAdmin (users.role === 'platform_admin').

// ---- Catalog primitives (match server/src/entities/{Module,Submodule,Action}.ts) ----

export interface RbacModule {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  icon: string | null;
  isActive: boolean;
  sortOrder: number | null;
}

export interface RbacSubmodule {
  id: string;
  moduleId: string;
  name: string;
  displayName: string;
  description: string | null;
  isActive: boolean;
  sortOrder: number | null;
}

export interface RbacAction {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
}

// P6 — full catalog with each submodule's available actions (submodule_actions).
export interface CatalogSubmodule extends RbacSubmodule {
  actions: RbacAction[];
}
export interface CatalogModule extends RbacModule {
  submodules: CatalogSubmodule[];
}

// ---- Org assignment (P1-P5) ----

export interface AdminOrgListItem {
  id: string;
  name: string;
  slug: string;
  subdomain: string | null;
  plan: string | null;
  isActive: boolean;
  onboardingStep: number | null;
  createdAt: string;
  moduleCount: number;
}

export interface AdminOrgListResponse {
  items: AdminOrgListItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface OrgSubmoduleState {
  submodule: RbacSubmodule;
  /** V1 effective availability as computed by the backend. */
  effectiveEnabled: boolean;
  /** Raw organization_submodules.is_enabled, or null when no override row (inherit). */
  override: boolean | null;
}

export interface OrgModuleState {
  module: RbacModule;
  assigned: boolean;
  isEnabled: boolean;
  assignedBy: string | null;
  assignedAt: string | null;
  submodules: OrgSubmoduleState[];
}

// ---- Request bodies ----

export interface ModuleUpsertBody {
  name: string;
  displayName: string;
  description?: string;
  icon?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface SubmoduleUpsertBody {
  name: string;
  displayName: string;
  description?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface ActionUpsertBody {
  name: string;
  displayName: string;
  description?: string;
}

// ---- Misc ----

export interface MessageResponse {
  message: string;
}

export interface ApplyDefaultsResponse {
  added: string[];
}

/** GET /api/users/:userId/profile — used by the gate to verify platform_admin. */
export interface PlatformUserProfile {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  isActive?: boolean;
}
