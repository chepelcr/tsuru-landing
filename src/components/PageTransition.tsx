import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

interface PageTransitionProps {
  children: (displayLocation: string, transitionStage: string, isLayoutSwitch: boolean) => React.ReactNode;
  location: string;
}

export function PageTransition({ children, location }: PageTransitionProps) {
  const [displayLocation, setDisplayLocation] = useState(location);
  const [stage, setStage] = useState('page-enter');
  const displayed = useRef(location);
  const reduced = useReducedMotion();

  useEffect(() => {
    // Returning to the displayed route cancels a pending exit immediately.
    if (location === displayed.current) { setStage('page-enter'); return; }
    const show = () => {
      displayed.current = location;
      setDisplayLocation(location);
      setStage('page-enter');
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    if (reduced) { show(); return; }
    setStage('page-exit');
    const timer = window.setTimeout(show, 160);
    return () => window.clearTimeout(timer);
  }, [location, reduced]);

  return <>{children(displayLocation, stage, false)}</>;
}
