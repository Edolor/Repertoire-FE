/**
 * One motion language for the whole site. Every component imports easings,
 * springs and durations from here so timing reads as a single system, not a
 * pile of ad-hoc magic numbers. Tuned for "precise instrument that's alive":
 * confident springs, restrained distances, fast micro-interactions.
 */
import type { Transition, Variants } from "motion/react";

// Authoritative cubic-bezier for non-spring tweens (the existing house curve).
export const EASE_OUT: [number, number, number, number] = [0.21, 0.47, 0.32, 0.98];
export const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1];

// Durations (seconds). Micro-interactions are fast; entrances are calm.
export const DUR = {
  fast: 0.18,
  base: 0.42,
  slow: 0.6,
} as const;

// Springs. `soft` for entrances and layout, `snappy` for hovers/press,
// `magnetic` for cursor-tracking elements (low stiffness, follows smoothly).
export const SPRING = {
  soft: { type: "spring", stiffness: 240, damping: 28, mass: 0.9 },
  snappy: { type: "spring", stiffness: 420, damping: 34, mass: 0.7 },
  magnetic: { type: "spring", stiffness: 180, damping: 16, mass: 0.5 },
} satisfies Record<string, Transition>;

// Stagger step between siblings revealing in sequence.
export const STAGGER = 0.07;

type Dir = "up" | "down" | "left" | "right";

const offset = (dir: Dir, d: number) => {
  switch (dir) {
    case "up":
      return { y: d };
    case "down":
      return { y: -d };
    case "left":
      return { x: d };
    case "right":
      return { x: -d };
  }
};

/** Entrance variants for a single revealing element. */
export function revealVariants(dir: Dir = "up", distance = 16): Variants {
  return {
    hidden: { opacity: 0, ...offset(dir, distance) },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { ...SPRING.soft, opacity: { duration: DUR.base, ease: EASE_OUT } },
    },
  };
}

/** Parent variants that stagger children carrying `revealVariants`. */
export function staggerParent(stagger = STAGGER, delayChildren = 0): Variants {
  return {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren },
    },
  };
}
