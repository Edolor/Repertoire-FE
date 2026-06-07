"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Dark-mode cursor-follow spotlight: a faint accent glow that trails the
 * pointer behind the content, adding ambient "light" to the charcoal theme.
 * Shown only in dark (via the dark: variant), on a fine pointer, and never
 * under reduced-motion or reduced-data. rAF-throttled, no React re-render.
 */
export function Spotlight() {
  const [on, setOn] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const data = window.matchMedia("(prefers-reduced-data: reduce)").matches;
    if (!fine || reduced || data) return;
    setOn(true);

    let raf = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 3;
    const draw = () => {
      raf = 0;
      if (ref.current)
        ref.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgb(var(--accent) / 0.07), transparent 60%)`;
    };
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(draw);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    draw();
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  if (!on) return null;
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 hidden dark:block"
    />
  );
}
