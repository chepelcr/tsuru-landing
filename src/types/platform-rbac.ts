// DTO vocabulary for the platform RBAC admin section (BE-connected).
// Mirrors the contract in docs/roadmap/rbac_express_contract.md (monorepo):
// /api/admin endpoints P1-P18 served by the Express server (markets-api),
// guarded server-side by requirePlatformAdmin (users.role === 'platform_admin').

// ---- Catalog primitives (match server/src/entities/{Module,Submodule,Action}.ts) ----

export interface RbacModule {
  id: string;
  name: string;
  display_name: string;
  description: string | null;
  icon: string | null;
  is_active: boolean;
  sort_order: number | null;
}

export interface RbacSubmodule {
  id: string;
  module_id: string;
  name: string;
  display_name: string;
  description: string | null;
  is_active: boolean;
  sort_order: number | null;
}

export interface RbacAction {
  id: string;
  name: string;
  display_name: string;
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
  is_active: boolean;
  onboarding_step: number | null;
  created_at: string;
  module_count: number;
}

export interface AdminOrgListResponse {
  items: AdminOrgListItem[];
  total: number;
  page: number;
  page_size: number;
}

export interface OrgSubmoduleState {
  submodule: RbacSubmodule;
  /** V1 effective availability as computed by the backend. */
  effective_enabled: boolean;
  /** Raw organization_submodules.is_enabled, or null when no override row (inherit). */
  override: boolean | null;
}

export interface OrgModuleState {
  module: RbacModule;
  assigned: boolean;
  is_enabled: boolean;
  assigned_by: string | null;
  assigned_at: string | null;
  submodules: OrgSubmoduleState[];
}

// ---- Request bodies ----

export interface ModuleUpsertBody {
  name: string;
  display_name: string;
  description?: string;
  icon?: string;
  is_active?: boolean;
  sort_order?: number;
}

export interface SubmoduleUpsertBody {
  name: string;
  display_name: string;
  description?: string;
  is_active?: boolean;
  sort_order?: number;
}

export interface ActionUpsertBody {
  name: string;
  display_name: string;
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
  first_name?: string;
  last_name?: string;
  role: string;
  is_active?: boolean;
}
