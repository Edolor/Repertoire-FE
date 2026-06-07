"use client";

import { useCallback, useEffect, useRef } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, RefObject } from "react";

/**
 * Modal focus management for a container: when `active`, focus moves into the
 * container on mount and is restored to the previously-focused element on
 * unmount/deactivate. Returns an onKeyDown handler that traps Tab within the
 * container and routes Escape to `onEscape`.
 *
 * Extracted from Window so the maximized Terminal dialog (which previously
 * trapped nothing) shares the exact same, tested behavior.
 */
export function useFocusTrap<T extends HTMLElement>(
  ref: RefObject<T | null>,
  options: { active?: boolean; onEscape?: () => void } = {},
): (e: ReactKeyboardEvent) => void {
  const { active = true, onEscape } = options;
  const onEscapeRef = useRef(onEscape);
  onEscapeRef.current = onEscape;

  useEffect(() => {
    if (!active) return;
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    return () => prev?.focus?.();
  }, [active, ref]);

  return useCallback(
    (e: ReactKeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onEscapeRef.current?.();
        return;
      }
      if (e.key !== "Tab") return;
      const root = ref.current;
      if (!root) return;
      const focusable = Array.from(
        root.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null || el === root);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeEl = document.activeElement as HTMLElement;
      if (e.shiftKey && (activeEl === first || activeEl === root)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && activeEl === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [ref],
  );
}
