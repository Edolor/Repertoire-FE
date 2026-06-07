"use client";

import { motion, useReducedMotion } from "motion/react";
import { revealVariants, staggerParent, SPRING, DUR, EASE_OUT } from "@/lib/motion";

type Dir = "up" | "down" | "left" | "right";

/**
 * Scroll-triggered entrance. Spring-eased and directional, part of the shared
 * motion language. Motion budget is spent only on entrance; with
 * prefers-reduced-motion the content renders statically (no transform, no fade).
 */
export function Reveal({
  children,
  delay = 0,
  direction = "up",
  distance = 16,
  className,
  once = true,
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: Dir;
  distance?: number;
  className?: string;
  once?: boolean;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  const v = revealVariants(direction, distance);
  return (
    <motion.div
      className={className}
      variants={v}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-60px" }}
      transition={{ ...SPRING.soft, delay, opacity: { duration: DUR.base, ease: EASE_OUT, delay } }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Reveals children in a staggered sequence as the group scrolls in. Pair with
 * <RevealItem> for each child. Reduced-motion renders everything statically.
 */
export function RevealGroup({
  children,
  className,
  stagger,
  delayChildren = 0,
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  once?: boolean;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={staggerParent(stagger, delayChildren)}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-60px" }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  direction = "up",
  distance = 16,
  className,
}: {
  children: React.ReactNode;
  direction?: Dir;
  distance?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={revealVariants(direction, distance)}>
      {children}
    </motion.div>
  );
}
