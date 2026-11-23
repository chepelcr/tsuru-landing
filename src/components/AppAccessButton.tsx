import { Button, type ButtonProps } from "@/components/ui/button";
import { REGISTER_URL } from "@/lib/site-links";

interface AppAccessButtonProps extends Omit<ButtonProps, "asChild"> {
  href?: string;
}

export function AppAccessButton({ href = REGISTER_URL, children, ...props }: AppAccessButtonProps) {
  return <Button {...props} asChild>
    <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
  </Button>;
}
