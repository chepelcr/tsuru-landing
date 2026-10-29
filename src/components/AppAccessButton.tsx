import { Button, type ButtonProps } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { IS_PRELAUNCH } from "@/lib/environment";
import { REGISTER_URL } from "@/lib/site-links";

interface AppAccessButtonProps extends Omit<ButtonProps, "asChild"> {
  href?: string;
}

export function AppAccessButton({ href = REGISTER_URL, children, ...props }: AppAccessButtonProps) {
  const { language } = useLanguage();

  if (IS_PRELAUNCH) {
    return <Button {...props} type="button" disabled>
      {language === "es" ? "Próximamente" : "Coming soon"}
    </Button>;
  }

  return <Button {...props} asChild>
    <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
  </Button>;
}
