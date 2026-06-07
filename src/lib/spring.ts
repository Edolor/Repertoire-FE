/**
 * Reusable spring physics — the shared motion core for the whole site.
 *
 * This is a tiny (~1KB) stand-in for framer-motion's springs: a real
 * stiffness/damping/mass integrator with the same feel (overshoot, settle,
 * momentum), but with zero library cost. Use it anywhere a value should chase a
 * target with physical motion: cursor-follow, tilt, scroll smoothing, etc.
 *
 * Frame-rate independent: dt is clamped (tab-switch safety) and integrated with
 * fixed 240Hz substeps so stiff springs stay stable regardless of display Hz.
 */
export type SpringConfig = {
  stiffness: number;
  damping: number;
  mass: number;
  /** distance from target considered "arrived" */
  restDelta?: number;
  /** speed below which motion is considered stopped */
  restSpeed?: number;
};

/**
 * Named presets — the single source of truth for motion feel. These mirror the
 * framer-motion configs the site used before, so the physical feel is identical.
 */
export const SPRINGS = {
  /** entrances, layout — calm, near-critically damped */
  soft: { stiffness: 240, damping: 28, mass: 0.9 },
  /** hovers, tilt — quick with a touch of life */
  snappy: { stiffness: 420, damping: 34, mass: 0.7 },
  /** cursor-follow — loose, trailing, gentle overshoot */
  magnetic: { stiffness: 180, damping: 16, mass: 0.5 },
  /** scroll-linked smoothing */
  smooth: { stiffness: 120, damping: 30, mass: 0.4 },
} satisfies Record<string, SpringConfig>;

const SUBSTEP = 1 / 240; // fixed integration step
const MAX_DT = 0.064; // clamp ~4 frames so a stall never explodes the spring

export class Spring {
  value: number;
  velocity = 0;
  target: number;
  private k: number;
  private c: number;
  private m: number;
  private restDelta: number;
  private restSpeed: number;

  constructor(initial: number, cfg: SpringConfig) {
    this.value = initial;
    this.target = initial;
    this.k = cfg.stiffness;
    this.c = cfg.damping;
    this.m = cfg.mass || 1; // guard against divide-by-zero for the reusable API
    // Match framer-motion's rest tightness by default; 0..1-range consumers
    // (e.g. scroll progress) pass smaller values via restDelta/restSpeed.
    this.restDelta = cfg.restDelta ?? 0.01;
    this.restSpeed = cfg.restSpeed ?? 0.01;
  }

  setTarget(t: number) {
    this.target = t;
  }

  /** Hard-set value+target with no motion (e.g. on mount or resize). */
  jump(v: number) {
    this.value = v;
    this.target = v;
    this.velocity = 0;
  }

  /** Advance the spring by `dt` seconds (semi-implicit Euler, substepped). */
  step(dt: number): number {
    // Self-heal if a caller ever poisons the spring with a non-finite value.
    if (!Number.isFinite(this.value)) this.value = this.target;
    let remaining = Math.min(dt, MAX_DT);
    while (remaining > 0) {
      const h = remaining < SUBSTEP ? remaining : SUBSTEP;
      const force = -this.k * (this.value - this.target) - this.c * this.velocity;
      this.velocity += (force / this.m) * h;
      this.value += this.velocity * h;
      remaining -= h;
    }
    return this.value;
  }

  /** True once the spring has effectively reached and stopped at its target. */
  get atRest(): boolean {
    return (
      Math.abs(this.velocity) <= this.restSpeed &&
      Math.abs(this.target - this.value) <= this.restDelta
    );
  }
}

export type RafLoop = {
  start: () => void;
  stop: () => void;
  readonly running: boolean;
};

/**
 * A self-stopping rAF loop. `tick(dt)` returns `true` to keep animating or
 * `false` to park (no idle frames once springs are at rest — this is what keeps
 * the CPU cost near zero between interactions).
 */
export function rafLoop(tick: (dt: number) => boolean): RafLoop {
  let raf = 0;
  let last = 0;
  const frame = (now: number) => {
    const dt = last ? (now - last) / 1000 : 1 / 60;
    last = now;
    raf = tick(dt) ? requestAnimationFrame(frame) : 0;
    if (!raf) last = 0;
  };
  return {
    start() {
      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    },
    stop() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
    },
    get running() {
      return raf !== 0;
    },
  };
}
