"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Cursor-attracted wrapper: rAF-lerps toward the pointer while hovered and eases
 * back to rest on leave (no animation-library dep). Pointer-only and disabled
 * under reduced-motion.
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
  const st = useRef({ tx: 0, ty: 0, cx: 0, cy: 0, raf: 0, active: false });

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const s = st.current;
    const loop = () => {
      s.cx += (s.tx - s.cx) * 0.2;
      s.cy += (s.ty - s.cy) * 0.2;
      el.style.transform = `translate(${s.cx.toFixed(2)}px,${s.cy.toFixed(2)}px)`;
      const moving = Math.abs(s.tx - s.cx) > 0.1 || Math.abs(s.ty - s.cy) > 0.1;
      if (moving || s.active) s.raf = requestAnimationFrame(loop);
      else {
        s.raf = 0;
        el.style.transform = "translate(0,0)";
      }
    };
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      s.tx = (e.clientX - (r.left + r.width / 2)) * strength;
      s.ty = (e.clientY - (r.top + r.height / 2)) * strength;
      s.active = true;
      if (!s.raf) s.raf = requestAnimationFrame(loop);
    };
    const onLeave = () => {
      s.tx = 0;
      s.ty = 0;
      s.active = false;
      if (!s.raf) s.raf = requestAnimationFrame(loop);
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      if (s.raf) cancelAnimationFrame(s.raf);
    };
  }, [reduced, strength]);

  return (
    <span ref={ref} className={className} style={{ display: "inline-block" }}>
      {children}
    </span>
  );
}
