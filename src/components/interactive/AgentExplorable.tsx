"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { playTick } from "@/lib/sound";

// A canned agent loop over a fake repo. Not a real LLM call. User-driven by
// default; auto-plays ONCE when scrolled into view (never with reduced-motion).
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
const DOT: Record<Step["phase"], string> = {
  plan: "bg-accent-2",
  tool: "bg-accent-3",
  result: "bg-text/60",
  reflect: "bg-accent",
};

export function AgentExplorable() {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const autoStarted = useRef(false);

  // Auto-play once on scroll-in (motion budget: one pass, then it rests).
  useEffect(() => {
    if (reduced || autoStarted.current) return;
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !autoStarted.current) {
          autoStarted.current = true;
          setPlaying(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  useEffect(() => {
    if (!playing || reduced) return;
    if (i >= STEPS.length - 1) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setI((v) => v + 1), 1900);
    return () => clearTimeout(t);
  }, [playing, i, reduced]);

  // Tick on each step advance when sound is enabled.
  useEffect(() => {
    playTick(560 + i * 18);
  }, [i]);

  const step = STEPS[i];
  const done = i >= STEPS.length - 1 && !playing;
  const progress = (i / (STEPS.length - 1)) * 100;

  return (
    <div
      ref={rootRef}
      className="panel overflow-hidden border border-divider bg-surface font-mono text-sm"
    >
      <div className="flex items-center justify-between border-b border-divider px-3 py-2 text-xs text-text/60">
        <span>watch an agent work: step {i + 1}/{STEPS.length}</span>
        <span className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 ${done ? "text-accent" : "text-accent-3"}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${done ? "bg-accent" : "bg-accent-3"} ${playing ? "animate-pulse" : ""}`}
            />
            {done ? "complete" : playing ? "running" : "ready"}
          </span>
          <span className="text-text/60">fake-repo @ main</span>
        </span>
      </div>

      {/* animated progress connector for the whole loop */}
      <div className="h-px w-full bg-divider/50">
        <div
          className="h-px bg-accent transition-[width] duration-500 ease-out motion-reduce:transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* The full step list is visual; all 8 rows render at once (dimmed),
          which would make a screen reader read every step out of sync with the
          "current" state. The live region below is the AT source of truth, so
          this list is hidden from the a11y tree. */}
      <ol className="relative" aria-hidden="true">
        {/* vertical tool-call rail */}
        <span aria-hidden className="absolute left-[1.15rem] top-0 h-full w-px bg-divider" />
        {STEPS.map((s, idx) => {
          const current = idx === i;
          return (
            <li
              key={idx}
              aria-current={current ? "step" : undefined}
              className={`relative flex gap-3 border-b border-divider px-3 py-2.5 transition-opacity last:border-b-0 ${
                current ? "bg-bg" : idx < i ? "opacity-50" : "opacity-25"
              }`}
            >
              <span className="relative z-[1] mt-1.5 flex">
                <span
                  className={`h-2 w-2 rounded-full ${DOT[s.phase]} ${current && playing ? "animate-ping absolute" : ""}`}
                />
                <span className={`h-2 w-2 rounded-full ${DOT[s.phase]}`} />
              </span>
              <span className={`w-14 shrink-0 uppercase tracking-wide ${COLOR[s.phase]}`}>
                {s.phase}
              </span>
              <span className={`text-text/80 ${current && playing ? "shimmer-text" : ""}`}>
                {s.text}
              </span>
            </li>
          );
        })}
      </ol>

      <div
        className="border-t border-divider px-3 py-2 text-xs text-text/60"
        aria-live="polite"
      >
        now: <span className={COLOR[step.phase]}>{step.phase}</span>
        {/* Carry the actual step content to AT (not just the phase token), so a
            screen reader hears the substance of each step as it becomes
            current via auto-play or the prev/next buttons. */}
        <span className="sr-only">: {step.text}</span>
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
