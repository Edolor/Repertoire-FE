import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type ChangeListener = (e: { matches: boolean }) => void;

function makeMatchMedia(initialMatches: boolean) {
  const listeners = new Set<ChangeListener>();
  const addEventListener = vi.fn(
    (type: string, cb: ChangeListener) => type === "change" && listeners.add(cb),
  );
  const removeEventListener = vi.fn(
    (type: string, cb: ChangeListener) =>
      type === "change" && listeners.delete(cb),
  );
  const mq = {
    matches: initialMatches,
    media: "(prefers-reduced-motion: reduce)",
    addEventListener,
    removeEventListener,
  };
  const matchMedia = vi.fn(() => mq);
  // Fire a change event to all registered listeners.
  const emit = (matches: boolean) => {
    mq.matches = matches;
    listeners.forEach((cb) => cb({ matches }));
  };
  return { matchMedia, mq, addEventListener, removeEventListener, emit, listeners };
}

describe("useReducedMotion", () => {
  beforeEach(() => {
    // Each test installs its own controllable matchMedia.
  });

  it("returns the initial matches value (true)", () => {
    const { matchMedia } = makeMatchMedia(true);
    vi.stubGlobal("matchMedia", matchMedia);

    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
    expect(matchMedia).toHaveBeenCalledWith("(prefers-reduced-motion: reduce)");
  });

  it("returns the initial matches value (false)", () => {
    const { matchMedia } = makeMatchMedia(false);
    vi.stubGlobal("matchMedia", matchMedia);

    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it("subscribes to the 'change' event on mount", () => {
    const { matchMedia, addEventListener } = makeMatchMedia(false);
    vi.stubGlobal("matchMedia", matchMedia);

    renderHook(() => useReducedMotion());
    expect(addEventListener).toHaveBeenCalledTimes(1);
    expect(addEventListener).toHaveBeenCalledWith("change", expect.any(Function));
  });

  it("updates when the media query fires a change event", async () => {
    const { matchMedia, emit } = makeMatchMedia(false);
    vi.stubGlobal("matchMedia", matchMedia);

    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);

    const { act } = await import("@testing-library/react");
    act(() => emit(true));
    expect(result.current).toBe(true);

    act(() => emit(false));
    expect(result.current).toBe(false);
  });

  it("removes the listener on unmount", () => {
    const { matchMedia, removeEventListener, listeners } = makeMatchMedia(false);
    vi.stubGlobal("matchMedia", matchMedia);

    const { unmount } = renderHook(() => useReducedMotion());
    expect(listeners.size).toBe(1);

    unmount();
    expect(removeEventListener).toHaveBeenCalledTimes(1);
    expect(removeEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );
    expect(listeners.size).toBe(0);
  });

  it("removes the same handler it added", () => {
    const { matchMedia, addEventListener, removeEventListener } =
      makeMatchMedia(false);
    vi.stubGlobal("matchMedia", matchMedia);

    const { unmount } = renderHook(() => useReducedMotion());
    unmount();

    const added = addEventListener.mock.calls[0][1];
    const removed = removeEventListener.mock.calls[0][1];
    expect(removed).toBe(added);
  });
});
