"use client";

import { useRef } from "react";
import { useRafPointer } from "@/hooks/useRafPointer";

/**
 * Dark-mode cursor-follow spotlight: a faint accent glow that trails the
 * pointer behind the content, adding ambient "light" to the charcoal theme.
 * Shown only in dark (via the dark: variant), on a fine pointer, and never
 * under reduced-motion or reduced-data (the gate lives in useRafPointer).
 * rAF-throttled, no React re-render.
 */
export function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);

  const enabled = useRafPointer(
    (x, y) => {
      if (ref.current)
        ref.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgb(var(--accent) / 0.07), transparent 60%)`;
    },
    {
      initial: () => ({ x: window.innerWidth / 2, y: window.innerHeight / 3 }),
      drawOnInit: true,
    },
  );

  if (!enabled) return null;
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 hidden dark:block"
    />
  );
}
