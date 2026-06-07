import { describe, it, expect, vi, beforeEach } from "vitest";

// The module keeps state in module-level variables (ctx/enabled/loaded), so each
// test re-imports a fresh copy after resetting modules + storage.
type SoundModule = typeof import("@/lib/sound");

async function freshImport(): Promise<SoundModule> {
  vi.resetModules();
  return import("@/lib/sound");
}

// A minimal AudioContext stand-in that records how it was exercised.
function makeAudioContextClass() {
  const oscillator = {
    type: "",
    frequency: { value: 0 },
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  };
  const gain = {
    gain: {
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    },
    connect: vi.fn(),
  };
  const instances: unknown[] = [];

  class FakeAudioContext {
    state = "running";
    currentTime = 0;
    destination = { id: "destination" };
    createOscillator = vi.fn(() => oscillator);
    createGain = vi.fn(() => gain);
    resume = vi.fn();
    constructor() {
      instances.push(this);
    }
  }

  return { FakeAudioContext, oscillator, gain, instances };
}

beforeEach(() => {
  localStorage.clear();
});

describe("soundEnabled", () => {
  it("defaults to false when nothing is persisted", async () => {
    const sound = await freshImport();
    expect(sound.soundEnabled()).toBe(false);
  });

  it("reflects a persisted 'on' value", async () => {
    localStorage.setItem("ui-sound", "on");
    const sound = await freshImport();
    expect(sound.soundEnabled()).toBe(true);
  });

  it("treats any non-'on' persisted value as disabled", async () => {
    localStorage.setItem("ui-sound", "off");
    const sound = await freshImport();
    expect(sound.soundEnabled()).toBe(false);
  });
});

describe("setSound", () => {
  it("enabling persists 'on' and flips soundEnabled", async () => {
    const sound = await freshImport();
    sound.setSound(true);
    expect(sound.soundEnabled()).toBe(true);
    expect(localStorage.getItem("ui-sound")).toBe("on");
  });

  it("disabling persists 'off' and flips soundEnabled", async () => {
    localStorage.setItem("ui-sound", "on");
    const sound = await freshImport();
    sound.setSound(false);
    expect(sound.soundEnabled()).toBe(false);
    expect(localStorage.getItem("ui-sound")).toBe("off");
  });
});

describe("toggleSound", () => {
  it("flips from default-off to on and returns the new state", async () => {
    const { FakeAudioContext } = makeAudioContextClass();
    vi.stubGlobal("AudioContext", FakeAudioContext);
    const sound = await freshImport();

    const result = sound.toggleSound();
    expect(result).toBe(true);
    expect(sound.soundEnabled()).toBe(true);
    expect(localStorage.getItem("ui-sound")).toBe("on");
  });

  it("flips from on back to off and returns false", async () => {
    localStorage.setItem("ui-sound", "on");
    const sound = await freshImport();

    const result = sound.toggleSound();
    expect(result).toBe(false);
    expect(sound.soundEnabled()).toBe(false);
    expect(localStorage.getItem("ui-sound")).toBe("off");
  });
});

describe("playTick", () => {
  it("is a no-op when sound is disabled (no AudioContext constructed)", async () => {
    const { FakeAudioContext, instances } = makeAudioContextClass();
    vi.stubGlobal("AudioContext", FakeAudioContext);
    const sound = await freshImport();

    expect(sound.soundEnabled()).toBe(false);
    sound.playTick();
    expect(instances.length).toBe(0);
  });

  it("constructs an AudioContext and wires an oscillator when enabled", async () => {
    const { FakeAudioContext, oscillator, gain, instances } =
      makeAudioContextClass();
    vi.stubGlobal("AudioContext", FakeAudioContext);
    const sound = await freshImport();

    sound.setSound(true);
    sound.playTick(440, 0.05);

    expect(instances.length).toBe(1);
    const ctx = instances[0] as InstanceType<typeof FakeAudioContext>;
    expect(ctx.createOscillator).toHaveBeenCalledTimes(1);
    expect(ctx.createGain).toHaveBeenCalledTimes(1);
    expect(oscillator.type).toBe("square");
    expect(oscillator.frequency.value).toBe(440);
    expect(oscillator.connect).toHaveBeenCalledWith(gain);
    expect(gain.connect).toHaveBeenCalledWith(ctx.destination);
    expect(oscillator.start).toHaveBeenCalledTimes(1);
    expect(oscillator.stop).toHaveBeenCalledWith(0.05);
    expect(gain.gain.setValueAtTime).toHaveBeenCalled();
  });

  it("reuses a single AudioContext across multiple ticks", async () => {
    const { FakeAudioContext, instances } = makeAudioContextClass();
    vi.stubGlobal("AudioContext", FakeAudioContext);
    const sound = await freshImport();

    sound.setSound(true);
    sound.playTick();
    sound.playTick();
    expect(instances.length).toBe(1);
  });

  it("resumes a suspended context", async () => {
    const { FakeAudioContext, instances } = makeAudioContextClass();
    // Instance state defaults to "running"; subclass to exercise the resume branch.
    class SuspendedContext extends FakeAudioContext {
      state = "suspended";
    }
    vi.stubGlobal("AudioContext", SuspendedContext);
    const sound = await freshImport();

    sound.setSound(true);
    sound.playTick();
    const ctx = instances[0] as InstanceType<typeof SuspendedContext>;
    expect(ctx.resume).toHaveBeenCalled();
  });

  it("stays silent (swallows errors) when AudioContext is unavailable", async () => {
    vi.stubGlobal("AudioContext", undefined);
    // webkitAudioContext is also absent, so construction throws and is caught.
    const sound = await freshImport();
    sound.setSound(true);
    expect(() => sound.playTick()).not.toThrow();
  });
});
