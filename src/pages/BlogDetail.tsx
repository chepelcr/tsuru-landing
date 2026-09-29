import { useEffect } from 'react';

export default function BlogDetail({ slug }: { slug: string }) {
  useEffect(() => {
    window.location.replace(`https://blogs.tsuru.jcampos.dev/?post=${encodeURIComponent(slug)}`);
  }, [slug]);
  return <div className="min-h-[45vh] flex items-center justify-center text-muted-foreground">Abriendo el artículo…</div>;
}
