"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Spring, SPRINGS, rafLoop } from "@/lib/spring";

/**
 * Cursor-attracted wrapper. Spring-physics driven (shared `@/lib/spring`) so it
 * trails and settles with the same loose overshoot as framer-motion's magnetic
 * spring, at no library cost. Pointer-only; disabled under reduced-motion.
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

  useEffect(() => {
    if (reduced) return;
    // Pointer-only: true no-op on touch / coarse pointers.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = ref.current;
    if (!el) return;
    const sx = new Spring(0, SPRINGS.magnetic);
    const sy = new Spring(0, SPRINGS.magnetic);
    let active = false;
    let rect = el.getBoundingClientRect();

    const loop = rafLoop((dt) => {
      sx.step(dt);
      sy.step(dt);
      el.style.transform = `translate(${sx.value.toFixed(2)}px,${sy.value.toFixed(2)}px)`;
      return active || !sx.atRest || !sy.atRest;
    });

    const onEnter = () => {
      rect = el.getBoundingClientRect();
    };
    const onMove = (e: MouseEvent) => {
      sx.setTarget((e.clientX - (rect.left + rect.width / 2)) * strength);
      sy.setTarget((e.clientY - (rect.top + rect.height / 2)) * strength);
      active = true;
      loop.start();
    };
    const onLeave = () => {
      sx.setTarget(0);
      sy.setTarget(0);
      active = false;
      loop.start();
    };
    const onResize = () => {
      rect = el.getBoundingClientRect();
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", onResize);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
      loop.stop();
    };
  }, [reduced, strength]);

  return (
    <span ref={ref} className={className} style={{ display: "inline-block" }}>
      {children}
    </span>
  );
}
