import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// `globals` is off, so React Testing Library can't auto-register its cleanup.
// Do it once here, or renders accumulate across tests in the same file.
afterEach(() => cleanup());

// jsdom has neither IntersectionObserver nor matchMedia. Provide inert global
// defaults so rendering any motion-wrapped component (Reveal/Tilt/Magnetic)
// doesn't throw on mount. Tests that need to *drive* these can still override
// locally with vi.stubGlobal (unstubGlobals restores to these defaults).
class NoopIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}
globalThis.IntersectionObserver =
  NoopIntersectionObserver as unknown as typeof IntersectionObserver;

if (!window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
}
