"use client";

import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";

/**
 * Thin top "spec ruler" that fills with reading progress. Tied to scroll (not
 * autonomous motion), so it stays meaningful under reduced-motion — only the
 * spring smoothing is dropped there.
 */
export function ScrollProgress() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-accent"
      style={{ scaleX: reduced ? scrollYProgress : smooth }}
    />
  );
}
