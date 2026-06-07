"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Additive engineering crosshair: faint full-viewport guide lines that track
 * the pointer, with a live x/y readout — it augments, never replaces, the native
 * cursor. Mounted only on a fine pointer and never under reduced-motion or
 * reduced-data. rAF-throttled; no React re-render per move.
 */
export function Crosshair() {
  const [enabled, setEnabled] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const vert = useRef<HTMLDivElement>(null);
  const horz = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const data = window.matchMedia("(prefers-reduced-data: reduce)").matches;
    if (!fine || reduced || data) return;
    setEnabled(true);

    let raf = 0;
    let x = 0;
    let y = 0;
    const draw = () => {
      raf = 0;
      if (vert.current) vert.current.style.transform = `translate3d(${x}px,0,0)`;
      if (horz.current) horz.current.style.transform = `translate3d(0,${y}px,0)`;
      if (label.current) {
        label.current.style.transform = `translate3d(${x + 12}px,${y + 14}px,0)`;
        label.current.textContent = `x:${x} y:${y}`;
      }
    };
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (wrap.current && wrap.current.style.opacity !== "1")
        wrap.current.style.opacity = "1";
      if (!raf) raf = requestAnimationFrame(draw);
    };
    const onLeave = () => {
      if (wrap.current) wrap.current.style.opacity = "0";
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

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
      <div
        ref={label}
        className="absolute left-0 top-0 font-mono text-[10px] tabular-nums text-accent/55 will-change-transform"
      />
    </div>
  );
}
