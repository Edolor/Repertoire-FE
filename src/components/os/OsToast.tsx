"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A token-styled, auto-dismissing toast (no dependency). It is mounted by
 * OsGate, which outlives the OS shell, so the "switched to website mode"
 * confirmation survives the shell unmounting on exit. Fires on the
 * `os-toast` window event.
 */
export function OsToast() {
  const [msg, setMsg] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const onToast = (e: Event) => {
      setMsg((e as CustomEvent<string>).detail);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setMsg(null), 2600);
    };
    window.addEventListener("os-toast", onToast);
    return () => {
      window.removeEventListener("os-toast", onToast);
      clearTimeout(timer.current);
    };
  }, []);

  if (!msg) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="os-window-anim fixed bottom-5 left-1/2 z-[90] -translate-x-1/2 border border-divider bg-bg px-4 py-2 font-mono text-xs text-text shadow-2xl"
    >
      <span className="mr-2 text-accent" aria-hidden>
        &gt;
      </span>
      {msg}
    </div>
  );
}
