import { useEffect, useState } from 'react';
import { getPublishedBlogId } from '@/repositories/content.repository';
import { BLOG_SITE_URL } from '@/lib/site-links';

export default function BlogDetail({ slug }: { slug: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    setFailed(false);
    getPublishedBlogId(slug).then((id) => {
      if (active) window.location.replace(`${BLOG_SITE_URL}/blog/${encodeURIComponent(id)}`);
    }).catch(() => { if (active) setFailed(true); });
    return () => { active = false; };
  }, [slug]);
  return <div className="min-h-[45vh] flex flex-col gap-4 items-center justify-center text-muted-foreground">
    <p>{failed ? 'No pudimos abrir el artículo.' : 'Abriendo el artículo…'}</p>
    {failed && <a className="text-primary underline" href={`${BLOG_SITE_URL}/`}>Ver artículos</a>}
  </div>;
}
