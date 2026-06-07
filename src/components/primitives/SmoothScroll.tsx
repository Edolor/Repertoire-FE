"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { setLenis } from "@/lib/lenis";
import { useOsMode } from "@/components/os/OsModeContext";

/**
 * Inertial smooth scrolling via Lenis. Uses real scroll position (so motion's
 * useScroll, hash links, and the scroll-progress ruler all keep working).
 * Disabled under reduced-motion and in the desktop OS skin — and it now reacts
 * to OS mode toggling at runtime (re-running on `active`), so Lenis is fully
 * torn down when you switch into desktop mode. Otherwise Lenis keeps its
 * non-passive wheel listener alive and swallows gesture scroll inside OS
 * windows.
 */
export function SmoothScroll() {
  const { active: osActive } = useOsMode();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (osActive) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    // Parkable rAF: tick only while scrolling has momentum, then stop — so the
    // page goes truly idle between interactions (no permanent 60Hz loop).
    let raf = 0;
    let idle = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      idle = Math.abs(lenis.velocity) < 0.05 ? idle + 1 : 0;
      if (idle > 24) {
        raf = 0; // settled — park
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    const wake = () => {
      idle = 0;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    window.addEventListener("wheel", wake, { passive: true });
    window.addEventListener("touchstart", wake, { passive: true });
    window.addEventListener("touchmove", wake, { passive: true });
    window.addEventListener("keydown", wake);
    lenis.on("scroll", wake);
    // Register the instance + its wake fn so programmatic scrolls (ScrollToTop)
    // can revive the parked loop before animating.
    setLenis(lenis, wake);
    wake();

    // Make in-page anchor clicks use Lenis so deep links glide, not jump.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.('a[href*="#"]') as
        | HTMLAnchorElement
        | null;
      if (!a) return;
      const url = new URL(a.href, window.location.href);
      if (url.pathname !== window.location.pathname) return;
      const id = url.hash.slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      wake();
      lenis.scrollTo(el, { offset: -72 });
      history.pushState(null, "", url.hash);
    };
    document.addEventListener("click", onClick);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("wheel", wake);
      window.removeEventListener("touchstart", wake);
      window.removeEventListener("touchmove", wake);
      window.removeEventListener("keydown", wake);
      document.removeEventListener("click", onClick);
      setLenis(null);
      lenis.destroy();
    };
  }, [osActive]);

  return null;
}
