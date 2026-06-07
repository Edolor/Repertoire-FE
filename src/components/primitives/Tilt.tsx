"use client";

import { useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { usePointerSpring } from "@/hooks/usePointerSpring";
import { Spring, SPRINGS } from "@/lib/spring";

/**
 * Pointer-driven 3D tilt with an optional moving sheen. Spring-physics driven
 * (shared `@/lib/spring`) for the same momentum/settle as framer-motion, with
 * no library cost. Pointer-only; disabled under reduced-motion. `max` = peak
 * tilt in degrees. The pointer/rect/rafLoop lifecycle lives in usePointerSpring.
 */
export function Tilt({
  children,
  max = 8,
  sheen = false,
  className,
}: {
  children: React.ReactNode;
  max?: number;
  sheen?: boolean;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLSpanElement>(null);

  usePointerSpring(
    ref,
    !reduced,
    () => {
      const rx = new Spring(0, SPRINGS.snappy);
      const ry = new Spring(0, SPRINGS.snappy);
      const sx = new Spring(0.5, SPRINGS.snappy);
      return {
        springs: [rx, ry, sx],
        onMove: (rect, e) => {
          const px = (e.clientX - rect.left) / rect.width;
          const py = (e.clientY - rect.top) / rect.height;
          ry.setTarget((px - 0.5) * 2 * max);
          rx.setTarget((0.5 - py) * 2 * max);
          sx.setTarget(px);
        },
        onLeave: () => {
          rx.setTarget(0);
          ry.setTarget(0);
        },
        draw: () => {
          const el = ref.current;
          if (el)
            el.style.transform = `perspective(900px) rotateX(${rx.value.toFixed(3)}deg) rotateY(${ry.value.toFixed(3)}deg)`;
          if (sheenRef.current)
            sheenRef.current.style.background = `radial-gradient(220px circle at ${(sx.value * 100).toFixed(1)}% 0%, rgb(255 255 255 / 0.14), transparent 60%)`;
        },
      };
    },
    [reduced, max],
  );

  return (
    <div ref={ref} className={className} style={{ transformStyle: "preserve-3d" }}>
      {children}
      {sheen && !reduced && (
        <span
          ref={sheenRef}
          aria-hidden
          className="decor-heavy pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        />
      )}
    </div>
  );
}
