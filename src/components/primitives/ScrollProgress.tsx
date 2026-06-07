"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Spring, SPRINGS, rafLoop } from "@/lib/spring";

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
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const progress = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      return docH > 0 ? Math.min(1, Math.max(0, window.scrollY / docH)) : 0;
    };
    const apply = (v: number) => {
      if (bar.current) bar.current.style.transform = `scaleX(${v.toFixed(4)})`;
    };

    // Reduced-motion: track scroll directly, no spring smoothing.
    if (reduced) {
      let raf = 0;
      const update = () => {
        raf = 0;
        apply(progress());
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
    }

    // Spring-smoothed fill (matches framer-motion's useSpring feel). The value
    // lives in 0..1, so rest thresholds are tightened ~20x vs the px/deg
    // defaults — otherwise it would park ~1% of the bar short and snap.
    const spring = new Spring(progress(), {
      ...SPRINGS.smooth,
      restDelta: 0.0005,
      restSpeed: 0.001,
    });
    spring.jump(progress());
    apply(spring.value);
    const loop = rafLoop((dt) => {
      spring.step(dt);
      apply(spring.value);
      return !spring.atRest;
    });
    const onScroll = () => {
      spring.setTarget(progress());
      loop.start();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      loop.stop();
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
