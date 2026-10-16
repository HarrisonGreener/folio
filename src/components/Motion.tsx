import React, { useEffect, useRef, useState } from 'react';
import { animate, motion, useReducedMotion } from 'framer-motion';

export const EASE = [0.16, 1, 0.3, 1] as const;

/** Rolls a number up to its value (and between values when it changes). */
export const AnimatedNumber: React.FC<{
  value: number;
  decimals?: number;
  duration?: number;
  className?: string;
}> = ({ value, decimals = 0, duration = 1.4, className }) => {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(reduce ? value : 0);
  const from = useRef(reduce ? value : 0);

  useEffect(() => {
    if (reduce) { setShown(value); from.current = value; return; }
    const controls = animate(from.current, value, {
      duration,
      ease: EASE,
      onUpdate: (v) => setShown(v),
    });
    from.current = value;
    return () => controls.stop();
  }, [value, duration, reduce]);

  return (
    <span className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {shown.toLocaleString('en-GB', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
    </span>
  );
};

/** Staggered entrance for lists of cards. */
export const Stagger: React.FC<{ children: React.ReactNode; className?: string; delay?: number; gap?: number }> = ({
  children, className, delay = 0.08, gap = 0.06,
}) => (
  <motion.div
    className={className}
    initial="hidden"
    animate="show"
    variants={{ hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } }}
  >
    {children}
  </motion.div>
);

export const StaggerItem: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <motion.div
    className={className}
    variants={{
      hidden: { opacity: 0, y: 18, scale: 0.985 },
      show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: EASE } },
    }}
  >
    {children}
  </motion.div>
);

/** Page wrapper used by the router in App.tsx */
export const Page: React.FC<{ children: React.ReactNode; id: string }> = ({ children, id }) => (
  <motion.div
    key={id}
    initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    exit={{ opacity: 0, y: -6, filter: 'blur(4px)', transition: { duration: 0.22, ease: EASE } }}
    transition={{ duration: 0.55, ease: EASE }}
  >
    {children}
  </motion.div>
);
