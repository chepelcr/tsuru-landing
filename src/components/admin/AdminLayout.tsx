// Admin layout — desktop sidebar + animated mobile drawer + topbar + scrollable
// main content region (#page-content) + the single UnsavedChangesModal. Owns
// the collapsed state, the mobile-drawer render/open split, and scroll-to-top on
// route change.

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation } from "wouter";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { UnsavedChangesModal } from "@/components/admin/PageHeader";

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileRender, setMobileRender] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  const openMobile = () => {
    setMobileRender(true);
    requestAnimationFrame(() => setMobileOpen(true));
  };
  const closeMobile = () => {
    setMobileOpen(false);
    setTimeout(() => setMobileRender(false), 300);
  };

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [location]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* desktop sidebar */}
      <div className="hidden flex-shrink-0 lg:flex">
        <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      </div>

      {/* mobile drawer */}
      {mobileRender && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
              mobileOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={closeMobile}
          />
          <div
            className={`relative z-10 h-full w-64 transition-transform duration-300 ease-out ${
              mobileOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <AdminSidebar collapsed={false} onClose={closeMobile} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar onMenu={openMobile} />
        <main ref={mainRef} className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div id="page-content">{children}</div>
        </main>
      </div>

      <UnsavedChangesModal />
    </div>
  );
}
