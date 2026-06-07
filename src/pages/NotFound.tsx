import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { resolveIcon } from "@/lib/icons";
import ui from "@/content/ui.json";

const MapPin = resolveIcon("map-pin");
const HomeIcon = resolveIcon("home");

export default function NotFound() {
  const { language: lang } = useLanguage();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center text-center gap-4 p-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <MapPin className="h-7 w-7 text-primary" />
          </div>
          <p className="text-5xl sm:text-6xl font-bold text-primary">404</p>
          <h1 className="text-2xl font-semibold text-foreground">
            {ui.notFound.title[lang] ?? ui.notFound.title.es}
          </h1>
          <p className="text-muted-foreground">
            {ui.notFound.description[lang] ?? ui.notFound.description.es}
          </p>
          <Link href="/">
            <Button className="mt-2">
              <HomeIcon className="h-4 w-4 mr-2" />
              {ui.notFound.home[lang] ?? ui.notFound.home.es}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
