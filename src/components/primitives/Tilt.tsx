"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Spring, SPRINGS, rafLoop } from "@/lib/spring";

/**
 * Pointer-driven 3D tilt with an optional moving sheen. Spring-physics driven
 * (shared `@/lib/spring`) for the same momentum/settle as framer-motion, with
 * no library cost. Pointer-only; disabled under reduced-motion. `max` = peak
 * tilt in degrees.
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

  useEffect(() => {
    if (reduced) return;
    // Pointer-only: true no-op on touch / coarse pointers.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = ref.current;
    if (!el) return;
    const rx = new Spring(0, SPRINGS.snappy);
    const ry = new Spring(0, SPRINGS.snappy);
    const sx = new Spring(0.5, SPRINGS.snappy);
    let hover = false;
    let rect = el.getBoundingClientRect(); // cached; refreshed on enter/resize

    const loop = rafLoop((dt) => {
      rx.step(dt);
      ry.step(dt);
      sx.step(dt);
      el.style.transform = `perspective(900px) rotateX(${rx.value.toFixed(3)}deg) rotateY(${ry.value.toFixed(3)}deg)`;
      if (sheenRef.current)
        sheenRef.current.style.background = `radial-gradient(220px circle at ${(sx.value * 100).toFixed(1)}% 0%, rgb(255 255 255 / 0.14), transparent 60%)`;
      const animating = hover || !rx.atRest || !ry.atRest || !sx.atRest;
      // Drop the compositor-layer hint once we settle, so N idle cards don't
      // each keep a GPU layer alive for the page's whole lifetime.
      if (!animating) el.style.willChange = "";
      return animating;
    });

    const onEnter = () => {
      rect = el.getBoundingClientRect();
      el.style.willChange = "transform";
    };
    const onMove = (e: MouseEvent) => {
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      ry.setTarget((px - 0.5) * 2 * max);
      rx.setTarget((0.5 - py) * 2 * max);
      sx.setTarget(px);
      hover = true;
      loop.start();
    };
    const onLeave = () => {
      rx.setTarget(0);
      ry.setTarget(0);
      hover = false;
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
  }, [reduced, max]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ transformStyle: "preserve-3d" }}
    >
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
