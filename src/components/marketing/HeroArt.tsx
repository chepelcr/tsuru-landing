import { useRef } from 'react';
import { m, useInView, useReducedMotion } from 'motion/react';

// Editorial illustration of a catalog flowing into an order, not a product screenshot.
export function HeroArt() {
  const ref = useRef<SVGSVGElement>(null);
  const visible = useInView(ref, {amount:.3});
  const reduced = useReducedMotion();
  const active = visible && !reduced;
  return <svg ref={ref} className="hero-art" viewBox="0 0 540 510" fill="none" aria-hidden="true">
    <ellipse cx="275" cy="253" rx="235" ry="217" fill="hsl(var(--primary) / .065)"/>
    <ellipse cx="277" cy="457" rx="184" ry="15" fill="hsl(var(--foreground) / .05)"/>
    <g stroke="hsl(var(--primary))" strokeWidth="1.4" opacity=".25"><path d="M27 362c72-31 68-140 123-188M486 287c-27-63-5-129-48-189"/><path d="M71 305c-39 4-48-16-43-38 27 0 40 14 43 38Zm12-29c-8-31 5-46 25-48 9 26-1 41-25 48ZM461 177c25-4 36-20 30-39-27 4-37 18-30 39Z" fill="hsl(var(--primary) / .15)"/></g>
    <g transform="translate(67 93) rotate(-5 165 163)">
      <rect width="327" height="338" rx="20" fill="hsl(var(--card))" stroke="hsl(var(--border))"/>
      <path d="M0 58h327" stroke="hsl(var(--border))"/>
      <circle cx="25" cy="29" r="5" fill="hsl(var(--primary))"/><rect x="41" y="25" width="98" height="8" rx="4" fill="hsl(var(--foreground) / .75)"/><rect x="245" y="23" width="60" height="13" rx="6" fill="hsl(var(--primary) / .12)"/>
      {[[22,78],[177,78],[22,198],[177,198]].map(([x,y],i)=><g key={i} transform={`translate(${x} ${y})`}>
        <rect width="128" height="105" rx="10" fill="hsl(var(--muted) / .7)"/>
        {i===0&&<g stroke="hsl(var(--accent))" strokeWidth="1.5"><path d="M38 67c-4-32 57-32 53 0v13H38V67Z" fill="hsl(var(--accent) / .13)"/><path d="m53 48-7 17m23-19-8 19m23-12-8 14"/></g>}
        {i===1&&<g stroke="hsl(var(--primary))" strokeWidth="1.5"><path d="M48 46h32l-4 36H52l-4-36Z" fill="hsl(var(--primary) / .12)"/><path d="M64 46V26m0 9c-19 0-23-13-21-21 16 1 24 8 21 21Zm0-5c0-16 14-21 26-20-1 14-13 23-26 20Z"/></g>}
        {i===2&&<g stroke="hsl(var(--accent))" strokeWidth="1.5"><path d="M42 38h40v39H42V38Zm40 7h9c13 0 12 23-9 23M39 82h48" fill="hsl(var(--accent) / .09)"/></g>}
        {i===3&&<g stroke="hsl(var(--primary))" strokeWidth="1.5"><rect x="50" y="39" width="29" height="40" rx="5" fill="hsl(var(--primary) / .1)"/><path d="M56 30h17v9H56V30ZM56 54h17m-17 8h11"/></g>}
        <rect x="8" y="91" width="65" height="4" rx="2" fill="hsl(var(--foreground) / .25)"/>
      </g>)}
    </g>
    <m.g animate={{y:active?[0,-7,0]:0}} transition={{duration:5,repeat:active?Infinity:0,ease:'easeInOut'}}>
      <rect x="284" y="231" width="216" height="201" rx="18" fill="hsl(var(--card))" stroke="hsl(var(--primary) / .35)"/>
      <rect x="305" y="252" width="77" height="7" rx="3.5" fill="hsl(var(--foreground) / .7)"/><rect x="418" y="247" width="62" height="18" rx="9" fill="hsl(var(--primary) / .12)"/>
      {[287,320,353].map((y,i)=><g key={y}><rect x="305" y={y} width="24" height="24" rx="5" fill={`hsl(var(--${i===1?'primary':'accent'}) / .1)`}/><rect x="340" y={y+3} width={74-i*10} height="5" rx="2.5" fill="hsl(var(--foreground) / .35)"/><rect x="340" y={y+14} width="43" height="4" rx="2" fill="hsl(var(--foreground) / .15)"/><path d={`m463 ${y+10} 5 5 8-10`} stroke="hsl(var(--primary))" strokeWidth="1.5"/></g>)}
      <path d="M305 390h174" stroke="hsl(var(--border))"/><rect x="305" y="403" width="62" height="6" rx="3" fill="hsl(var(--foreground) / .4)"/><rect x="431" y="400" width="48" height="10" rx="4" fill="hsl(var(--primary))"/>
    </m.g>
    <circle cx="436" cy="148" r="33" fill="hsl(var(--primary))"/><path d="m422 148 10 10 18-21" stroke="hsl(var(--primary-foreground))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M461 186v20q0 10-10 10h-24" stroke="hsl(var(--primary) / .4)" strokeWidth="1.5" strokeDasharray="4 5"/>
    <path d="m219 30 3 8 8 3-8 3-3 8-3-8-8-3 8-3 3-8Z" fill="hsl(var(--accent) / .45)"/>
  </svg>;
}
