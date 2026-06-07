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
  { phase: "plan", text: "Goal: extract the auth logic out of the request handler into a typed service. Plan: locate the handler, map its call sites, refactor in safe passes, and prove it with tests." },
  { phase: "tool", text: "grep -r 'login' src/  →  reading the handler and its imports" },
  { phase: "result", text: "Found 1 handler, 3 call sites, and an existing test file. The handler mixes parsing, auth, and the response." },
  { phase: "reflect", text: "The seam is the auth step. Plan holds, but do it in two passes: extract the service first, then move the call sites, so each step stays green." },
  { phase: "plan", text: "Extract AuthService behind a typed interface; keep the handler delegating to it; change nothing observable to callers." },
  { phase: "tool", text: "write src/auth-service.ts  ·  patch handler + 3 call sites  ·  run tests" },
  { phase: "result", text: "Tests: 24 passed, 0 failed. Behaviour identical; the handler is 40% smaller and the auth logic is unit-tested in isolation." },
  { phase: "reflect", text: "Done. The loop stayed observable: each tool result fed the next decision. What I'd watch: one call site has a subtle default worth a regression test." },
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
    <div className="panel overflow-hidden border border-divider bg-surface font-mono text-sm">
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
      <div className="flex flex-wrap gap-1.5 border-t border-divider p-2 sm:gap-2">
        <button
          type="button"
          onClick={() => setI((v) => Math.max(0, v - 1))}
          disabled={i === 0}
          className="border border-divider px-2 py-1 text-xs text-text/70 transition-colors hover:bg-bg hover:text-text focus-visible:border-accent-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:text-text/30 disabled:opacity-40"
        >
          ← prev
        </button>
        <button
          type="button"
          onClick={() => setI((v) => Math.min(STEPS.length - 1, v + 1))}
          disabled={i === STEPS.length - 1}
          className="border border-divider px-2 py-1 text-xs text-text/70 transition-colors hover:bg-bg hover:text-text focus-visible:border-accent-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:text-text/30 disabled:opacity-40"
        >
          next →
        </button>
        {!reduced && (
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="border border-divider px-2 py-1 text-xs text-text/70 transition-colors hover:bg-bg hover:text-text focus-visible:border-accent-2 focus-visible:outline-none"
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
