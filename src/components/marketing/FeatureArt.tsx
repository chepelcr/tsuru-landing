import { useRef } from 'react';
import { m, useInView, useReducedMotion } from 'motion/react';
import { Sprout } from 'lucide-react';

export function FeatureArt({ id }: { id: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const visible = useInView(ref, { amount: .3 });
  const reduced = useReducedMotion();
  const active = visible && !reduced;
  const float = { y: active ? [0, -5, 0] : 0 };
  const timing = { duration: 4, repeat: active ? Infinity : 0, ease: 'easeInOut' as const };
  const known = ['ReceiptText', 'Store', 'Users', 'orders', 'Scale', 'Leaf', 'MapPin', 'Eye'];
  if (!known.includes(id)) return <div className="feature-art flex items-center justify-center" aria-hidden="true"><Sprout size={48} /></div>;
  return <svg ref={ref} viewBox="0 0 280 130" className="feature-art" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5">
    {id === 'ReceiptText' && <>
      <m.g animate={float} transition={timing}><path d="M83 18h84v97l-9-6-9 6-9-6-9 6-9-6-9 6-9-6-12 6V18Z" fill="hsl(var(--card))"/><path d="M99 40h49M99 53h37M99 72h24M140 72h9M99 86h49" opacity=".5"/></m.g>
      <circle cx="177" cy="82" r="23" fill="hsl(var(--background))"/><m.path d="m165 82 8 8 16-18" animate={{pathLength:active?[0,1,1]:1}} transition={timing}/>
    </>}
    {id === 'Store' && <>
      <rect x="61" y="29" width="160" height="85" rx="8" fill="hsl(var(--card))"/><path d="M62 49h158M77 39h2m5 0h2m5 0h2" opacity=".4"/>
      {[82,125,168].map((x,i)=><m.g key={x} animate={{y:active?[0,-4,0]:0}} transition={{...timing,delay:i*.3}}><rect x={x} y="64" width="30" height="27" rx="4" fill="hsl(var(--primary) / .08)"/><path d={`M${x} 101h24`}/></m.g>)}
      <path d="M119 29v-7h42v7"/>
    </>}
    {id === 'Users' && <>
      <path d="m85 66 55-34 55 34-55 37-55-37Z" opacity=".25"/><m.g animate={float} transition={timing}>{[[85,66],[140,30],[195,66],[140,102]].map(([x,y])=><g key={x+','+y}><circle cx={x} cy={y} r="18" fill="hsl(var(--card))"/><circle cx={x} cy={y-4} r="4"/><path d={`M${x-8} ${y+8}q8-12 16 0`}/></g>)}</m.g>
    </>}
    {id === 'orders' && <>
      {[60,119,178].map((x,i)=><m.g key={x} animate={{y:active?[0,-6,0]:0}} transition={{...timing,delay:i*.4}}><rect x={x} y={30+i*8} width="44" height="60" rx="6" fill="hsl(var(--card))"/><path d={`M${x+10} ${45+i*8}h24m-24 11h18m-18 11h12`}/><circle cx={x+32} cy={84+i*8} r="10" fill="hsl(var(--background))"/><path d={`m${x+27} ${84+i*8} 4 4 7-8`}/></m.g>)}
    </>}
    {id === 'Scale' && <><path d="M140 26v78M112 105h56M88 45h104m-52-19-7 8h14l-7-8ZM98 45l-19 36h38L98 45Zm84 0-19 36h38l-19-36Z"/><m.path d="M79 81q19 25 38 0m46 0q19 25 38 0" animate={{opacity:active?[.4,1,.4]:1}} transition={timing}/></>}
    {id === 'Leaf' && <m.g animate={float} transition={timing}><path d="M141 107V65m0 21c-47 0-51-30-46-54 25 0 53 15 46 54Zm0-14c-5-31 20-48 45-48 4 30-15 53-45 48Z" fill="hsl(var(--primary) / .07)"/><path d="m114 53 27 33m23-42-23 28"/></m.g>}
    {id === 'MapPin' && <><path d="m64 54 47-15 57 16 48-15v65l-48 15-57-16-47 16V54Zm47-15v65m57-49v65" opacity=".35"/><m.g animate={float} transition={timing}><path d="M160 37c0 19-20 35-20 35s-20-16-20-35a20 20 0 0 1 40 0Z" fill="hsl(var(--card))"/><circle cx="140" cy="36" r="7"/></m.g></>}
    {id === 'Eye' && <><path d="M70 65q70-73 140 0-70 73-140 0Z"/><circle cx="140" cy="65" r="22" fill="hsl(var(--primary) / .06)"/><m.circle cx="140" cy="65" r="8" animate={{cx:active?[140,145,140]:140}} transition={timing}/></>}
  </svg>;
}
