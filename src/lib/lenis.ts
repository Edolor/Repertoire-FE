import type Lenis from "lenis";

// Module-level handle to the active Lenis instance so non-scroll components
// (e.g. ScrollToTop) can drive smooth scrolling without prop-drilling or globals.
let instance: Lenis | null = null;
export const setLenis = (l: Lenis | null) => {
  instance = l;
};
export const getLenis = () => instance;
