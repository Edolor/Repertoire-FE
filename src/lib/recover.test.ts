import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  isStaleChunkError,
  hardReload,
  autoRecoverOnce,
  cleanRecoverParam,
} from "@/lib/recover";

describe("isStaleChunkError", () => {
  it("matches a ChunkLoadError name in a string", () => {
    expect(isStaleChunkError("ChunkLoadError")).toBe(true);
  });

  it('matches "Loading chunk X failed"', () => {
    expect(isStaleChunkError("Loading chunk 412 failed")).toBe(true);
    expect(isStaleChunkError("Loading chunk app-abc123 failed")).toBe(true);
  });

  it("matches CSS chunk failures", () => {
    expect(isStaleChunkError("Loading CSS chunk 7 failed")).toBe(true);
  });

  it("matches dynamic-import failures", () => {
    expect(
      isStaleChunkError("Failed to fetch dynamically imported module"),
    ).toBe(true);
    expect(
      isStaleChunkError("error loading dynamically imported module"),
    ).toBe(true);
    expect(isStaleChunkError("Importing a module script failed")).toBe(true);
  });

  it("is case-insensitive", () => {
    expect(isStaleChunkError("chunkloaderror")).toBe(true);
  });

  it("reads the message field of an error object", () => {
    expect(isStaleChunkError({ message: "Loading chunk 5 failed" })).toBe(true);
  });

  it("reads a real Error instance's message", () => {
    expect(isStaleChunkError(new Error("ChunkLoadError: ..."))).toBe(true);
  });

  it("reads reason.message (PromiseRejectionEvent shape)", () => {
    expect(
      isStaleChunkError({ reason: { message: "Loading chunk 9 failed" } }),
    ).toBe(true);
  });

  it("returns false for an unrelated string", () => {
    expect(isStaleChunkError("Something else went wrong")).toBe(false);
  });

  it("returns false for a plain TypeError (negative)", () => {
    expect(isStaleChunkError(new TypeError("x is not a function"))).toBe(false);
  });

  it("returns false for undefined / null / empty", () => {
    expect(isStaleChunkError(undefined)).toBe(false);
    expect(isStaleChunkError(null)).toBe(false);
    expect(isStaleChunkError("")).toBe(false);
  });

  it("returns false for an object without message or reason", () => {
    expect(isStaleChunkError({ foo: "bar" })).toBe(false);
  });
});

describe("hardReload", () => {
  let replace: ReturnType<typeof vi.fn>;
  let reload: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    replace = vi.fn();
    reload = vi.fn();
    vi.stubGlobal("location", {
      href: "https://example.com/page?a=1",
      replace,
      reload,
    } as unknown as Location);
  });

  it("replaces the URL with a cache-bust _r param", () => {
    hardReload();
    expect(replace).toHaveBeenCalledTimes(1);
    const target = replace.mock.calls[0][0] as string;
    const u = new URL(target);
    expect(u.searchParams.has("_r")).toBe(true);
    expect(u.searchParams.get("a")).toBe("1");
    expect(Number(u.searchParams.get("_r"))).toBeGreaterThan(0);
    expect(reload).not.toHaveBeenCalled();
  });

  it("falls back to reload() when URL construction/replace throws", () => {
    vi.stubGlobal("location", {
      get href(): string {
        throw new Error("boom");
      },
      replace,
      reload,
    } as unknown as Location);
    hardReload();
    expect(reload).toHaveBeenCalledTimes(1);
    expect(replace).not.toHaveBeenCalled();
  });
});

describe("autoRecoverOnce", () => {
  let replace: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    replace = vi.fn();
    vi.stubGlobal("location", {
      href: "https://example.com/page",
      replace,
      reload: vi.fn(),
    } as unknown as Location);
    sessionStorage.clear();
  });

  it("returns true on the first call and triggers a reload", () => {
    expect(autoRecoverOnce()).toBe(true);
    expect(replace).toHaveBeenCalledTimes(1);
    expect(Number(sessionStorage.getItem("stale-reload-ts"))).toBeGreaterThan(0);
  });

  it("returns false within the window (guard prevents a loop)", () => {
    expect(autoRecoverOnce(12000)).toBe(true);
    replace.mockClear();
    expect(autoRecoverOnce(12000)).toBe(false);
    expect(replace).not.toHaveBeenCalled();
  });

  it("returns true again once the window has elapsed", () => {
    const now = Date.now();
    const spy = vi.spyOn(Date, "now");
    spy.mockReturnValue(now);
    expect(autoRecoverOnce(1000)).toBe(true);
    replace.mockClear();

    spy.mockReturnValue(now + 2000);
    expect(autoRecoverOnce(1000)).toBe(true);
    expect(replace).toHaveBeenCalledTimes(1);
  });
});

describe("cleanRecoverParam", () => {
  let replaceState: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    replaceState = vi.fn();
    vi.stubGlobal("history", {
      replaceState,
    } as unknown as History);
  });

  it("strips the _r param via history.replaceState", () => {
    vi.stubGlobal("location", {
      href: "https://example.com/page?a=1&_r=12345#frag",
    } as unknown as Location);
    cleanRecoverParam();
    expect(replaceState).toHaveBeenCalledTimes(1);
    const url = replaceState.mock.calls[0][2] as string;
    expect(url).toBe("/page?a=1#frag");
  });

  it("is a no-op when _r is absent", () => {
    vi.stubGlobal("location", {
      href: "https://example.com/page?a=1",
    } as unknown as Location);
    cleanRecoverParam();
    expect(replaceState).not.toHaveBeenCalled();
  });

  it("swallows errors when location.href throws", () => {
    vi.stubGlobal("location", {
      get href(): string {
        throw new Error("boom");
      },
    } as unknown as Location);
    expect(() => cleanRecoverParam()).not.toThrow();
    expect(replaceState).not.toHaveBeenCalled();
  });
});
