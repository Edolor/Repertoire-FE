"use client";

import { useEffect, useState } from "react";
import { getLenis, wakeLenis } from "@/lib/lenis";
import { cn } from "@/lib/cn";

/**
 * Back-to-top control. Appears after scrolling ~one viewport, glides to top via
 * Lenis when available, else native smooth scroll; instant under reduced-motion.
 */
export function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setShow(window.scrollY > window.innerHeight * 0.8);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const toTop = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = getLenis();
    if (lenis && !reduced) {
      wakeLenis(); // revive the parked rAF so the animation has frames
      lenis.scrollTo(0, { duration: 1, force: true });
    } else {
      window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    }
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Scroll to top"
      title="Scroll to top"
      className={cn(
        "panel fixed bottom-5 right-5 z-40 flex h-10 w-10 items-center justify-center border border-divider bg-surface font-mono text-base text-text/70 transition-all duration-200 hover:border-accent hover:text-accent focus-visible:border-accent-2",
        show
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0",
      )}
    >
      <span aria-hidden>↑</span>
    </button>
  );
}
