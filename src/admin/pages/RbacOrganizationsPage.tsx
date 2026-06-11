// RBAC / Platform — organization search & list (contract P1). Row click opens
// the per-org module-assignment screen. BE-connected (markets-api /api/admin),
// gated by PlatformAdminGate; the public site stays static.

import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { Building2, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader } from "@/components/admin/PageHeader";
import { PlatformAdminGate } from "@/admin/rbac/PlatformAdminGate";
import { rbacAdminKeys, useAdminOrganizations } from "@/services/platform-rbac.service";
import type { AdminOrgListItem } from "@/types/platform-rbac";
import {
  EmptyState,
  ErrorState,
  inputCls,
  LoadingState,
  StateBadge,
} from "@/admin/rbac/widgets";

const PAGE_SIZE = 20;

function OrganizationsList() {
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Debounced search → resets to page 1.
  useEffect(() => {
    const handle = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(handle);
  }, [searchInput]);

  const { data, isLoading, isError, error } = useAdminOrganizations({
    search,
    page,
    pageSize: PAGE_SIZE,
  });

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  const openOrg = (org: AdminOrgListItem) => {
    // Hand the row to the detail page so it can show the org name without a
    // dedicated GET /api/admin/organizations/:orgId endpoint.
    queryClient.setQueryData(rbacAdminKeys.orgItem(org.id), org);
    navigate(`/admin/rbac/organizations/${org.id}`);
  };

  return (
    <div>
      <PageHeader
        title={t("admin.rbac.orgs.title")}
        description={t("admin.rbac.orgs.subtitle")}
      />

      <div className="mb-5 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t("admin.rbac.orgs.searchPlaceholder")}
            className={`${inputCls} pl-9`}
          />
        </div>
      </div>

      {isLoading && <LoadingState label={t("admin.rbac.common.loading")} />}

      {isError && (
        <ErrorState
          message={error instanceof Error ? error.message : t("admin.rbac.common.error")}
        />
      )}

      {!isLoading && !isError && data && data.items.length === 0 && (
        <EmptyState
          icon={<Building2 className="h-7 w-7 text-muted-foreground" />}
          label={t("admin.rbac.orgs.empty")}
        />
      )}

      {!isLoading && !isError && data && data.items.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3">{t("admin.rbac.orgs.colName")}</th>
                  <th className="px-5 py-3">{t("admin.rbac.orgs.colSlug")}</th>
                  <th className="px-5 py-3">{t("admin.rbac.orgs.colSubdomain")}</th>
                  <th className="px-5 py-3">{t("admin.rbac.orgs.colPlan")}</th>
                  <th className="px-5 py-3">{t("admin.rbac.orgs.colStatus")}</th>
                  <th className="px-5 py-3 text-right">{t("admin.rbac.orgs.colModules")}</th>
                  <th className="px-5 py-3">{t("admin.rbac.orgs.colCreated")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.items.map((org) => (
                  <tr
                    key={org.id}
                    onClick={() => openOrg(org)}
                    className="cursor-pointer hover:bg-muted/40"
                  >
                    <td className="px-5 py-3 font-medium text-foreground">
                      {org.name}
                      {org.onboardingStep !== null && org.onboardingStep < 3 && (
                        <span className="ml-2 align-middle">
                          <StateBadge tone="warn">
                            {t("admin.rbac.orgs.onboarding")} {org.onboardingStep}/3
                          </StateBadge>
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <code className="text-xs text-muted-foreground">{org.slug}</code>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{org.subdomain ?? "—"}</td>
                    <td className="px-5 py-3 capitalize text-muted-foreground">{org.plan ?? "—"}</td>
                    <td className="px-5 py-3">
                      <StateBadge tone={org.isActive ? "ok" : "muted"}>
                        {org.isActive ? t("admin.rbac.orgs.active") : t("admin.rbac.orgs.inactive")}
                      </StateBadge>
                    </td>
                    <td className="px-5 py-3 text-right font-medium text-foreground">
                      {org.moduleCount}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {new Date(org.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {data.total} {t("admin.rbac.orgs.results")}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-foreground hover:bg-muted disabled:opacity-40"
                aria-label="previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span>
                {t("admin.rbac.orgs.page")} {page} / {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-foreground hover:bg-muted disabled:opacity-40"
                aria-label="next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function RbacOrganizationsPage() {
  return (
    <PlatformAdminGate>
      <OrganizationsList />
    </PlatformAdminGate>
  );
}
