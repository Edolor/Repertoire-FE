import { describe, it, expect, vi, afterEach } from "vitest";
import {
  isFinePointer,
  isHoverPointer,
  prefersReducedMotion,
  prefersReducedData,
  ambientEffectsAllowed,
} from "@/lib/media";

/** Stub matchMedia so a given set of queries report `matches: true`. */
function stubMatchMedia(trueQueries: string[]) {
  vi.stubGlobal("matchMedia", (q: string) => ({
    matches: trueQueries.includes(q),
    media: q,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
  // jsdom reads window.matchMedia; stubGlobal also sets it on window.
  window.matchMedia = globalThis.matchMedia;
}

const FINE = "(pointer: fine)";
const HOVER = "(hover: hover) and (pointer: fine)";
const RM = "(prefers-reduced-motion: reduce)";
const RD = "(prefers-reduced-data: reduce)";

afterEach(() => vi.unstubAllGlobals());

describe("media predicates", () => {
  it("each predicate reflects its query", () => {
    stubMatchMedia([FINE, HOVER, RM, RD]);
    expect(isFinePointer()).toBe(true);
    expect(isHoverPointer()).toBe(true);
    expect(prefersReducedMotion()).toBe(true);
    expect(prefersReducedData()).toBe(true);
  });

  it("returns false when the query does not match", () => {
    stubMatchMedia([]);
    expect(isFinePointer()).toBe(false);
    expect(isHoverPointer()).toBe(false);
    expect(prefersReducedMotion()).toBe(false);
    expect(prefersReducedData()).toBe(false);
  });
});

describe("ambientEffectsAllowed", () => {
  it("is true only on a fine pointer with no reduced-motion/data", () => {
    stubMatchMedia([FINE, HOVER]);
    expect(ambientEffectsAllowed()).toBe(true);
  });

  it("is false on a coarse pointer", () => {
    stubMatchMedia([]);
    expect(ambientEffectsAllowed()).toBe(false);
  });

  it("is false when reduced-motion is requested", () => {
    stubMatchMedia([FINE, HOVER, RM]);
    expect(ambientEffectsAllowed()).toBe(false);
  });

  it("is false when reduced-data is requested", () => {
    stubMatchMedia([FINE, HOVER, RD]);
    expect(ambientEffectsAllowed()).toBe(false);
  });
});
