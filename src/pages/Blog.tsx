import { useEffect } from 'react';

export default function Blog() {
  useEffect(() => { window.location.replace('https://blogs.tsuru.jcampos.dev/'); }, []);
  return <div className="min-h-[45vh] flex items-center justify-center text-muted-foreground">Abriendo el blog…</div>;
}
