import { lazy, Suspense } from "react";
import { Redirect, Route, Switch } from "wouter";
import { ADMIN_ENABLED } from "@/lib/admin-enabled";
import { AdminLayout } from "@/components/admin/AdminLayout";

// The dev-only admin shell. This whole module is loaded behind the ADMIN_ENABLED
// gate (see App.tsx), so a normal production build never imports it and Rollup
// tree-shakes it out. Defense-in-depth: redirect home when the gate is off.

const DashboardPage = lazy(() => import("@/admin/pages/DashboardPage"));
const SiteIdentityPage = lazy(() => import("@/admin/pages/SiteIdentityPage"));
const NavigationPage = lazy(() => import("@/admin/pages/NavigationPage"));
const TemplatesPage = lazy(() => import("@/admin/pages/TemplatesPage"));
const BlogPage = lazy(() => import("@/admin/pages/BlogPage"));
const MediaPage = lazy(() => import("@/admin/pages/MediaPage"));
const TranslationsPage = lazy(() => import("@/admin/pages/TranslationsPage"));
const SeoPage = lazy(() => import("@/admin/pages/SeoPage"));
const SettingsPage = lazy(() => import("@/admin/pages/SettingsPage"));
const ContentVersionsPage = lazy(() => import("@/admin/pages/ContentVersionsPage"));

export default function AdminApp() {
  if (!ADMIN_ENABLED) return <Redirect to="/" />;

  return (
    <AdminLayout>
      <Suspense fallback={null}>
        <Switch>
          <Route path="/admin" component={DashboardPage} />
          <Route path="/admin/dashboard" component={DashboardPage} />
          <Route path="/admin/identity" component={SiteIdentityPage} />
          <Route path="/admin/branding" component={() => <Redirect to="/admin/identity" />} />
          <Route path="/admin/themes" component={() => <Redirect to="/admin/identity" />} />
          <Route path="/admin/navigation" component={NavigationPage} />
          <Route path="/admin/templates" component={TemplatesPage} />
          <Route path="/admin/blog" component={BlogPage} />
          <Route path="/admin/media" component={MediaPage} />
          <Route path="/admin/translations" component={TranslationsPage} />
          <Route path="/admin/seo" component={SeoPage} />
          <Route path="/admin/settings" component={SettingsPage} />
          <Route path="/admin/content-versions" component={ContentVersionsPage} />
          <Route>
            <Redirect to="/admin" />
          </Route>
        </Switch>
      </Suspense>
    </AdminLayout>
  );
}
