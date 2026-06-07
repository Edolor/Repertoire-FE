import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useActiveSection } from "@/hooks/useActiveSection";

type IOEntry = {
  target: { id: string };
  isIntersecting: boolean;
  boundingClientRect: { top: number };
};

let lastCallback: ((entries: IOEntry[]) => void) | null;
let observe: ReturnType<typeof vi.fn>;
let disconnect: ReturnType<typeof vi.fn>;
let unobserve: ReturnType<typeof vi.fn>;

function installIntersectionObserver() {
  lastCallback = null;
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
  class FakeIO {
    constructor(cb: (entries: IOEntry[]) => void) {
      lastCallback = cb;
    }
    observe = observe;
    disconnect = disconnect;
    unobserve = unobserve;
    takeRecords = vi.fn();
    root = null;
    rootMargin = "";
    thresholds = [];
  }
  vi.stubGlobal("IntersectionObserver", FakeIO as unknown as typeof IntersectionObserver);
}

function entry(id: string, isIntersecting: boolean, top: number): IOEntry {
  return { target: { id }, isIntersecting, boundingClientRect: { top } };
}

beforeEach(() => {
  document.body.innerHTML = "";
  const a = document.createElement("section");
  a.id = "alpha";
  const b = document.createElement("section");
  b.id = "beta";
  document.body.append(a, b);
  installIntersectionObserver();
});

describe("useActiveSection", () => {
  it("returns an empty string before any intersection is reported", () => {
    const { result } = renderHook(() => useActiveSection(["alpha", "beta"]));
    expect(result.current).toBe("");
  });

  it("observes every existing element and creates a single observer", () => {
    renderHook(() => useActiveSection(["alpha", "beta"]));
    expect(observe).toHaveBeenCalledTimes(2);
  });

  it("activates the id of the intersecting entry nearest the top", () => {
    const { result } = renderHook(() => useActiveSection(["alpha", "beta"]));
    act(() => {
      lastCallback!([
        entry("beta", true, 120),
        entry("alpha", true, 40),
      ]);
    });
    expect(result.current).toBe("alpha");
  });

  it("ignores non-intersecting entries when choosing the active id", () => {
    const { result } = renderHook(() => useActiveSection(["alpha", "beta"]));
    act(() => {
      lastCallback!([
        entry("alpha", false, 10),
        entry("beta", true, 200),
      ]);
    });
    expect(result.current).toBe("beta");
  });

  it("updates the active id when the observer fires again", () => {
    const { result } = renderHook(() => useActiveSection(["alpha", "beta"]));
    act(() => {
      lastCallback!([entry("alpha", true, 30)]);
    });
    expect(result.current).toBe("alpha");
    act(() => {
      lastCallback!([entry("beta", true, 20)]);
    });
    expect(result.current).toBe("beta");
  });

  it("does not change the active id when no entries are intersecting", () => {
    const { result } = renderHook(() => useActiveSection(["alpha", "beta"]));
    act(() => {
      lastCallback!([entry("alpha", true, 30)]);
    });
    expect(result.current).toBe("alpha");
    act(() => {
      lastCallback!([
        entry("alpha", false, 30),
        entry("beta", false, 50),
      ]);
    });
    expect(result.current).toBe("alpha");
  });

  it("disconnects the observer on unmount", () => {
    const { unmount } = renderHook(() => useActiveSection(["alpha", "beta"]));
    expect(disconnect).not.toHaveBeenCalled();
    unmount();
    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  it("does not create an observer when no matching elements exist", () => {
    const { result } = renderHook(() => useActiveSection(["missing-1", "missing-2"]));
    expect(result.current).toBe("");
    expect(lastCallback).toBeNull();
    expect(observe).not.toHaveBeenCalled();
  });
});
