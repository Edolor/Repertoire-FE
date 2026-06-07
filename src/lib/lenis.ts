import type Lenis from "lenis";

// Module-level handle to the active Lenis instance so non-scroll components
// (e.g. ScrollToTop) can drive smooth scrolling without prop-drilling or globals.
let instance: Lenis | null = null;
// SmoothScroll parks its rAF when idle (so the page goes truly idle). Any
// programmatic scroll must first wake that loop, or lenis.scrollTo() has no
// frame to animate on. SmoothScroll registers its wake fn here.
let waker: (() => void) | null = null;

export const setLenis = (l: Lenis | null, wake?: (() => void) | null) => {
  instance = l;
  waker = wake ?? null;
};
export const getLenis = () => instance;
export const wakeLenis = () => {
  waker?.();
};
