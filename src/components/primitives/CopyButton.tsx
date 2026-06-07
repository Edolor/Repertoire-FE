"use client";

import { showToast } from "@/lib/toast";
import { playTick } from "@/lib/sound";

/** Copies a value to the clipboard and confirms via a toast. */
export function CopyButton({
  value,
  label,
  className,
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      playTick();
      showToast(`copied ${label ?? value}`);
    } catch {
      showToast("copy failed — select and copy manually");
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${label ?? value}`}
      className={
        className ??
        "border border-divider px-2 py-1 font-mono text-[11px] uppercase tracking-widest text-text/60 transition-colors hover:border-accent hover:text-accent focus-visible:border-accent-2 focus-visible:outline-none"
      }
    >
      copy
    </button>
  );
}
