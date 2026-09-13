"use client";

import { useEffect, useState } from "react";
import styles from "./day-out.module.css";

/**
 * The one thing on the page she can tap. Pure theatre: no form, no
 * network, nothing sent anywhere. A tap swaps the button for "See you
 * soon." and blooms petals and dots outward; tapping the sign-off again
 * replays the bloom. Remembered per device via localStorage so a reload
 * keeps the answer. Reduced motion skips the bloom and only swaps text.
 */
const KEY = "day-out:coming";

// Deterministic particle field (no randomness, so the smoke test can
// count them). Angle sweeps the circle; distance/delay/colour cycle.
const COUNT = 26;
const PARTICLES = Array.from({ length: COUNT }, (_, i) => {
  const angle = (i / COUNT) * Math.PI * 2 + (i % 2 ? 0.18 : -0.12);
  const dist = 96 + (i % 3) * 32 + (i % 5) * 9;
  return {
    x: Math.round(Math.cos(angle) * dist),
    y: Math.round(Math.sin(angle) * dist * 0.85),
    r: (i % 2 ? 1 : -1) * (90 + (i % 4) * 45),
    d: (i % 4) * 70,
    dot: i % 3 === 2,
    tone: (["blush", "matcha", "blushDeep"] as const)[i % 3],
  };
});

export function Rsvp() {
  const [coming, setComing] = useState(false);
  const [bloom, setBloom] = useState(0);

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY) === "1") setComing(true);
    } catch {}
  }, []);

  const tap = () => {
    setComing(true);
    setBloom((n) => n + 1);
    try {
      localStorage.setItem(KEY, "1");
    } catch {}
  };

  return (
    <div className={styles.rsvp}>
      {bloom > 0 && (
        <div key={bloom} className={styles.bloom} aria-hidden="true" data-bloom>
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              data-petal
              className={`${styles.petal} ${styles[p.tone]} ${p.dot ? styles.dot : ""}`}
              style={
                {
                  "--x": `${p.x}px`,
                  "--y": `${p.y}px`,
                  "--r": `${p.r}deg`,
                  "--d": `${p.d}ms`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}
      <div aria-live="polite">
        {coming ? (
          <button type="button" className={styles.rsvpDone} onClick={tap}>
            See you soon.
          </button>
        ) : (
          <button type="button" className={styles.rsvpBtn} onClick={tap}>
            I’ll be there
          </button>
        )}
      </div>
    </div>
  );
}
