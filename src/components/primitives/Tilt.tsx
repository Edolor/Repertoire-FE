"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { SPRING } from "@/lib/motion";

/**
 * Pointer-driven 3D tilt with an optional moving sheen. Spring-damped, snaps
 * back to flat on leave. Pointer-only (touch never fires mousemove) and fully
 * disabled under reduced-motion. `max` is the peak tilt in degrees.
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
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), SPRING.snappy);
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), SPRING.snappy);
  const sheenBg = useTransform(
    px,
    (v) =>
      `radial-gradient(220px circle at ${v * 100}% 0%, rgb(255 255 255 / 0.14), transparent 60%)`,
  );

  if (reduced) return <div className={className}>{children}</div>;

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className={className}
    >
      {children}
      {sheen && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          style={{ background: sheenBg }}
        />
      )}
    </motion.div>
  );
}
