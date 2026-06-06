// CTA security — singleton editor for cta-security.json: the trust pills shown
// on the shared CTA/security section (transparency, fair trade, local).

import { useLanguage } from "@/contexts/LanguageContext";
import { useAdminStore } from "@/lib/admin-store";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminCard, BilingualField } from "@/components/admin/AdminUI";
import { useSingletonDraft } from "@/admin/useSingletonDraft";

const STRINGS = {
  es: {
    title: "CTA / Seguridad",
    subtitle: "Insignias de confianza de la sección CTA",
    card: "Insignias",
    transparency: "Transparencia",
    fairTrade: "Comercio justo",
    local: "Comunidad local",
  },
  en: {
    title: "CTA / Security",
    subtitle: "Trust pills on the CTA section",
    card: "Pills",
    transparency: "Transparency",
    fairTrade: "Fair trade",
    local: "Local community",
  },
} as const;

export default function CtaSecurityPage() {
  const { language } = useLanguage();
  const T = STRINGS[language];
  const setCtaSecurity = useAdminStore((s) => s.setCtaSecurity);
  const initial = useAdminStore((s) => s.ctaSecurity);
  const { draft, update, save } = useSingletonDraft(initial, "cta-security.json", setCtaSecurity);

  return (
    <div>
      <PageHeader title={T.title} description={T.subtitle} entity="cta-security.json" value={draft} onSave={save} />
      <div className="space-y-5">
        <AdminCard title={T.card}>
          <BilingualField label={T.transparency} es={draft.pills.transparency.es} en={draft.pills.transparency.en} onChange={(l, v) => update((d) => (d.pills.transparency[l] = v))} />
          <BilingualField label={T.fairTrade} es={draft.pills.fairTrade.es} en={draft.pills.fairTrade.en} onChange={(l, v) => update((d) => (d.pills.fairTrade[l] = v))} />
          <BilingualField label={T.local} es={draft.pills.local.es} en={draft.pills.local.en} onChange={(l, v) => update((d) => (d.pills.local[l] = v))} />
        </AdminCard>
      </div>
    </div>
  );
}
