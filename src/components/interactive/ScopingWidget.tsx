"use client";

import { useState } from "react";
import Link from "next/link";
import { ENGAGEMENTS } from "@/content/site";

type Choice = { label: string; weight: Record<string, number> };
type Q = { q: string; choices: Choice[] };

const QUESTIONS: Q[] = [
  {
    q: "Where are you with your agent?",
    choices: [
      { label: "Designing it now", weight: { advisory: 2, build: 1 } },
      { label: "Building, need a piece done right", weight: { build: 3 } },
      { label: "Shipping / shipped", weight: { redteam: 2, advisory: 1 } },
    ],
  },
  {
    q: "What hurts most?",
    choices: [
      { label: "Decisions I can't pressure-test", weight: { advisory: 3 } },
      { label: "A capability we can't build in time", weight: { build: 3 } },
      { label: "Not knowing how it fails under attack", weight: { redteam: 3 } },
    ],
  },
  {
    q: "What would 'done' look like?",
    choices: [
      { label: "A senior reviewer on call", weight: { advisory: 3 } },
      { label: "A scoped thing built and handed over", weight: { build: 3 } },
      { label: "A ranked findings report we can act on", weight: { redteam: 3 } },
    ],
  },
];

export function ScopingWidget() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});

  const choose = (c: Choice) => {
    setScores((prev) => {
      const next = { ...prev };
      for (const k in c.weight) next[k] = (next[k] ?? 0) + c.weight[k];
      return next;
    });
    setStep((s) => s + 1);
  };

  const reset = () => {
    setScores({});
    setStep(0);
  };

  const done = step >= QUESTIONS.length;
  const winnerId = done
    ? Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "advisory"
    : null;
  const match = ENGAGEMENTS.find((e) => e.id === winnerId);

  return (
    <div className="border border-divider bg-surface p-5 font-mono text-sm">
      <p className="mb-4 text-xs uppercase tracking-widest text-text/50">
        <span className="text-accent">&gt;</span> is this engagement right for
        you?
      </p>

      {!done && (
        <div>
          <p className="mb-3 text-text/85">
            {step + 1}/{QUESTIONS.length}: {QUESTIONS[step].q}
          </p>
          <div className="flex flex-col gap-2">
            {QUESTIONS[step].choices.map((c) => (
              <button
                key={c.label}
                type="button"
                onClick={() => choose(c)}
                className="border border-divider px-3 py-2 text-left text-text/80 hover:bg-bg hover:text-text"
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {done && match && (
        <div aria-live="polite">
          <p className="text-text/60">Best fit:</p>
          <p className="mt-1 text-lg font-bold text-text">{match.name}</p>
          <p className="mt-1 text-text/70">{match.tagline}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={`/#contact?engagement=${match.id}`}
              className="bg-accent px-4 py-2 text-accent-fg hover:bg-accent/90"
            >
              Start a {match.name.toLowerCase()} →
            </Link>
            <button
              type="button"
              onClick={reset}
              className="border border-divider px-4 py-2 text-text/70 hover:bg-bg"
            >
              start over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
