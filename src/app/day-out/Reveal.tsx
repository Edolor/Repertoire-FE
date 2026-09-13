"use client";

import { useEffect, useRef } from "react";
import styles from "./day-out.module.css";

/**
 * Minimal scroll-in wrapper: adds `.in` once the block is ~15% visible.
 * A few lines of IntersectionObserver rather than the `motion` package so
 * the page stays as light as the card it is imitating. Reduced motion is
 * handled in CSS (the transition collapses, content is simply visible).
 */
export function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add(styles.in);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.add(styles.in);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={[styles.reveal, className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}
