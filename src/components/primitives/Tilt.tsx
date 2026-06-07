"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Pointer-driven 3D tilt with an optional moving sheen. rAF-lerped toward the
 * pointer, eased back to flat on leave (no animation-library dep). Pointer-only
 * and disabled under reduced-motion. `max` is the peak tilt in degrees.
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
  const st = useRef({ tx: 0.5, ty: 0.5, cx: 0.5, cy: 0.5, raf: 0, hover: false });

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const s = st.current;
    const loop = () => {
      s.cx += (s.tx - s.cx) * 0.15;
      s.cy += (s.ty - s.cy) * 0.15;
      const rx = (0.5 - s.cy) * 2 * max;
      const ry = (s.cx - 0.5) * 2 * max;
      el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      if (sheenRef.current)
        sheenRef.current.style.background = `radial-gradient(220px circle at ${(s.cx * 100).toFixed(1)}% 0%, rgb(255 255 255 / 0.14), transparent 60%)`;
      const moving =
        Math.abs(s.tx - s.cx) > 0.001 || Math.abs(s.ty - s.cy) > 0.001;
      s.raf = moving || s.hover ? requestAnimationFrame(loop) : 0;
    };
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      s.tx = (e.clientX - r.left) / r.width;
      s.ty = (e.clientY - r.top) / r.height;
      s.hover = true;
      if (!s.raf) s.raf = requestAnimationFrame(loop);
    };
    const onLeave = () => {
      s.tx = 0.5;
      s.ty = 0.5;
      s.hover = false;
      if (!s.raf) s.raf = requestAnimationFrame(loop);
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      if (s.raf) cancelAnimationFrame(s.raf);
    };
  }, [reduced, max]);

  return (
    <div ref={ref} className={className} style={{ transformStyle: "preserve-3d" }}>
      {children}
      {sheen && !reduced && (
        <span
          ref={sheenRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        />
      )}
    </div>
  );
}
