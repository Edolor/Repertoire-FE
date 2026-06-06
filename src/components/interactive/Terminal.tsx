"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Cursor } from "@/components/primitives/Cursor";

type Line = { kind: "in" | "out"; text: string };

// Canned, deterministic. No LLM call, no network. The transcript below is
// the SSR/no-JS fallback: it conveys the positioning even if nothing runs.
const BOOT: Line[] = [
  { kind: "out", text: "aghoghomena.com agent shell v1. Type `help`." },
  { kind: "in", text: "whoami" },
  {
    kind: "out",
    text: "Aghoghomena Akasukpe, systems & full-stack engineer. I build the infrastructure under AI agents and ship full-stack product end to end.",
  },
];

const HELP =
  "commands: whoami · ls work/ · run demo · research · contact · clear";

export function Terminal() {
  const [lines, setLines] = useState<Line[]>(BOOT);
  const [value, setValue] = useState("");
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  const push = (next: Line[]) => {
    setLines((prev) => [...prev, ...next]);
    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
  };

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    const echo: Line = { kind: "in", text: raw };
    switch (cmd) {
      case "help":
        push([echo, { kind: "out", text: HELP }]);
        break;
      case "whoami":
        push([
          echo,
          {
            kind: "out",
            text: "Aghoghomena Akasukpe. Systems & full-stack engineer. Best Graduating Student (First Class, 4.88/5.0). MSc CS @ Ontario Tech. Builds agent infra at Farpoint; open to roles.",
          },
        ]);
        break;
      case "ls work/":
      case "ls work":
      case "ls":
        push([
          echo,
          {
            kind: "out",
            text: "mcp-client/  refactor-engine/  full-stack/  data-pipeline/  (opening selected work…)",
          },
        ]);
        setTimeout(() => router.push("/#selected-work"), 350);
        break;
      case "run demo":
        push([
          echo,
          { kind: "out", text: "starting agent loop demo…" },
        ]);
        setTimeout(() => router.push("/#agent-demo"), 350);
        break;
      case "research":
        push([echo, { kind: "out", text: "→ research & publications" }]);
        setTimeout(() => router.push("/#research"), 300);
        break;
      case "contact":
        push([echo, { kind: "out", text: "→ contact" }]);
        setTimeout(() => router.push("/#contact"), 300);
        break;
      case "clear":
        setLines([]);
        break;
      default:
        push([
          echo,
          { kind: "out", text: `command not found: ${cmd}. try \`help\`.` },
        ]);
    }
  };

  return (
    <div className="w-full overflow-hidden border border-divider bg-surface font-mono text-sm">
      {/* faux app-window chrome */}
      <div className="flex items-center gap-2 border-b border-divider px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-accent" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent-3" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent-2" />
        <span className="ml-2 text-xs text-text/50">agent shell</span>
      </div>
      <div
        ref={scrollRef}
        className="h-56 overflow-auto p-3 graph-paper"
        aria-live="polite"
      >
        {lines.map((l, i) => (
          <p
            key={i}
            className={
              l.kind === "in" ? "text-text/90" : "text-text/65"
            }
          >
            {l.kind === "in" && <span className="text-accent">&gt; </span>}
            {l.text}
          </p>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(value);
          setValue("");
        }}
        className="flex items-center gap-2 border-t border-divider px-3 py-2"
      >
        <label htmlFor="term" className="sr-only">
          Terminal command input
        </label>
        <span className="text-accent" aria-hidden>
          &gt;
        </span>
        <input
          id="term"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoComplete="off"
          spellCheck={false}
          placeholder="type a command, e.g. ls work/"
          className="w-full bg-transparent outline-none placeholder:text-text/35"
        />
        <Cursor className="hidden sm:inline-block" />
      </form>
      <div className="flex flex-wrap gap-2 border-t border-divider p-2">
        {["whoami", "ls work/", "run demo", "research", "contact"].map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => run(c)}
            className="border border-divider px-2 py-1 text-xs text-text/70 hover:bg-bg hover:text-text"
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
