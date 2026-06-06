import { Redirect, Route, Switch } from "wouter";
import { ADMIN_ENABLED } from "@/lib/admin-enabled";

// The dev-only admin shell. This whole module is loaded behind the ADMIN_ENABLED
// gate (see App.tsx), so a normal production build never imports it and Rollup
// tree-shakes it out. Defense-in-depth: even if reached, redirect home when the
// gate is off.
export default function AdminApp() {
  if (!ADMIN_ENABLED) return <Redirect to="/" />;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Switch>
        <Route path="/admin">
          <AdminPlaceholder />
        </Route>
        <Route>
          <Redirect to="/admin" />
        </Route>
      </Switch>
    </div>
  );
}

// Temporary landing for the admin shell. Replaced by the real AdminLayout +
// content editor pages in later phases.
function AdminPlaceholder() {
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-bold">Tsuru Landing — Content Admin</h1>
      <p className="text-muted-foreground">
        Dev-only CMS shell. Content editor pages are added per entity in the next
        phases.
      </p>
    </div>
  );
}
