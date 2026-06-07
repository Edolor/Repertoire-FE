"use client";

import { useEffect, useRef, useState } from "react";
import { ambientEffectsAllowed } from "@/lib/media";

type RafPointerOptions = {
  /** Initial pointer position (e.g. viewport center). Defaults to 0,0. */
  initial?: () => { x: number; y: number };
  /** Run `draw` once on mount with the initial position. */
  drawOnInit?: boolean;
  /** Side-effect on each raw move, before the rAF-coalesced draw (e.g. fade in). */
  onMove?: (x: number, y: number) => void;
  /** Document-level pointerleave handler (e.g. fade out). */
  onLeave?: () => void;
};

/**
 * Shared raw-rAF pointer-follow loop behind the ambient cursor overlays
 * (Crosshair, Spotlight). Owns the ambient-effects gate, a single-shot
 * coalesced rAF throttle (one draw per frame, no React re-render per move),
 * the passive pointermove listener, optional document pointerleave, and
 * cleanup. Returns `enabled` so the component can render null until allowed.
 *
 * Callbacks are read through refs, so the effect subscribes once and always
 * calls the latest closure without re-binding listeners.
 */
export function useRafPointer(
  draw: (x: number, y: number) => void,
  options: RafPointerOptions = {},
): boolean {
  const [enabled, setEnabled] = useState(false);
  const drawRef = useRef(draw);
  const optsRef = useRef(options);
  drawRef.current = draw;
  optsRef.current = options;

  useEffect(() => {
    if (!ambientEffectsAllowed()) return;
    setEnabled(true);

    const init = optsRef.current.initial?.() ?? { x: 0, y: 0 };
    let x = init.x;
    let y = init.y;
    let raf = 0;

    const render = () => {
      raf = 0;
      drawRef.current(x, y);
    };
    if (optsRef.current.drawOnInit) drawRef.current(x, y);

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      optsRef.current.onMove?.(x, y);
      if (!raf) raf = requestAnimationFrame(render);
    };
    const onLeave = () => optsRef.current.onLeave?.();

    window.addEventListener("pointermove", onMove, { passive: true });
    if (optsRef.current.onLeave)
      document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return enabled;
}
