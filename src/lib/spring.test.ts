import { describe, it, expect, vi } from "vitest";
import { Spring, SPRINGS, rafLoop } from "@/lib/spring";

describe("Spring", () => {
  it("initializes value/target equal and at rest", () => {
    const s = new Spring(5, SPRINGS.soft);
    expect(s.value).toBe(5);
    expect(s.target).toBe(5);
    expect(s.velocity).toBe(0);
    expect(s.atRest).toBe(true);
  });

  it("converges to its target and comes to rest", () => {
    const s = new Spring(0, SPRINGS.snappy);
    s.setTarget(100);
    for (let i = 0; i < 600; i++) s.step(1 / 60);
    expect(s.value).toBeCloseTo(100, 1);
    expect(s.atRest).toBe(true);
  });

  it("is not at rest while still moving", () => {
    const s = new Spring(0, SPRINGS.soft);
    s.setTarget(100);
    s.step(1 / 60);
    expect(s.atRest).toBe(false);
    expect(s.value).toBeGreaterThan(0);
    expect(s.value).toBeLessThan(100);
  });

  it("jump() sets value+target with no residual motion", () => {
    const s = new Spring(0, SPRINGS.soft);
    s.setTarget(50);
    s.step(1 / 60);
    s.jump(10);
    expect(s.value).toBe(10);
    expect(s.target).toBe(10);
    expect(s.velocity).toBe(0);
    expect(s.atRest).toBe(true);
  });

  it("guards against a zero mass (no Infinity)", () => {
    const s = new Spring(0, { stiffness: 200, damping: 20, mass: 0 });
    s.setTarget(10);
    s.step(1 / 60);
    expect(Number.isFinite(s.value)).toBe(true);
  });

  it("self-heals a poisoned (NaN) value", () => {
    const s = new Spring(0, SPRINGS.soft);
    s.setTarget(10);
    (s as unknown as { value: number }).value = NaN;
    s.step(1 / 60);
    expect(Number.isFinite(s.value)).toBe(true);
  });

  it("is frame-rate independent (60fps ≈ 120fps over equal time)", () => {
    const a = new Spring(0, SPRINGS.snappy);
    const b = new Spring(0, SPRINGS.snappy);
    a.setTarget(100);
    b.setTarget(100);
    for (let i = 0; i < 300; i++) a.step(1 / 60); // 5s
    for (let i = 0; i < 600; i++) b.step(1 / 120); // 5s
    expect(a.value).toBeCloseTo(b.value, 0);
  });

  it("clamps a huge dt (tab stall) without exploding", () => {
    const s = new Spring(0, SPRINGS.snappy);
    s.setTarget(100);
    s.step(5);
    expect(Number.isFinite(s.value)).toBe(true);
    expect(Math.abs(s.value)).toBeLessThan(1000);
  });
});

describe("SPRINGS presets", () => {
  it("every preset has positive stiffness/damping/mass", () => {
    for (const key of Object.keys(SPRINGS) as (keyof typeof SPRINGS)[]) {
      const c = SPRINGS[key];
      expect(c.stiffness).toBeGreaterThan(0);
      expect(c.damping).toBeGreaterThan(0);
      expect(c.mass).toBeGreaterThan(0);
    }
  });
});

describe("rafLoop", () => {
  it("starts, ticks each frame, and parks when tick returns false", () => {
    const cbs: FrameRequestCallback[] = [];
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      cbs.push(cb);
      return cbs.length;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());

    let ticks = 0;
    const loop = rafLoop(() => {
      ticks += 1;
      return ticks < 3;
    });
    loop.start();
    expect(loop.running).toBe(true);

    let now = 0;
    while (cbs.length) cbs.shift()!((now += 16));

    expect(ticks).toBe(3);
    expect(loop.running).toBe(false);
  });

  it("start() is idempotent; stop() cancels the frame", () => {
    const cbs: FrameRequestCallback[] = [];
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      cbs.push(cb);
      return cbs.length;
    });
    const caf = vi.fn();
    vi.stubGlobal("cancelAnimationFrame", caf);

    const loop = rafLoop(() => true);
    loop.start();
    loop.start();
    expect(cbs.length).toBe(1); // only one frame scheduled
    loop.stop();
    expect(caf).toHaveBeenCalled();
    expect(loop.running).toBe(false);
  });
});
