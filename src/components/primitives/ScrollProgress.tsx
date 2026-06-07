"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";

const SECTION_IDS = [
  "how-i-build",
  "selected-work",
  "agent-demo",
  "research",
  "writing",
  "about",
  "faq",
  "contact",
];

/**
 * Thin top "spec ruler" that fills with reading progress, with faint tick marks
 * at each section boundary. Tied to scroll (not autonomous motion), so it stays
 * meaningful under reduced-motion — only the spring smoothing is dropped.
 */
export function ScrollProgress() {
  const reduced = useReducedMotion();
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });
  const [ticks, setTicks] = useState<number[]>([]);

  useEffect(() => {
    if (pathname !== "/") {
      setTicks([]);
      return;
    }
    const measure = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      if (docH <= 0) return;
      const next = SECTION_IDS.map((id) => {
        const el = document.getElementById(id);
        if (!el) return null;
        return Math.min(1, Math.max(0, (el.offsetTop - 64) / docH));
      }).filter((v): v is number => v !== null);
      setTicks(next);
    };
    measure();
    window.addEventListener("resize", measure);
    const t = setTimeout(measure, 800); // after fonts/content settle
    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(t);
    };
  }, [pathname]);

  return (
    <div aria-hidden className="fixed inset-x-0 top-0 z-50 h-[2px]">
      <motion.div
        className="h-full origin-left bg-accent"
        style={{ scaleX: reduced ? scrollYProgress : smooth }}
      />
      {ticks.map((t, i) => (
        <span
          key={i}
          className="absolute top-0 h-full w-px bg-text/25"
          style={{ left: `${t * 100}%` }}
        />
      ))}
    </div>
  );
}
