// Navbar — singleton editor for navbar.json: the public header's brand, link
// labels, and the sign-in / join buttons.

import { useLanguage } from "@/contexts/LanguageContext";
import { useAdminStore } from "@/lib/admin-store";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminCard, BilingualField } from "@/components/admin/AdminUI";
import { useSingletonDraft } from "@/admin/useSingletonDraft";

const STRINGS = {
  es: {
    title: "Barra de navegación",
    subtitle: "Marca, enlaces y botones del encabezado público",
    brandCard: "Marca",
    brand: "Marca",
    linksCard: "Enlaces",
    features: "Funcionalidades",
    fairs: "Ferias",
    community: "Comunidad",
    examples: "Ejemplos",
    nosotros: "Nosotros (menú)",
    about: "Quiénes somos",
    contact: "Contacto",
    blog: "Blog",
    actions: "Botones",
    login: "Iniciar sesión",
    register: "Registrarse",
  },
  en: {
    title: "Navbar",
    subtitle: "Public header brand, links, and buttons",
    brandCard: "Brand",
    brand: "Brand",
    linksCard: "Links",
    features: "Features",
    fairs: "Fairs",
    community: "Community",
    examples: "Examples",
    nosotros: "About (menu)",
    about: "About us",
    contact: "Contact",
    blog: "Blog",
    actions: "Buttons",
    login: "Sign in",
    register: "Register",
  },
} as const;

export default function NavbarPage() {
  const { language } = useLanguage();
  const T = STRINGS[language];
  const setNavbar = useAdminStore((s) => s.setNavbar);
  const initial = useAdminStore((s) => s.navbar);
  const { draft, update, save } = useSingletonDraft(initial, "navbar.json", setNavbar);

  return (
    <div>
      <PageHeader title={T.title} description={T.subtitle} entity="navbar.json" value={draft} onSave={save} />

      <div className="space-y-5">
        <AdminCard title={T.brandCard}>
          <BilingualField label={T.brand} es={draft.brand.es} en={draft.brand.en} onChange={(l, v) => update((d) => (d.brand[l] = v))} />
        </AdminCard>

        <AdminCard title={T.linksCard}>
          <BilingualField label={T.features} es={draft.links.features.es} en={draft.links.features.en} onChange={(l, v) => update((d) => (d.links.features[l] = v))} />
          <BilingualField label={T.fairs} es={draft.links.fairs.es} en={draft.links.fairs.en} onChange={(l, v) => update((d) => (d.links.fairs[l] = v))} />
          <BilingualField label={T.community} es={draft.links.community.es} en={draft.links.community.en} onChange={(l, v) => update((d) => (d.links.community[l] = v))} />
          <BilingualField label={T.examples} es={draft.links.examples.es} en={draft.links.examples.en} onChange={(l, v) => update((d) => (d.links.examples[l] = v))} />
          <BilingualField label={T.nosotros} es={draft.links.nosotros.es} en={draft.links.nosotros.en} onChange={(l, v) => update((d) => (d.links.nosotros[l] = v))} />
          <BilingualField label={T.about} es={draft.links.about.es} en={draft.links.about.en} onChange={(l, v) => update((d) => (d.links.about[l] = v))} />
          <BilingualField label={T.contact} es={draft.links.contact.es} en={draft.links.contact.en} onChange={(l, v) => update((d) => (d.links.contact[l] = v))} />
          <BilingualField label={T.blog} es={draft.links.blog.es} en={draft.links.blog.en} onChange={(l, v) => update((d) => (d.links.blog[l] = v))} />
        </AdminCard>

        <AdminCard title={T.actions}>
          <BilingualField label={T.login} es={draft.login.es} en={draft.login.en} onChange={(l, v) => update((d) => (d.login[l] = v))} />
          <BilingualField label={T.register} es={draft.register.es} en={draft.register.en} onChange={(l, v) => update((d) => (d.register[l] = v))} />
        </AdminCard>
      </div>
    </div>
  );
}
