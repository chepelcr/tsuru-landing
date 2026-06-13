// Contact — singleton editor for contact.json: page chrome, the form's bilingual
// labels/placeholders, the contact-info values (plain strings), and the response
// time block.

import { useLanguage } from "@/contexts/LanguageContext";
import { useAdminStore } from "@/lib/admin-store";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminCard, BilingualField, BilingualTextArea, TextField } from "@/components/admin/AdminUI";
import { RICH_TEXT_HINT } from "@/lib/rich-text";
import { useSingletonDraft } from "@/admin/useSingletonDraft";

const STRINGS = {
  es: {
    title: "Contacto",
    subtitle: "Encabezado, formulario, datos de contacto y tiempo de respuesta",
    intro: "Encabezado",
    docTitleSuffix: "Sufijo del título del documento",
    badge: "Insignia",
    pageTitle: "Título",
    pageSubtitle: "Subtítulo",
    sendMessage: "Enviar un mensaje",
    formCard: "Formulario",
    name: "Etiqueta nombre",
    namePh: "Placeholder nombre",
    email: "Etiqueta email",
    emailPh: "Placeholder email",
    subject: "Etiqueta asunto",
    subjectPh: "Placeholder asunto",
    message: "Etiqueta mensaje",
    messagePh: "Placeholder mensaje",
    submit: "Enviar",
    sending: "Enviando",
    success: "Éxito",
    error: "Error",
    tryAgain: "Intentar de nuevo",
    otherWays: "Otras formas",
    infoLabels: "Etiquetas de información",
    infoEmail: "Etiqueta email",
    infoPhone: "Etiqueta teléfono",
    infoAddress: "Etiqueta dirección",
    contactInfo: "Datos de contacto (valores)",
    valEmail: "Email",
    valPhone: "Teléfono",
    valAddress: "Dirección",
    responseTime: "Tiempo de respuesta",
    responseTimeDesc: "Descripción del tiempo de respuesta",
  },
  en: {
    title: "Contact",
    subtitle: "Header, form, contact details, and response time",
    intro: "Header",
    docTitleSuffix: "Document title suffix",
    badge: "Badge",
    pageTitle: "Title",
    pageSubtitle: "Subtitle",
    sendMessage: "Send a message",
    formCard: "Form",
    name: "Name label",
    namePh: "Name placeholder",
    email: "Email label",
    emailPh: "Email placeholder",
    subject: "Subject label",
    subjectPh: "Subject placeholder",
    message: "Message label",
    messagePh: "Message placeholder",
    submit: "Submit",
    sending: "Sending",
    success: "Success",
    error: "Error",
    tryAgain: "Try again",
    otherWays: "Other ways",
    infoLabels: "Info labels",
    infoEmail: "Email label",
    infoPhone: "Phone label",
    infoAddress: "Address label",
    contactInfo: "Contact details (values)",
    valEmail: "Email",
    valPhone: "Phone",
    valAddress: "Address",
    responseTime: "Response time",
    responseTimeDesc: "Response time description",
  },
} as const;

export default function ContactPage() {
  const { language } = useLanguage();
  const T = STRINGS[language];
  const setContact = useAdminStore((s) => s.setContact);
  const initial = useAdminStore((s) => s.contact);
  const { draft, update, save } = useSingletonDraft(initial, "contact.json", setContact);

  return (
    <div>
      <PageHeader title={T.title} description={T.subtitle} entity="contact.json" value={draft} onSave={save} />

      <div className="space-y-5">
        <AdminCard title={T.intro}>
          <BilingualField label={T.docTitleSuffix} es={draft.docTitleSuffix.es} en={draft.docTitleSuffix.en} onChange={(l, v) => update((d) => (d.docTitleSuffix[l] = v))} />
          <BilingualField label={T.badge} es={draft.badge.es} en={draft.badge.en} onChange={(l, v) => update((d) => (d.badge[l] = v))} />
          <BilingualField label={T.pageTitle} es={draft.title.es} en={draft.title.en} onChange={(l, v) => update((d) => (d.title[l] = v))} />
          <BilingualTextArea label={T.pageSubtitle} es={draft.subtitle.es} en={draft.subtitle.en} onChange={(l, v) => update((d) => (d.subtitle[l] = v))} hint={RICH_TEXT_HINT} />
          <BilingualField label={T.sendMessage} es={draft.sendMessage.es} en={draft.sendMessage.en} onChange={(l, v) => update((d) => (d.sendMessage[l] = v))} />
        </AdminCard>

        <AdminCard title={T.formCard}>
          <BilingualField label={T.name} es={draft.form.name.es} en={draft.form.name.en} onChange={(l, v) => update((d) => (d.form.name[l] = v))} />
          <BilingualField label={T.namePh} es={draft.form.namePlaceholder.es} en={draft.form.namePlaceholder.en} onChange={(l, v) => update((d) => (d.form.namePlaceholder[l] = v))} />
          <BilingualField label={T.email} es={draft.form.email.es} en={draft.form.email.en} onChange={(l, v) => update((d) => (d.form.email[l] = v))} />
          <BilingualField label={T.emailPh} es={draft.form.emailPlaceholder.es} en={draft.form.emailPlaceholder.en} onChange={(l, v) => update((d) => (d.form.emailPlaceholder[l] = v))} />
          <BilingualField label={T.subject} es={draft.form.subject.es} en={draft.form.subject.en} onChange={(l, v) => update((d) => (d.form.subject[l] = v))} />
          <BilingualField label={T.subjectPh} es={draft.form.subjectPlaceholder.es} en={draft.form.subjectPlaceholder.en} onChange={(l, v) => update((d) => (d.form.subjectPlaceholder[l] = v))} />
          <BilingualField label={T.message} es={draft.form.message.es} en={draft.form.message.en} onChange={(l, v) => update((d) => (d.form.message[l] = v))} />
          <BilingualField label={T.messagePh} es={draft.form.messagePlaceholder.es} en={draft.form.messagePlaceholder.en} onChange={(l, v) => update((d) => (d.form.messagePlaceholder[l] = v))} />
          <BilingualField label={T.submit} es={draft.form.submit.es} en={draft.form.submit.en} onChange={(l, v) => update((d) => (d.form.submit[l] = v))} />
          <BilingualField label={T.sending} es={draft.form.sending.es} en={draft.form.sending.en} onChange={(l, v) => update((d) => (d.form.sending[l] = v))} />
          <BilingualField label={T.success} es={draft.form.success.es} en={draft.form.success.en} onChange={(l, v) => update((d) => (d.form.success[l] = v))} />
          <BilingualField label={T.error} es={draft.error.es} en={draft.error.en} onChange={(l, v) => update((d) => (d.error[l] = v))} />
          <BilingualField label={T.tryAgain} es={draft.tryAgain.es} en={draft.tryAgain.en} onChange={(l, v) => update((d) => (d.tryAgain[l] = v))} />
        </AdminCard>

        <AdminCard title={T.infoLabels}>
          <BilingualField label={T.otherWays} es={draft.otherWays.es} en={draft.otherWays.en} onChange={(l, v) => update((d) => (d.otherWays[l] = v))} />
          <BilingualField label={T.infoEmail} es={draft.info.email.es} en={draft.info.email.en} onChange={(l, v) => update((d) => (d.info.email[l] = v))} />
          <BilingualField label={T.infoAddress} es={draft.info.address.es} en={draft.info.address.en} onChange={(l, v) => update((d) => (d.info.address[l] = v))} />
        </AdminCard>

        <AdminCard title={T.contactInfo}>
          <TextField label={T.valEmail} value={draft.contactInfo.email} onChange={(v) => update((d) => (d.contactInfo.email = v))} />
          <TextField label={T.valAddress} value={draft.contactInfo.address} onChange={(v) => update((d) => (d.contactInfo.address = v))} />
        </AdminCard>
      </div>
    </div>
  );
}
