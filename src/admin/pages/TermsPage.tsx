// Terms — legal-document editor for terms.json (see LegalEditor).

import { useLanguage } from "@/contexts/LanguageContext";
import { useAdminStore } from "@/lib/admin-store";
import { LegalEditor } from "./LegalEditor";

export default function TermsPage() {
  const { language } = useLanguage();
  const setTerms = useAdminStore((s) => s.setTerms);
  const title = language === "es" ? "Términos" : "Terms";
  const subtitle =
    language === "es" ? "Términos y condiciones de servicio" : "Terms and conditions of service";
  return (
    <LegalEditor
      file="terms.json"
      title={title}
      subtitle={subtitle}
      selectSlice={(s) => s.terms as never}
      setSlice={(v) => setTerms(v as never)}
      noticeTitleKey="importantNotice"
      noticeBodyKey="acceptanceNotice"
    />
  );
}
