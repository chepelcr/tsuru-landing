// Footer — singleton editor for footer.json: brand, description, the three
// column headings, link labels, and the copyright line.

import { useLanguage } from "@/contexts/LanguageContext";
import { useAdminStore } from "@/lib/admin-store";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminCard, BilingualField, BilingualTextArea } from "@/components/admin/AdminUI";
import { RICH_TEXT_HINT } from "@/lib/rich-text";
import { useSingletonDraft } from "@/admin/useSingletonDraft";

const STRINGS = {
  es: {
    title: "Pie de página",
    subtitle: "Marca, descripción, columnas, enlaces y copyright",
    brandCard: "Marca",
    brand: "Marca",
    description: "Descripción",
    groups: "Encabezados de columnas",
    product: "Plataforma",
    company: "Empresa",
    legal: "Legal",
    linksCard: "Enlaces",
    features: "Funcionalidades",
    fairs: "Ferias",
    community: "Comunidad",
    examples: "Ejemplos",
    about: "Quiénes somos",
    blog: "Blog",
    contact: "Contacto",
    terms: "Términos",
    privacy: "Privacidad",
    cookies: "Cookies",
    copyrightCard: "Copyright",
    copyright: "Texto de copyright",
  },
  en: {
    title: "Footer",
    subtitle: "Brand, description, columns, links, and copyright",
    brandCard: "Brand",
    brand: "Brand",
    description: "Description",
    groups: "Column headings",
    product: "Platform",
    company: "Company",
    legal: "Legal",
    linksCard: "Links",
    features: "Features",
    fairs: "Fairs",
    community: "Community",
    examples: "Examples",
    about: "About us",
    blog: "Blog",
    contact: "Contact",
    terms: "Terms",
    privacy: "Privacy",
    cookies: "Cookies",
    copyrightCard: "Copyright",
    copyright: "Copyright text",
  },
} as const;

export default function FooterPage() {
  const { language } = useLanguage();
  const T = STRINGS[language];
  const setFooter = useAdminStore((s) => s.setFooter);
  const initial = useAdminStore((s) => s.footer);
  const { draft, update, save } = useSingletonDraft(initial, "footer.json", setFooter);

  return (
    <div>
      <PageHeader title={T.title} description={T.subtitle} entity="footer.json" value={draft} onSave={save} />

      <div className="space-y-5">
        <AdminCard title={T.brandCard}>
          <BilingualField label={T.brand} es={draft.brand.es} en={draft.brand.en} onChange={(l, v) => update((d) => (d.brand[l] = v))} />
          <BilingualTextArea label={T.description} es={draft.description.es} en={draft.description.en} onChange={(l, v) => update((d) => (d.description[l] = v))} hint={RICH_TEXT_HINT} />
        </AdminCard>

        <AdminCard title={T.groups}>
          <BilingualField label={T.product} es={draft.groups.product.es} en={draft.groups.product.en} onChange={(l, v) => update((d) => (d.groups.product[l] = v))} />
          <BilingualField label={T.company} es={draft.groups.company.es} en={draft.groups.company.en} onChange={(l, v) => update((d) => (d.groups.company[l] = v))} />
          <BilingualField label={T.legal} es={draft.groups.legal.es} en={draft.groups.legal.en} onChange={(l, v) => update((d) => (d.groups.legal[l] = v))} />
        </AdminCard>

        <AdminCard title={T.linksCard}>
          <BilingualField label={T.features} es={draft.links.features.es} en={draft.links.features.en} onChange={(l, v) => update((d) => (d.links.features[l] = v))} />
          <BilingualField label={T.fairs} es={draft.links.fairs.es} en={draft.links.fairs.en} onChange={(l, v) => update((d) => (d.links.fairs[l] = v))} />
          <BilingualField label={T.community} es={draft.links.community.es} en={draft.links.community.en} onChange={(l, v) => update((d) => (d.links.community[l] = v))} />
          <BilingualField label={T.examples} es={draft.links.examples.es} en={draft.links.examples.en} onChange={(l, v) => update((d) => (d.links.examples[l] = v))} />
          <BilingualField label={T.about} es={draft.links.about.es} en={draft.links.about.en} onChange={(l, v) => update((d) => (d.links.about[l] = v))} />
          <BilingualField label={T.blog} es={draft.links.blog.es} en={draft.links.blog.en} onChange={(l, v) => update((d) => (d.links.blog[l] = v))} />
          <BilingualField label={T.contact} es={draft.links.contact.es} en={draft.links.contact.en} onChange={(l, v) => update((d) => (d.links.contact[l] = v))} />
          <BilingualField label={T.terms} es={draft.links.terms.es} en={draft.links.terms.en} onChange={(l, v) => update((d) => (d.links.terms[l] = v))} />
          <BilingualField label={T.privacy} es={draft.links.privacy.es} en={draft.links.privacy.en} onChange={(l, v) => update((d) => (d.links.privacy[l] = v))} />
          <BilingualField label={T.cookies} es={draft.links.cookies.es} en={draft.links.cookies.en} onChange={(l, v) => update((d) => (d.links.cookies[l] = v))} />
        </AdminCard>

        <AdminCard title={T.copyrightCard}>
          <BilingualField label={T.copyright} es={draft.copyright.es} en={draft.copyright.en} onChange={(l, v) => update((d) => (d.copyright[l] = v))} />
        </AdminCard>
      </div>
    </div>
  );
}
