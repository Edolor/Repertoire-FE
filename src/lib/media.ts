/**
 * Synchronous matchMedia predicates — the single place the "when do ambient
 * effects run" policy is stated, instead of re-typing the query strings (and
 * risking a silent typo) across Crosshair, Spotlight, SpecDots, Tilt, Magnetic
 * and Hero. Read once inside effects; SSR-safe (false when there's no window).
 */
const matches = (query: string): boolean =>
  typeof window !== "undefined" && window.matchMedia(query).matches;

export const isFinePointer = () => matches("(pointer: fine)");
export const isHoverPointer = () =>
  matches("(hover: hover) and (pointer: fine)");
export const prefersReducedMotion = () =>
  matches("(prefers-reduced-motion: reduce)");
export const prefersReducedData = () =>
  matches("(prefers-reduced-data: reduce)");

/**
 * Decorative ambient effects (cursor crosshair, spotlight, spec dots) are
 * allowed only on a fine pointer when the user has asked for neither reduced
 * motion nor reduced data.
 */
export const ambientEffectsAllowed = () =>
  isFinePointer() && !prefersReducedMotion() && !prefersReducedData();
