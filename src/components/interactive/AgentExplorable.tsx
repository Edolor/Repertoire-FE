"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

// A canned agent loop over a fake repo. Not a real LLM call. User-driven by
// default; Play only autosteps on explicit click and never with
// prefers-reduced-motion.
type Step = {
  phase: "plan" | "tool" | "result" | "reflect";
  text: string;
};

const STEPS: Step[] = [
  { phase: "plan", text: "Goal: add rate limiting to the contact endpoint. Plan: locate the handler, check for existing middleware, add a bounded limiter, prove it." },
  { phase: "tool", text: "grep -r 'create-message' src/  →  reading contact handler" },
  { phase: "result", text: "Found 1 handler. No limiter present. Untrusted input reaches it directly." },
  { phase: "reflect", text: "Result is trusted as data, not instruction. Note: the handler is the boundary. Proceed, but add the limiter at the boundary, not in the form." },
  { phase: "plan", text: "Add a per-IP token bucket at the route, return 429 with retry-after, keep the happy path unchanged." },
  { phase: "tool", text: "write src/limiter.ts  ·  patch route handler  ·  add test" },
  { phase: "result", text: "Test: 11th request within window → 429. Legit request → 200. Latency delta negligible." },
  { phase: "reflect", text: "Boundary enforced and observable. Done. What I'd watch: shared IPs behind NAT (log, don't block harder)." },
];

const COLOR: Record<Step["phase"], string> = {
  plan: "text-accent-2",
  tool: "text-accent-3",
  result: "text-text/80",
  reflect: "text-accent",
};

export function AgentExplorable() {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!playing || reduced) return;
    if (i >= STEPS.length - 1) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setI((v) => v + 1), 1900);
    return () => clearTimeout(t);
  }, [playing, i, reduced]);

  const step = STEPS[i];

  return (
    <div className="overflow-hidden border border-divider bg-surface font-mono text-sm">
      <div className="flex items-center justify-between border-b border-divider px-3 py-2 text-xs text-text/50">
        <span>watch an agent work: step {i + 1}/{STEPS.length}</span>
        <span>fake-repo @ main</span>
      </div>
      <ol className="divide-y divide-divider" aria-label="Agent loop steps">
        {STEPS.map((s, idx) => (
          <li
            key={idx}
            aria-current={idx === i ? "step" : undefined}
            className={`flex gap-3 px-3 py-2.5 transition-opacity ${
              idx === i ? "bg-bg" : idx < i ? "opacity-50" : "opacity-25"
            }`}
          >
            <span
              className={`w-16 shrink-0 uppercase tracking-wide ${COLOR[s.phase]}`}
            >
              {s.phase}
            </span>
            <span className="text-text/80">{s.text}</span>
          </li>
        ))}
      </ol>
      <div
        className="border-t border-divider px-3 py-2 text-xs text-text/60"
        aria-live="polite"
      >
        now: <span className={COLOR[step.phase]}>{step.phase}</span>
      </div>
      <div className="flex flex-wrap gap-2 border-t border-divider p-2">
        <button
          type="button"
          onClick={() => setI((v) => Math.max(0, v - 1))}
          disabled={i === 0}
          className="border border-divider px-2 py-1 text-xs hover:bg-bg disabled:opacity-40"
        >
          ← prev
        </button>
        <button
          type="button"
          onClick={() => setI((v) => Math.min(STEPS.length - 1, v + 1))}
          disabled={i === STEPS.length - 1}
          className="border border-divider px-2 py-1 text-xs hover:bg-bg disabled:opacity-40"
        >
          next →
        </button>
        {!reduced && (
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="border border-divider px-2 py-1 text-xs hover:bg-bg"
          >
            {playing ? "pause" : "play"}
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            setPlaying(false);
            setI(0);
          }}
          className="border border-divider px-2 py-1 text-xs hover:bg-bg"
        >
          reset
        </button>
      </div>
    </div>
  );
}
