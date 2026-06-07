"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/cn";

type Dir = "up" | "down" | "left" | "right";

function useInViewOnce<T extends HTMLElement>(once = true) {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          if (once) io.disconnect();
        } else if (!once) {
          setShown(false);
        }
      },
      { rootMargin: "0px 0px -60px 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);
  return { ref, shown };
}

/**
 * Scroll-triggered entrance. CSS-transition + IntersectionObserver (no
 * animation-library dependency). Reduced-motion renders statically (handled in
 * the .reveal CSS).
 */
export function Reveal({
  children,
  delay = 0,
  direction = "up",
  className,
  once = true,
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: Dir;
  className?: string;
  once?: boolean;
}) {
  const { ref, shown } = useInViewOnce<HTMLDivElement>(once);
  return (
    <div
      ref={ref}
      data-dir={direction}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
      className={cn("reveal", shown && "is-shown", className)}
    >
      {children}
    </div>
  );
}

/**
 * Staggered group: each direct child reveals in sequence once the group scrolls
 * in. Children should be <RevealItem> (or any element); the group injects a
 * per-child transition delay.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.07,
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  once?: boolean;
}) {
  const { ref, shown } = useInViewOnce<HTMLDivElement>(once);
  return (
    <div ref={ref} className={className}>
      {Children.map(children, (child, i) => {
        if (!isValidElement(child)) return child;
        const el = child as React.ReactElement<{
          __shown?: boolean;
          __delay?: number;
        }>;
        return cloneElement(el, { __shown: shown, __delay: i * stagger });
      })}
    </div>
  );
}

export function RevealItem({
  children,
  direction = "up",
  className,
  __shown,
  __delay,
}: {
  children: React.ReactNode;
  direction?: Dir;
  className?: string;
  __shown?: boolean;
  __delay?: number;
}) {
  return (
    <div
      data-dir={direction}
      style={__delay ? { transitionDelay: `${__delay}s` } : undefined}
      className={cn("reveal", __shown && "is-shown", className)}
    >
      {children}
    </div>
  );
}
