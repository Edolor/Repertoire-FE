"use client";

import { useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { usePointerSpring } from "@/hooks/usePointerSpring";
import { Spring, SPRINGS } from "@/lib/spring";

/**
 * Cursor-attracted wrapper. Spring-physics driven (shared `@/lib/spring`) so it
 * trails and settles with the same loose overshoot as framer-motion's magnetic
 * spring, at no library cost. Pointer-only; disabled under reduced-motion. The
 * pointer/rect/rafLoop lifecycle lives in usePointerSpring.
 */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);

  usePointerSpring(
    ref,
    !reduced,
    () => {
      const sx = new Spring(0, SPRINGS.magnetic);
      const sy = new Spring(0, SPRINGS.magnetic);
      return {
        springs: [sx, sy],
        onMove: (rect, e) => {
          sx.setTarget((e.clientX - (rect.left + rect.width / 2)) * strength);
          sy.setTarget((e.clientY - (rect.top + rect.height / 2)) * strength);
        },
        onLeave: () => {
          sx.setTarget(0);
          sy.setTarget(0);
        },
        draw: () => {
          if (ref.current)
            ref.current.style.transform = `translate(${sx.value.toFixed(2)}px,${sy.value.toFixed(2)}px)`;
        },
      };
    },
    [reduced, strength],
  );

  return (
    <span ref={ref} className={className} style={{ display: "inline-block" }}>
      {children}
    </span>
  );
}
