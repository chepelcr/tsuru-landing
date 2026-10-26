import { useEffect } from 'react';
import { BLOG_SITE_URL } from '@/lib/site-links';

export default function Blog() {
  useEffect(() => { window.location.replace(`${BLOG_SITE_URL}/`); }, []);
  return <div className="min-h-[45vh] flex items-center justify-center text-muted-foreground">Abriendo el blog…</div>;
}
