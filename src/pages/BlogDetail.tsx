import { useEffect, useState } from 'react';
import { getPublishedBlogId } from '@/repositories/content.repository';

export default function BlogDetail({ slug }: { slug: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    setFailed(false);
    getPublishedBlogId(slug).then((id) => {
      if (active) window.location.replace(`https://blogs.tsuru.jcampos.dev/blog/${encodeURIComponent(id)}`);
    }).catch(() => { if (active) setFailed(true); });
    return () => { active = false; };
  }, [slug]);
  return <div className="min-h-[45vh] flex flex-col gap-4 items-center justify-center text-muted-foreground">
    <p>{failed ? 'No pudimos abrir el artículo.' : 'Abriendo el artículo…'}</p>
    {failed && <a className="text-primary underline" href="https://blogs.tsuru.jcampos.dev/">Ver artículos</a>}
  </div>;
}
