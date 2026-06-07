"use client";

import { useEffect } from "react";
import { showToast } from "@/lib/toast";

const SEQ = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

/** The Konami code → fires a toast and kicks off the self-driving page tour. */
export function KonamiEgg() {
  useEffect(() => {
    let i = 0;
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (k === SEQ[i]) {
        i += 1;
        if (i === SEQ.length) {
          i = 0;
          showToast("↑↑↓↓←→←→ba — agent unlocked. running the tour.");
          window.dispatchEvent(new CustomEvent("start-tour"));
        }
      } else {
        i = k === SEQ[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return null;
}
