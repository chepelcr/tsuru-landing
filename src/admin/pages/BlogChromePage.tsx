// Blog chrome — singleton editor for blog-chrome.json: the blog index page's
// surrounding copy (header, labels, newsletter block). Articles live in blog.json
// (the separate Blog editor).

import { useLanguage } from "@/contexts/LanguageContext";
import { useAdminStore } from "@/lib/admin-store";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminCard, BilingualField, BilingualTextArea } from "@/components/admin/AdminUI";
import { RICH_TEXT_HINT } from "@/lib/rich-text";
import { useSingletonDraft } from "@/admin/useSingletonDraft";

const STRINGS = {
  es: {
    title: "Blog (chrome)",
    subtitle: "Textos de la página del blog — los artículos están en «Blog»",
    header: "Encabezado",
    docTitleSuffix: "Sufijo del título del documento",
    badge: "Insignia",
    pageTitle: "Título",
    pageSubtitle: "Subtítulo",
    labels: "Etiquetas",
    featured: "Artículo destacado",
    readMore: "Leer más",
    posted: "Publicado",
    latestArticles: "Artículos recientes",
    newsletter: "Boletín",
    stayUpdated: "Mantente actualizado",
    newsletterText: "Texto del boletín",
    subscribe: "Suscribirse",
    privacyNote: "Nota de privacidad",
    detail: "Página de artículo",
    backToBlog: "Volver al blog",
    notFoundTitle: "Título — no encontrado",
    notFoundText: "Texto — no encontrado",
    notFoundCta: "Botón — no encontrado",
  },
  en: {
    title: "Blog (chrome)",
    subtitle: "Blog page copy — articles live in “Blog”",
    header: "Header",
    docTitleSuffix: "Document title suffix",
    badge: "Badge",
    pageTitle: "Title",
    pageSubtitle: "Subtitle",
    labels: "Labels",
    featured: "Featured article",
    readMore: "Read more",
    posted: "Posted",
    latestArticles: "Latest articles",
    newsletter: "Newsletter",
    stayUpdated: "Stay updated",
    newsletterText: "Newsletter text",
    subscribe: "Subscribe",
    privacyNote: "Privacy note",
    detail: "Article page",
    backToBlog: "Back to blog",
    notFoundTitle: "Not found — title",
    notFoundText: "Not found — text",
    notFoundCta: "Not found — button",
  },
} as const;

export default function BlogChromePage() {
  const { language } = useLanguage();
  const T = STRINGS[language];
  const setBlogChrome = useAdminStore((s) => s.setBlogChrome);
  const initial = useAdminStore((s) => s.blogChrome);
  const { draft, update, save } = useSingletonDraft(initial, "blog-chrome.json", setBlogChrome);

  return (
    <div>
      <PageHeader title={T.title} description={T.subtitle} entity="blog-chrome.json" value={draft} onSave={save} />

      <div className="space-y-5">
        <AdminCard title={T.header}>
          <BilingualField label={T.docTitleSuffix} es={draft.docTitleSuffix.es} en={draft.docTitleSuffix.en} onChange={(l, v) => update((d) => (d.docTitleSuffix[l] = v))} />
          <BilingualField label={T.badge} es={draft.badge.es} en={draft.badge.en} onChange={(l, v) => update((d) => (d.badge[l] = v))} />
          <BilingualField label={T.pageTitle} es={draft.title.es} en={draft.title.en} onChange={(l, v) => update((d) => (d.title[l] = v))} />
          <BilingualTextArea label={T.pageSubtitle} es={draft.subtitle.es} en={draft.subtitle.en} onChange={(l, v) => update((d) => (d.subtitle[l] = v))} hint={RICH_TEXT_HINT} />
        </AdminCard>

        <AdminCard title={T.labels}>
          <BilingualField label={T.featured} es={draft.featured.es} en={draft.featured.en} onChange={(l, v) => update((d) => (d.featured[l] = v))} />
          <BilingualField label={T.readMore} es={draft.readMore.es} en={draft.readMore.en} onChange={(l, v) => update((d) => (d.readMore[l] = v))} />
          <BilingualField label={T.posted} es={draft.posted.es} en={draft.posted.en} onChange={(l, v) => update((d) => (d.posted[l] = v))} />
          <BilingualField label={T.latestArticles} es={draft.latestArticles.es} en={draft.latestArticles.en} onChange={(l, v) => update((d) => (d.latestArticles[l] = v))} />
        </AdminCard>

        <AdminCard title={T.detail}>
          <BilingualField label={T.backToBlog} es={draft.backToBlog.es} en={draft.backToBlog.en} onChange={(l, v) => update((d) => (d.backToBlog[l] = v))} />
          <BilingualField label={T.notFoundTitle} es={draft.notFoundTitle.es} en={draft.notFoundTitle.en} onChange={(l, v) => update((d) => (d.notFoundTitle[l] = v))} />
          <BilingualTextArea label={T.notFoundText} es={draft.notFoundText.es} en={draft.notFoundText.en} onChange={(l, v) => update((d) => (d.notFoundText[l] = v))} hint={RICH_TEXT_HINT} />
          <BilingualField label={T.notFoundCta} es={draft.notFoundCta.es} en={draft.notFoundCta.en} onChange={(l, v) => update((d) => (d.notFoundCta[l] = v))} />
        </AdminCard>
      </div>
    </div>
  );
}
