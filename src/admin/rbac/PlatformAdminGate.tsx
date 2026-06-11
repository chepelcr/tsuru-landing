// Auth gate for the BE-connected RBAC / Platform admin section.
//
// Flow: Cognito sign-in (same user pool as the platform, configured by
// src/lib/amplify.ts from VITE_AWS_COGNITO_USER_POOL_ID / VITE_AWS_COGNITO_CLIENT_ID /
// VITE_AWS_REGION) → ID token attached to every markets-api call (lib/admin-api)
// → GET /api/users/:userId/profile must report role === 'platform_admin'.
//
// The UI only gates; the backend's requirePlatformAdmin middleware is the real
// enforcement (contract §3.0.3). Non-admin users get a clear unauthorized state.

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { getCurrentUser, signIn, signOut } from "aws-amplify/auth";
import { Loader2, LogOut, Settings2, ShieldAlert, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import amplifyConfig from "@/lib/amplify";
import { ADMIN_AUTH_OPEN, AdminApiError, isAdminApiConfigured } from "@/lib/admin-api";
import { usePlatformProfile } from "@/services/platform-rbac.service";
import { btnGhostCls, btnPrimaryCls, Field, inputCls } from "@/admin/rbac/widgets";

const COGNITO_CONFIGURED = !!(
  amplifyConfig.Auth.Cognito.userPoolId && amplifyConfig.Auth.Cognito.userPoolClientId
);

type SessionState = { status: "checking" } | { status: "signedOut" } | { status: "signedIn"; userId: string };

function CenterCard({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        {children}
      </div>
    </div>
  );
}

export function PlatformAdminGate({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  const [session, setSession] = useState<SessionState>({ status: "checking" });

  // Open mode: no admin Cognito pool yet (VITE_ADMIN_AUTH_MODE=open + server
  // ADMIN_AUTH_MODE=open). Skip sign-in entirely; backend accepts anonymous.
  if (ADMIN_AUTH_OPEN) {
    return (
      <div>
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-700 dark:text-amber-400">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>{t("admin.rbac.gate.openMode")}</span>
        </div>
        {children}
      </div>
    );
  }

  const refreshSession = async () => {
    try {
      const user = await getCurrentUser();
      setSession({ status: "signedIn", userId: user.userId });
    } catch {
      setSession({ status: "signedOut" });
    }
  };

  useEffect(() => {
    if (!COGNITO_CONFIGURED) {
      setSession({ status: "signedOut" });
      return;
    }
    void refreshSession();
  }, []);

  const userId = session.status === "signedIn" ? session.userId : null;
  const profileQuery = usePlatformProfile(userId);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch {
      // ignore
    }
    setSession({ status: "signedOut" });
  };

  // 1. Env not configured → explain what is missing (static deploys keep working).
  if (!COGNITO_CONFIGURED) {
    return (
      <CenterCard>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
          <Settings2 className="h-6 w-6 text-amber-500" />
        </div>
        <h2 className="mb-2 text-lg font-bold text-foreground">{t("admin.rbac.gate.configTitle")}</h2>
        <p className="text-sm text-muted-foreground">{t("admin.rbac.gate.configBody")}</p>
        <code className="mt-4 block rounded-lg bg-muted p-3 text-xs text-muted-foreground">
          VITE_AWS_COGNITO_USER_POOL_ID
          <br />
          VITE_AWS_COGNITO_CLIENT_ID
          <br />
          VITE_AWS_REGION
          <br />
          VITE_API_URL
        </code>
      </CenterCard>
    );
  }

  // 2. Session resolving.
  if (session.status === "checking") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span>{t("admin.rbac.gate.checking")}</span>
      </div>
    );
  }

  // 3. Signed out → sign-in form.
  if (session.status === "signedOut") {
    return <SignInCard onSignedIn={refreshSession} />;
  }

  // 4. Signed in → verify platform_admin via the profile.
  if (profileQuery.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span>{t("admin.rbac.gate.checking")}</span>
      </div>
    );
  }

  const profile = profileQuery.data;
  const deniedByApi =
    profileQuery.error instanceof AdminApiError &&
    (profileQuery.error.status === 401 || profileQuery.error.status === 403);

  if (profileQuery.isError && !deniedByApi) {
    return (
      <CenterCard>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <ShieldAlert className="h-6 w-6 text-destructive" />
        </div>
        <h2 className="mb-2 text-lg font-bold text-foreground">{t("admin.rbac.gate.profileError")}</h2>
        <p className="text-sm text-muted-foreground">
          {profileQuery.error instanceof Error ? profileQuery.error.message : ""}
        </p>
        <div className="mt-6 flex gap-2">
          <button type="button" className={btnPrimaryCls} onClick={() => profileQuery.refetch()}>
            {t("admin.rbac.common.retry")}
          </button>
          <button type="button" className={btnGhostCls} onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            {t("admin.rbac.gate.signOut")}
          </button>
        </div>
      </CenterCard>
    );
  }

  if (deniedByApi || (profile && profile.role !== "platform_admin")) {
    return (
      <CenterCard>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <ShieldAlert className="h-6 w-6 text-destructive" />
        </div>
        <h2 className="mb-2 text-lg font-bold text-foreground">
          {t("admin.rbac.gate.unauthorizedTitle")}
        </h2>
        <p className="text-sm text-muted-foreground">{t("admin.rbac.gate.unauthorizedBody")}</p>
        {profile && (
          <p className="mt-3 text-xs text-muted-foreground">
            {t("admin.rbac.gate.signedInAs")} <span className="font-medium">{profile.email}</span>
          </p>
        )}
        <div className="mt-6">
          <button type="button" className={btnGhostCls} onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            {t("admin.rbac.gate.signOut")}
          </button>
        </div>
      </CenterCard>
    );
  }

  if (!profile) return null;

  // 5. Authorized.
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-4 py-2.5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>
            {t("admin.rbac.gate.signedInAs")}{" "}
            <span className="font-medium text-foreground">{profile.email}</span>
          </span>
          {!isAdminApiConfigured() && (
            <span className="text-xs text-amber-600">{t("admin.rbac.gate.apiUrlWarning")}</span>
          )}
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
        >
          <LogOut className="h-3.5 w-3.5" />
          {t("admin.rbac.gate.signOut")}
        </button>
      </div>
      {children}
    </div>
  );
}

function SignInCard({ onSignedIn }: { onSignedIn: () => Promise<void> }) {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      // Clear any stale half-session first (mirrors useAuth.login).
      try {
        await signOut();
      } catch {
        // no existing session
      }
      const result = await signIn({ username: email, password });
      if (!result.isSignedIn) {
        setError(t("admin.rbac.gate.error"));
        return;
      }
      await onSignedIn();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("admin.rbac.gate.error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CenterCard>
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <ShieldCheck className="h-6 w-6 text-primary" />
      </div>
      <h2 className="mb-1 text-lg font-bold text-foreground">{t("admin.rbac.gate.title")}</h2>
      <p className="mb-6 text-sm text-muted-foreground">{t("admin.rbac.gate.subtitle")}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label={t("admin.rbac.gate.email")}>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label={t("admin.rbac.gate.password")}>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputCls}
          />
        </Field>

        {error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>
        )}

        <button type="submit" disabled={submitting} className={`${btnPrimaryCls} w-full justify-center`}>
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting ? t("admin.rbac.gate.signingIn") : t("admin.rbac.gate.signIn")}
        </button>
      </form>
    </CenterCard>
  );
}
