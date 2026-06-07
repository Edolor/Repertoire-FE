"use client";

import { useEffect, useRef, useState } from "react";
import { playTick } from "@/lib/sound";

// A simulated agent that drives the page: plan → act (scroll) → observe, with a
// narrated caption. Triggered by the `start-tour` event (Konami code, command
// palette, or the AgentDemo button). Reduced-motion jumps instead of gliding.
const STEPS = [
  { id: "hero", say: "plan: map the system, then walk it top to bottom" },
  { id: "how-i-build", say: "act: scroll → how I build (the three pillars)" },
  { id: "selected-work", say: "observe: selected work, NDA-sanitized" },
  { id: "agent-demo", say: "act: this is the agent loop I structure" },
  { id: "research", say: "observe: external evidence (PST 2025, MITACS)" },
  { id: "about", say: "act: who's behind it + experience" },
  { id: "contact", say: "reflect: that's the tour — here's how to reach me" },
];

export function SelfDrivingTour() {
  const [active, setActive] = useState(false);
  const [idx, setIdx] = useState(0);
  const running = useRef(false);
  const timers = useRef<number[]>([]);

  const clearAll = () => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  };
  const stop = () => {
    running.current = false;
    clearAll();
    setActive(false);
    setIdx(0);
  };

  useEffect(() => {
    const start = () => {
      if (running.current) return;
      running.current = true;
      setActive(true);
      setIdx(0);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const step = (i: number) => {
        if (!running.current) return;
        if (i >= STEPS.length) {
          timers.current.push(window.setTimeout(stop, 1400));
          return;
        }
        setIdx(i);
        document
          .getElementById(STEPS[i].id)
          ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
        playTick(520 + i * 40);
        timers.current.push(window.setTimeout(() => step(i + 1), reduced ? 1100 : 2100));
      };
      step(0);
    };
    window.addEventListener("start-tour", start);
    return () => {
      window.removeEventListener("start-tour", start);
      clearAll();
    };
  }, []);

  if (!active) return null;
  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-[85] w-[min(92vw,30rem)] -translate-x-1/2">
      <div className="panel pointer-events-auto flex items-center gap-3 border border-divider bg-surface px-4 py-2.5 font-mono text-xs">
        <span className="flex items-center gap-1.5 text-accent">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          agent
        </span>
        <span className="flex-1 truncate text-text/80">{STEPS[idx].say}</span>
        <span className="tabular-nums text-text/40">
          {idx + 1}/{STEPS.length}
        </span>
        <button
          type="button"
          onClick={stop}
          className="border border-divider px-2 py-0.5 text-text/70 hover:bg-bg hover:text-text"
        >
          stop
        </button>
      </div>
    </div>
  );
}
