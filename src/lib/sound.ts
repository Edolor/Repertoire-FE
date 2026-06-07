// Tiny Web Audio UI ticks. OFF by default; opt-in persisted to localStorage.
// No assets, no library — a short square-wave blip synthesized on demand.
let ctx: AudioContext | null = null;
let enabled = false;
let loaded = false;

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  enabled = localStorage.getItem("ui-sound") === "on";
}

export function soundEnabled() {
  load();
  return enabled;
}

export function setSound(on: boolean) {
  loaded = true;
  enabled = on;
  if (typeof window !== "undefined")
    localStorage.setItem("ui-sound", on ? "on" : "off");
}

export function toggleSound() {
  setSound(!soundEnabled());
  if (enabled) playTick(720);
  return enabled;
}

export function playTick(freq = 620, dur = 0.03) {
  load();
  if (!enabled || typeof window === "undefined") return;
  try {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    ctx = ctx || new AC();
    // Browsers start the context suspended until a gesture; ticks fire from
    // clicks, so resume() here is within a user gesture and is allowed.
    if (ctx.state === "suspended") void ctx.resume();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "square";
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.045, ctx.currentTime + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + dur);
  } catch {
    /* audio not available — silent */
  }
}
