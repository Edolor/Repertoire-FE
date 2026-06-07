"use client";

import { useEffect, useState } from "react";
import { TOAST_EVENT, type ToastDetail } from "@/lib/toast";

/** Listens for ui-toast events and renders a small stack of transient toasts. */
export function Toaster() {
  const [items, setItems] = useState<ToastDetail[]>([]);
  useEffect(() => {
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const onToast = (e: Event) => {
      const d = (e as CustomEvent<ToastDetail>).detail;
      setItems((x) => [...x, d]);
      const t = setTimeout(() => {
        setItems((x) => x.filter((i) => i.id !== d.id));
        timers.delete(t);
      }, 2600);
      timers.add(t);
    };
    window.addEventListener(TOAST_EVENT, onToast);
    return () => {
      window.removeEventListener(TOAST_EVENT, onToast);
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-5 left-1/2 z-[90] flex -translate-x-1/2 flex-col items-center gap-2"
    >
      {items.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto border border-divider bg-surface px-4 py-2 font-mono text-xs text-text shadow-[0_12px_30px_-15px_rgb(0_0_0/0.55)] animate-[toast-in_0.3s_ease] motion-reduce:animate-none"
        >
          <span className="text-accent">&gt;</span> {t.message}
        </div>
      ))}
    </div>
  );
}
