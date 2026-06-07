"use client";

import { useEffect, useState } from "react";
import { soundEnabled, toggleSound } from "@/lib/sound";

/** Opt-in UI sound toggle. Off by default; state persists to localStorage. */
export function SoundToggle() {
  const [on, setOn] = useState(false);
  useEffect(() => setOn(soundEnabled()), []);
  return (
    <button
      type="button"
      onClick={() => setOn(toggleSound())}
      aria-pressed={on}
      aria-label={on ? "Turn UI sound off" : "Turn UI sound on"}
      className="link-underline text-text/50 transition-colors hover:text-text"
    >
      sound: {on ? "on" : "off"}
    </button>
  );
}
