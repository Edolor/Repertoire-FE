"use client";

import { useEffect } from "react";
import type { RefObject, DependencyList } from "react";
import { rafLoop, type Spring } from "@/lib/spring";
import { isHoverPointer } from "@/lib/media";

export type PointerSpringConfig = {
  /** The springs to step each frame. */
  springs: Spring[];
  /** Set the springs' targets from the pointer position (rect is cached). */
  onMove: (rect: DOMRect, e: MouseEvent) => void;
  /** Reset targets when the pointer leaves. */
  onLeave: () => void;
  /** Write the current spring values to the DOM. */
  draw: () => void;
};

/**
 * Shared pointer-driven spring scaffold behind Tilt and Magnetic. Owns the
 * fine/hover-pointer guard, the bounding-rect cache (refreshed on enter/resize),
 * the self-parking rafLoop with an at-rest predicate, the will-change toggle,
 * and listener cleanup. Callers supply only their springs, target math, and
 * draw step via `factory` (run once per effect so the springs are fresh).
 *
 * `enabled` should already fold in reduced-motion (callers pass `!reduced`).
 */
export function usePointerSpring(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
  factory: () => PointerSpringConfig,
  deps: DependencyList,
) {
  useEffect(() => {
    if (!enabled) return;
    // Pointer-only: a true no-op on touch / coarse pointers.
    if (!isHoverPointer()) return;
    const el = ref.current;
    if (!el) return;

    const { springs, onMove, onLeave, draw } = factory();
    let active = false;
    let rect = el.getBoundingClientRect();

    const loop = rafLoop((dt) => {
      for (const s of springs) s.step(dt);
      draw();
      const animating = active || springs.some((s) => !s.atRest);
      // Drop the compositor-layer hint once settled, so idle elements don't
      // each keep a GPU layer alive for the page's whole lifetime.
      if (!animating) el.style.willChange = "";
      return animating;
    });

    const handleEnter = () => {
      rect = el.getBoundingClientRect();
      el.style.willChange = "transform";
    };
    const handleMove = (e: MouseEvent) => {
      onMove(rect, e);
      active = true;
      loop.start();
    };
    const handleLeave = () => {
      onLeave();
      active = false;
      loop.start();
    };
    const handleResize = () => {
      rect = el.getBoundingClientRect();
    };

    el.addEventListener("mouseenter", handleEnter);
    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    window.addEventListener("resize", handleResize);
    return () => {
      el.removeEventListener("mouseenter", handleEnter);
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
      window.removeEventListener("resize", handleResize);
      loop.stop();
    };
    // Caller owns the dependency list (matches the previous inline effects).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
