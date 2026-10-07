import { getContent } from "@/repositories/content.repository";
import { Redirect, Route, Switch } from "wouter";
import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
const ui = getContent<typeof import("@/content/ui.json")>("ui");

// Lazy load all pages for better code splitting
const Landing = lazy(() => import("@/pages/Landing"));
const Examples = lazy(() => import("@/pages/Examples"));
const About = lazy(() => import("@/pages/About"));
const Funcionalidades = lazy(() => import("@/pages/Funcionalidades"));
const Planes = lazy(() => import("@/pages/Planes"));
const Ferias = lazy(() => import("@/pages/Ferias"));
const Comunidad = lazy(() => import("@/pages/Comunidad"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogDetail = lazy(() => import("@/pages/BlogDetail"));
const Contact = lazy(() => import("@/pages/Contact"));
const Terms = lazy(() => import("@/pages/Terms"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Cookies = lazy(() => import("@/pages/Cookies"));
const NotFound = lazy(() => import("@/pages/NotFound"));

interface RouterProps {
  displayLocation: string;
}

// Loading fallback component
function LoadingFallback() {
  const { language: lang } = useLanguage();
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{ui.loading[lang] ?? ui.loading.es}</p>
      </div>
    </div>
  );
}

export function Router({ displayLocation }: RouterProps) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Switch location={displayLocation}>
        <Route path="/" component={Landing} />
        {/* Preserve existing billing links alongside the consolidated features. */}
        <Route path="/facturacion"><Redirect to="/funcionalidades" replace /></Route>
        <Route path="/funcionalidades" component={Funcionalidades} />
        <Route path="/planes" component={Planes} />
        <Route path="/pricing"><Redirect to="/planes" replace /></Route>
        <Route path="/ferias" component={Ferias} />
        <Route path="/comunidad" component={Comunidad} />
        <Route path="/quienes-somos" component={About} />
        <Route path="/ejemplos" component={Examples} />
        <Route path="/examples"><Redirect to="/ejemplos" replace /></Route>
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug">
          {(params) => <BlogDetail slug={params.slug} />}
        </Route>
        <Route path="/contacto" component={Contact} />
        <Route path="/contact"><Redirect to="/contacto" replace /></Route>
        <Route path="/terminos" component={Terms} />
        <Route path="/terms"><Redirect to="/terminos" replace /></Route>
        <Route path="/privacidad" component={Privacy} />
        <Route path="/privacy"><Redirect to="/privacidad" replace /></Route>
        <Route path="/cookies" component={Cookies} />
        <Route><NotFound /></Route>
      </Switch>
    </Suspense>
  );
}
