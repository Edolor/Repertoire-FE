"use client";

import { useEffect } from "react";
import { getLenis } from "@/lib/lenis";

// Lenis hijacks the wheel globally, so a modal's body-scroll lock alone lets the
// page behind keep scrolling. Pausing Lenis while any overlay is open hands the
// wheel back to the browser, so the modal's own scroll container (and React
// Remove Scroll's background block) behave correctly. A counter supports nested
// overlays; Lenis being absent (reduced-motion / OS skin) is a safe no-op.
let locks = 0;

function apply() {
  const lenis = getLenis();
  if (!lenis) return;
  if (locks > 0) lenis.stop();
  else lenis.start();
}

export function lockScroll() {
  locks += 1;
  apply();
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  apply();
}

/** Lock page scroll (pause Lenis) while `active` is true; auto-unlocks. */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    lockScroll();
    return () => unlockScroll();
  }, [active]);
}
