"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Minimal image lightbox. Reusable anywhere a full-bleed zoom of a
 * same-origin image is wanted (post figures, screenshots). CSP-safe:
 * no eval, same-origin <img>. Esc / backdrop click / button closes;
 * body scroll is locked while open; honors prefers-reduced-motion.
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
  const reduced = useReducedMotion();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={alt || "Image preview"}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-bg/90 p-4 sm:p-8"
      onClick={onClose}
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
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
    </motion.div>
  );
}
