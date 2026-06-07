import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, act, cleanup } from "@testing-library/react";
import { useRafPointer } from "@/hooks/useRafPointer";

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

/** Queries that make ambientEffectsAllowed() return true. */
const AMBIENT_OK = [FINE, HOVER];

/** Capture rAF callbacks so the test can flush them on demand. */
function stubRaf() {
  const cbs: FrameRequestCallback[] = [];
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    cbs.push(cb);
    return cbs.length;
  });
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
  return {
    cbs,
    flush() {
      let now = 0;
      while (cbs.length) cbs.shift()!((now += 16));
    },
  };
}

type HarnessProps = {
  draw: (x: number, y: number) => void;
  onMove?: (x: number, y: number) => void;
};

function Harness({ draw, onMove }: HarnessProps) {
  const enabled = useRafPointer(draw, { onMove });
  return <div data-testid="probe">{enabled ? "enabled" : "disabled"}</div>;
}

function move(x: number, y: number) {
  window.dispatchEvent(
    new PointerEvent("pointermove", { clientX: x, clientY: y }),
  );
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("useRafPointer", () => {
  it("enables and rAF-coalesces a draw with the pointer coordinates", () => {
    stubMatchMedia(AMBIENT_OK);
    const raf = stubRaf();
    const draw = vi.fn();

    act(() => {
      render(<Harness draw={draw} />);
    });

    // ambient gate passed -> enabled true
    expect(screen.getByTestId("probe")).toHaveTextContent("enabled");

    // a raw move schedules an rAF but does not draw synchronously
    act(() => move(42, 99));
    expect(draw).not.toHaveBeenCalled();
    expect(raf.cbs.length).toBe(1);

    // flushing the frame draws with the move coordinates
    act(() => raf.flush());
    expect(draw).toHaveBeenCalledTimes(1);
    expect(draw).toHaveBeenCalledWith(42, 99);
  });

  it("coalesces multiple moves in a frame into a single draw of the latest position", () => {
    stubMatchMedia(AMBIENT_OK);
    const raf = stubRaf();
    const draw = vi.fn();

    act(() => {
      render(<Harness draw={draw} />);
    });

    act(() => {
      move(1, 1);
      move(2, 2);
      move(3, 3);
    });
    // only one frame scheduled across the three moves
    expect(raf.cbs.length).toBe(1);

    act(() => raf.flush());
    expect(draw).toHaveBeenCalledTimes(1);
    expect(draw).toHaveBeenCalledWith(3, 3);
  });

  it("calls onMove on every raw move, before the coalesced draw", () => {
    stubMatchMedia(AMBIENT_OK);
    stubRaf();
    const draw = vi.fn();
    const onMove = vi.fn();

    act(() => {
      render(<Harness draw={draw} onMove={onMove} />);
    });

    act(() => {
      move(10, 20);
      move(11, 21);
    });
    // onMove fires per raw move, independent of the rAF throttle
    expect(onMove).toHaveBeenCalledTimes(2);
    expect(onMove).toHaveBeenNthCalledWith(1, 10, 20);
    expect(onMove).toHaveBeenNthCalledWith(2, 11, 21);
    expect(draw).not.toHaveBeenCalled();
  });

  it("stays disabled and never draws when the pointer is coarse (gate fails)", () => {
    stubMatchMedia([]); // no (pointer: fine) -> ambient not allowed
    const raf = stubRaf();
    const draw = vi.fn();

    act(() => {
      render(<Harness draw={draw} />);
    });

    expect(screen.getByTestId("probe")).toHaveTextContent("disabled");

    act(() => move(5, 5));
    expect(draw).not.toHaveBeenCalled();
    expect(raf.cbs.length).toBe(0);
  });
});
