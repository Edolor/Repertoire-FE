"use client";

import { useEffect, useState } from "react";
import { useScrollLock } from "@/lib/scroll-lock";

/**
 * Minimal image lightbox. Reusable anywhere a full-bleed zoom of a
 * same-origin image is wanted (post figures, screenshots). CSP-safe:
 * no eval, same-origin <img>. Esc / backdrop click / button closes;
 * body scroll is locked while open. The fade-in is a CSS opacity
 * transition (no animation library), auto-disabled under reduced motion.
 */
export function Lightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  const [shown, setShown] = useState(false);
  useScrollLock(true); // mounted only while open

  useEffect(() => {
    // Flip to opacity:1 on the next frame so the CSS transition runs.
    const raf = requestAnimationFrame(() => setShown(true));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt || "Image preview"}
      data-lenis-prevent
      className="fixed inset-0 z-[100] flex items-center justify-center bg-bg/90 p-4 transition-opacity duration-150 ease-out motion-reduce:transition-none sm:p-8"
      style={{ opacity: shown ? 1 : 0 }}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close preview"
        className="absolute right-4 top-4 font-mono text-xs uppercase tracking-[0.15em] text-text/60 hover:text-accent"
      >
        [esc] close
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        className="max-h-full max-w-full cursor-zoom-out border border-divider object-contain"
      />
    </div>
  );
}
