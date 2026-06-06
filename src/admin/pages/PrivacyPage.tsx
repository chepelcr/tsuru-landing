// Privacy — legal-document editor for privacy.json (see LegalEditor).

import { useLanguage } from "@/contexts/LanguageContext";
import { useAdminStore } from "@/lib/admin-store";
import { LegalEditor } from "./LegalEditor";

export default function PrivacyPage() {
  const { language } = useLanguage();
  const setPrivacy = useAdminStore((s) => s.setPrivacy);
  const title = language === "es" ? "Privacidad" : "Privacy";
  const subtitle =
    language === "es" ? "Política de privacidad" : "Privacy policy";
  return (
    <LegalEditor
      file="privacy.json"
      title={title}
      subtitle={subtitle}
      selectSlice={(s) => s.privacy as never}
      setSlice={(v) => setPrivacy(v as never)}
      noticeTitleKey="notice"
      noticeBodyKey="noticeDesc"
    />
  );
}
