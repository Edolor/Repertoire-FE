"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

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
 * Thin top "spec ruler" that fills with reading progress, with faint section
 * ticks. Plain scroll listener + rAF (no animation-library dep). Tied to scroll
 * so it stays meaningful under reduced-motion.
 */
export function ScrollProgress() {
  const pathname = usePathname();
  const bar = useRef<HTMLDivElement>(null);
  const [ticks, setTicks] = useState<number[]>([]);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const p = docH > 0 ? Math.min(1, window.scrollY / docH) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (pathname !== "/") {
      setTicks([]);
      return;
    }
    const measure = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      if (docH <= 0) return;
      setTicks(
        SECTION_IDS.map((id) => {
          const el = document.getElementById(id);
          return el ? Math.min(1, Math.max(0, (el.offsetTop - 64) / docH)) : null;
        }).filter((v): v is number => v !== null),
      );
    };
    measure();
    window.addEventListener("resize", measure);
    const t = setTimeout(measure, 800);
    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(t);
    };
  }, [pathname]);

  return (
    <div aria-hidden className="fixed inset-x-0 top-0 z-50 h-[2px]">
      <div
        ref={bar}
        className="h-full origin-left bg-accent"
        style={{ transform: "scaleX(0)" }}
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
