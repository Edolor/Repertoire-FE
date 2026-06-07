import { describe, it, expect, vi, beforeEach } from "vitest";
import type Lenis from "lenis";
import { setLenis, getLenis, wakeLenis } from "@/lib/lenis";

// Minimal stand-in for a Lenis instance; the module only stores/returns the
// reference, so its shape is irrelevant to the tested behavior.
const fakeLenis = { scrollTo: vi.fn() } as unknown as Lenis;

describe("lenis handle", () => {
  beforeEach(() => {
    // Reset module state between tests (clearMocks/restoreMocks don't touch it).
    setLenis(null);
  });

  it("getLenis returns null before any instance is set", () => {
    expect(getLenis()).toBeNull();
  });

  it("setLenis stores the instance so getLenis returns it", () => {
    setLenis(fakeLenis);
    expect(getLenis()).toBe(fakeLenis);
  });

  it("setLenis(null) clears the stored instance", () => {
    setLenis(fakeLenis);
    expect(getLenis()).toBe(fakeLenis);
    setLenis(null);
    expect(getLenis()).toBeNull();
  });

  it("wakeLenis calls the registered waker", () => {
    const wake = vi.fn();
    setLenis(fakeLenis, wake);
    wakeLenis();
    expect(wake).toHaveBeenCalledTimes(1);
  });

  it("wakeLenis is a safe no-op when no waker is registered", () => {
    setLenis(fakeLenis);
    expect(() => wakeLenis()).not.toThrow();
  });

  it("wakeLenis is a safe no-op when nothing is set at all", () => {
    expect(() => wakeLenis()).not.toThrow();
  });

  it("setLenis without a wake arg clears any previous waker", () => {
    const wake = vi.fn();
    setLenis(fakeLenis, wake);
    setLenis(fakeLenis); // re-set without a waker
    wakeLenis();
    expect(wake).not.toHaveBeenCalled();
  });

  it("setLenis(null) also clears the waker", () => {
    const wake = vi.fn();
    setLenis(fakeLenis, wake);
    setLenis(null);
    wakeLenis();
    expect(wake).not.toHaveBeenCalled();
  });

  it("treats an explicit null waker the same as omitted", () => {
    const wake = vi.fn();
    setLenis(fakeLenis, wake);
    setLenis(fakeLenis, null);
    wakeLenis();
    expect(wake).not.toHaveBeenCalled();
  });
});
