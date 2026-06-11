// Grouped, collapsible sidebar generated from the manifest. Button-based nav
// (runs guardNavigation before navigating). Selected treatment uses the sidebar
// token family; the open group's header wears the same selected treatment.

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ChevronDown, ChevronLeft, ChevronRight, LayoutDashboard, ExternalLink, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { resolveIcon } from "@/lib/icons";
import { guardNavigation } from "@/lib/admin-ui";
import {
  PAGES,
  GROUP_LABELS,
  GROUP_ICONS,
  type AdminGroup,
  type Lang,
} from "@/admin/manifest";

const GROUP_ORDER: AdminGroup[] = ["content", "pages", "legal", "chrome", "cms", "platform", "rbac"];

function activeGroupFor(location: string): AdminGroup | "" {
  const page = PAGES.find((p) => location === p.route || location.startsWith(p.route + "/"));
  if (page) return page.group;
  return "";
}

export function AdminSidebar({
  collapsed,
  onToggle,
  onClose,
}: {
  collapsed: boolean;
  onToggle?: () => void;
  onClose?: () => void;
}) {
  const { language, t } = useLanguage();
  const lang = language as Lang;
  const [location, navigate] = useLocation();
  const activeGroup = activeGroupFor(location);
  const [openGroup, setOpenGroup] = useState<string>(activeGroup || "content");

  useEffect(() => {
    if (activeGroup) setOpenGroup(activeGroup);
  }, [activeGroup]);

  const go = (href: string) => {
    if (!guardNavigation(href)) {
      navigate(href);
      onClose?.();
    }
  };

  const isActive = (href: string) => location === href || location.startsWith(href + "/");

  // Solid accent + fixed dark on-accent token — identical for every selected item.
  const selectedCls = "bg-sidebar-primary text-sidebar-primary-foreground";
  const idleCls =
    "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent";

  const dashActive = location === "/admin" || location === "/admin/dashboard";

  return (
    <aside className="relative flex h-full flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      {/* header */}
      <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-3">
        {!collapsed && <span className="truncate text-sm font-bold">{t("admin.appName")}</span>}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            aria-label="close"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* edge toggle (desktop) */}
      {onToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute -right-3 top-16 z-20 hidden h-6 w-6 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground shadow-md ring-2 ring-background hover:bg-sidebar-primary/90 lg:flex"
          aria-label="collapse"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      )}

      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
        {/* Dashboard */}
        <button
          type="button"
          onClick={() => go("/admin/dashboard")}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
            collapsed ? "justify-center" : ""
          } ${dashActive ? selectedCls : idleCls}`}
          title={collapsed ? t("admin.pages.dashboard") : undefined}
        >
          <LayoutDashboard className={collapsed ? "h-5 w-5" : "h-4 w-4"} />
          {!collapsed && <span>{t("admin.pages.dashboard")}</span>}
        </button>

        {GROUP_ORDER.map((group) => {
          const pages = PAGES.filter((p) => p.group === group);
          if (pages.length === 0) return null;
          const open = collapsed || openGroup === group;
          const groupSelected = open || group === activeGroup;
          const GroupIcon = resolveIcon(GROUP_ICONS[group]);

          return (
            <div key={group}>
              {!collapsed && (
                <button
                  type="button"
                  onClick={() => setOpenGroup((g) => (g === group ? "" : group))}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 transition-all ${
                    groupSelected ? selectedCls : idleCls
                  }`}
                >
                  <GroupIcon className="h-4 w-4" />
                  <span className="flex-1 text-left text-[10px] font-bold uppercase tracking-widest">
                    {GROUP_LABELS[group][lang]}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${openGroup === group ? "" : "-rotate-90"}`}
                  />
                </button>
              )}
              <div
                className={`grid transition-all duration-300 ease-out ${
                  open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="space-y-1 py-1">
                    {pages.map((p) => {
                      const Icon = resolveIcon(p.icon);
                      const sel = isActive(p.route);
                      const labelText = p.label[lang];
                      return (
                        <button
                          key={p.route}
                          type="button"
                          onClick={() => go(p.route)}
                          className={`flex w-full items-center gap-3 rounded-lg py-2 text-sm transition-all ${
                            collapsed ? "justify-center px-3" : "pl-6 pr-3"
                          } ${sel ? selectedCls : idleCls}`}
                          title={collapsed ? labelText : undefined}
                        >
                          <Icon className={collapsed ? "h-5 w-5" : "h-4 w-4"} />
                          {!collapsed && <span>{labelText}</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </nav>

      {/* footer: back to public site */}
      <div className="border-t border-sidebar-border px-2 py-3">
        <button
          type="button"
          onClick={() => go("/")}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/50 transition-colors hover:text-sidebar-foreground/80 ${
            collapsed ? "justify-center" : ""
          }`}
          title={collapsed ? t("admin.viewSite") : undefined}
        >
          <ExternalLink className={collapsed ? "h-5 w-5" : "h-4 w-4"} />
          {!collapsed && <span>{t("admin.viewSite")}</span>}
        </button>
      </div>
    </aside>
  );
}
