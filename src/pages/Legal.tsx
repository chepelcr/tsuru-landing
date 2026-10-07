import { useLanguage } from "@/contexts/LanguageContext";
import { LegalBody, type LegalKey } from "@/legal/LegalBody";

export default function Legal({ pageKey }: { pageKey: LegalKey }) {
  const { language } = useLanguage();
  return <LegalBody pageKey={pageKey} lang={language} />;
}
