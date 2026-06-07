"use client";

import { useRef } from "react";
import { useRafPointer } from "@/hooks/useRafPointer";

/**
 * Additive engineering crosshair: faint full-viewport guide lines that track
 * the pointer — it augments, never replaces, the native cursor. Mounted only on
 * a fine pointer and never under reduced-motion or reduced-data (the gate lives
 * in useRafPointer). rAF-throttled; no React re-render per move.
 */
export function Crosshair() {
  const wrap = useRef<HTMLDivElement>(null);
  const vert = useRef<HTMLDivElement>(null);
  const horz = useRef<HTMLDivElement>(null);

  const enabled = useRafPointer(
    (x, y) => {
      if (vert.current) vert.current.style.transform = `translate3d(${x}px,0,0)`;
      if (horz.current) horz.current.style.transform = `translate3d(0,${y}px,0)`;
    },
    {
      onMove: () => {
        if (wrap.current && wrap.current.style.opacity !== "1")
          wrap.current.style.opacity = "1";
      },
      onLeave: () => {
        if (wrap.current) wrap.current.style.opacity = "0";
      },
    },
  );

  if (!enabled) return null;
  return (
    <div
      ref={wrap}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] opacity-0 transition-opacity duration-300"
    >
      <div
        ref={vert}
        className="absolute inset-y-0 left-0 w-px bg-accent/15 will-change-transform"
      />
      <div
        ref={horz}
        className="absolute inset-x-0 top-0 h-px bg-accent/15 will-change-transform"
      />
    </div>
  );
}
