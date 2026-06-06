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
const SeoPage = lazy(() => import("@/admin/pages/SeoPage"));
const SettingsPage = lazy(() => import("@/admin/pages/SettingsPage"));
const ContentVersionsPage = lazy(() => import("@/admin/pages/ContentVersionsPage"));

// Per-page content editors.
const LandingPage = lazy(() => import("@/admin/pages/LandingPage"));
const FeaturesPage = lazy(() => import("@/admin/pages/FeaturesPage"));
const FairsPage = lazy(() => import("@/admin/pages/FairsPage"));
const CommunityPage = lazy(() => import("@/admin/pages/CommunityPage"));
const AboutPage = lazy(() => import("@/admin/pages/AboutPage"));
const ContactPage = lazy(() => import("@/admin/pages/ContactPage"));
const BlogChromePage = lazy(() => import("@/admin/pages/BlogChromePage"));
const TermsPage = lazy(() => import("@/admin/pages/TermsPage"));
const PrivacyPage = lazy(() => import("@/admin/pages/PrivacyPage"));
const CookiesPage = lazy(() => import("@/admin/pages/CookiesPage"));
const NavbarPage = lazy(() => import("@/admin/pages/NavbarPage"));
const FooterPage = lazy(() => import("@/admin/pages/FooterPage"));
const UiStringsPage = lazy(() => import("@/admin/pages/UiStringsPage"));
const CtaSecurityPage = lazy(() => import("@/admin/pages/CtaSecurityPage"));

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

          {/* Pages */}
          <Route path="/admin/landing" component={LandingPage} />
          <Route path="/admin/features" component={FeaturesPage} />
          <Route path="/admin/fairs" component={FairsPage} />
          <Route path="/admin/community" component={CommunityPage} />
          <Route path="/admin/about" component={AboutPage} />
          <Route path="/admin/contact" component={ContactPage} />
          <Route path="/admin/blog" component={BlogPage} />
          <Route path="/admin/blog-chrome" component={BlogChromePage} />

          {/* Legal */}
          <Route path="/admin/terms" component={TermsPage} />
          <Route path="/admin/privacy" component={PrivacyPage} />
          <Route path="/admin/cookies" component={CookiesPage} />

          {/* Chrome */}
          <Route path="/admin/navbar" component={NavbarPage} />
          <Route path="/admin/footer" component={FooterPage} />
          <Route path="/admin/ui" component={UiStringsPage} />
          <Route path="/admin/cta-security" component={CtaSecurityPage} />

          {/* CMS */}
          <Route path="/admin/media" component={MediaPage} />
          <Route path="/admin/seo" component={SeoPage} />
          <Route path="/admin/settings" component={SettingsPage} />
          <Route path="/admin/content-versions" component={ContentVersionsPage} />

          {/* /admin/translations removed with the global Translations page */}
          <Route>
            <Redirect to="/admin" />
          </Route>
        </Switch>
      </Suspense>
    </AdminLayout>
  );
}
