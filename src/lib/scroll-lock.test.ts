import { describe, it, expect, vi, beforeEach } from "vitest";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { getLenis } from "@/lib/lenis";

vi.mock("@/lib/lenis", () => ({
  getLenis: vi.fn(),
}));

const fakeLenis = { stop: vi.fn(), start: vi.fn() };

beforeEach(() => {
  // clearMocks resets call history each test; (re)point getLenis at our fake.
  vi.mocked(getLenis).mockReturnValue(fakeLenis as never);
  fakeLenis.stop.mockClear();
  fakeLenis.start.mockClear();
});

describe("scroll-lock", () => {
  // The lock counter is module-level state shared across tests. Each test below
  // balances its own lock()/unlock() calls so the counter returns to 0, keeping
  // tests independent regardless of execution order.

  it("lockScroll() stops Lenis", () => {
    lockScroll();
    expect(fakeLenis.stop).toHaveBeenCalledTimes(1);
    expect(fakeLenis.start).not.toHaveBeenCalled();
    unlockScroll(); // balance
  });

  it("keeps Lenis stopped through nested locks", () => {
    lockScroll();
    lockScroll();
    // counter > 0 on every apply(), so each lock re-issues stop(), never start().
    expect(fakeLenis.stop).toHaveBeenCalledTimes(2);
    expect(fakeLenis.start).not.toHaveBeenCalled();
    unlockScroll();
    unlockScroll(); // balance
  });

  it("starts Lenis only when the counter returns to 0", () => {
    lockScroll();
    lockScroll();
    fakeLenis.stop.mockClear();

    unlockScroll(); // counter -> 1, still locked: stop(), not start()
    expect(fakeLenis.start).not.toHaveBeenCalled();
    expect(fakeLenis.stop).toHaveBeenCalledTimes(1);

    unlockScroll(); // counter -> 0: start()
    expect(fakeLenis.start).toHaveBeenCalledTimes(1);
  });

  it("a single lock/unlock pair stops then starts", () => {
    lockScroll();
    unlockScroll();
    expect(fakeLenis.stop).toHaveBeenCalledTimes(1);
    expect(fakeLenis.start).toHaveBeenCalledTimes(1);
  });

  it("extra unlockScroll() never drives the counter negative", () => {
    // Counter is already 0 here. Two stray unlocks must keep it clamped at 0,
    // so a subsequent single lock still triggers exactly one stop().
    unlockScroll();
    unlockScroll();
    fakeLenis.start.mockClear();
    fakeLenis.stop.mockClear();

    lockScroll(); // counter 0 -> 1
    expect(fakeLenis.stop).toHaveBeenCalledTimes(1);
    unlockScroll(); // counter -> 0
    expect(fakeLenis.start).toHaveBeenCalledTimes(1);
  });

  it("is a safe no-op when Lenis is absent", () => {
    vi.mocked(getLenis).mockReturnValue(null);
    expect(() => {
      lockScroll();
      unlockScroll();
    }).not.toThrow();
    expect(fakeLenis.stop).not.toHaveBeenCalled();
    expect(fakeLenis.start).not.toHaveBeenCalled();
  });
});
