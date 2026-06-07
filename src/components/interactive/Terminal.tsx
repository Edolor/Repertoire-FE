"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Cursor } from "@/components/primitives/Cursor";
import { useTheme } from "@/context/ThemeContext/ThemeContext";
import { playTick } from "@/lib/sound";

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
  "commands: whoami · ls work/ · run demo · research · contact · theme · goto <section> · clear";

const SECTIONS = [
  "hero",
  "how-i-build",
  "selected-work",
  "agent-demo",
  "research",
  "writing",
  "about",
  "faq",
  "contact",
];

// For Tab-autocomplete and history hints.
const COMMANDS = [
  "help",
  "whoami",
  "ls work/",
  "run demo",
  "research",
  "contact",
  "theme",
  "goto ",
  "clear",
  "sudo",
];

export function Terminal() {
  const [lines, setLines] = useState<Line[]>(BOOT);
  const [value, setValue] = useState("");
  const [typing, setTyping] = useState<string | null>(null); // boot auto-type
  const [history, setHistory] = useState<string[]>([]);
  const histIdx = useRef<number>(-1);
  const router = useRouter();
  const { toggle } = useTheme();
  const scrollRef = useRef<HTMLDivElement>(null);
  const booted = useRef(false);

  const toBottom = () =>
    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });

  const push = (next: Line[]) => {
    setLines((prev) => [...prev, ...next]);
    toBottom();
  };

  // Flash-free typewriter boot: useLayoutEffect collapses the full SSR
  // transcript to just the banner BEFORE paint, then types `whoami` and streams
  // its output. Runs once per session; reduced-motion keeps the static boot.
  useLayoutEffect(() => {
    if (booted.current) return;
    booted.current = true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || sessionStorage.getItem("term-booted")) return;
    sessionStorage.setItem("term-booted", "1");

    const timers: ReturnType<typeof setTimeout>[] = [];
    setLines([BOOT[0]]);
    const cmd = BOOT[1].text;
    let i = 0;
    const typeChar = () => {
      if (i <= cmd.length) {
        setTyping(cmd.slice(0, i));
        i += 1;
        timers.push(setTimeout(typeChar, 75));
      } else {
        setTyping(null);
        setLines((l) => [...l, { kind: "in", text: cmd }]);
        timers.push(
          setTimeout(() => {
            setLines((l) => [...l, BOOT[2]]);
            toBottom();
          }, 280),
        );
      }
    };
    timers.push(setTimeout(typeChar, 420));
    return () => timers.forEach(clearTimeout);
  }, []);

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    if (raw.trim()) setHistory((h) => [...h, raw.trim()]);
    histIdx.current = -1;
    playTick(640);
    const echo: Line = { kind: "in", text: raw };

    if (cmd.startsWith("goto")) {
      const target = cmd.replace(/^goto\s*/, "").trim();
      if (SECTIONS.includes(target)) {
        push([echo, { kind: "out", text: `→ scrolling to ${target}` }]);
        setTimeout(() => router.push(`/#${target}`), 250);
      } else {
        push([
          echo,
          { kind: "out", text: `goto: unknown section. try: ${SECTIONS.join(", ")}` },
        ]);
      }
      return;
    }

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
        push([echo, { kind: "out", text: "starting agent loop demo…" }]);
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
      case "theme":
        push([echo, { kind: "out", text: "toggling theme…" }]);
        toggle();
        break;
      case "sudo":
      case "sudo su":
      case "sudo rm -rf /":
        push([
          echo,
          {
            kind: "out",
            text: "nice try. this shell runs least-privilege — like the agents I build. permission denied (and logged).",
          },
        ]);
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

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const match = COMMANDS.find((c) => c.startsWith(value.toLowerCase()) && c !== value);
      if (match) setValue(match);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      histIdx.current =
        histIdx.current < 0 ? history.length - 1 : Math.max(0, histIdx.current - 1);
      setValue(history[histIdx.current]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx.current < 0) return;
      histIdx.current += 1;
      if (histIdx.current >= history.length) {
        histIdx.current = -1;
        setValue("");
      } else {
        setValue(history[histIdx.current]);
      }
    }
  };

  return (
    <div className="panel w-full overflow-hidden border border-divider bg-surface font-mono text-sm">
      {/* faux app-window chrome */}
      <div className="flex items-center gap-2 border-b border-divider px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-accent" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent-3" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent-2" />
        <span className="ml-2 text-xs text-text/50">agent shell</span>
      </div>
      <div
        ref={scrollRef}
        className="h-40 overflow-auto p-3 graph-paper"
        aria-live="polite"
      >
        {lines.map((l, i) => (
          <p key={i} className={l.kind === "in" ? "text-text/90" : "text-text/65"}>
            {l.kind === "in" && <span className="text-accent">&gt; </span>}
            {l.text}
          </p>
        ))}
        {typing !== null && (
          <p className="text-text/90">
            <span className="text-accent">&gt; </span>
            {typing}
            <Cursor className="ml-0.5 h-[1em] w-[0.5em] translate-y-[0.1em]" />
          </p>
        )}
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
          onKeyDown={onKeyDown}
          autoComplete="off"
          spellCheck={false}
          disabled={typing !== null}
          placeholder="type a command — Tab completes, ↑ recalls, try `help`"
          className="w-full bg-transparent outline-none placeholder:text-text/40"
        />
        <Cursor className="hidden sm:inline-block" />
      </form>
      <div className="flex flex-wrap gap-1.5 border-t border-divider p-2 sm:gap-2">
        {["whoami", "ls work/", "run demo", "research", "contact"].map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => run(c)}
            className={`border border-divider px-2 py-1 text-xs text-text/70 transition-colors hover:bg-bg hover:text-text focus-visible:border-accent-2 focus-visible:outline-none${
              c === "research" || c === "contact" ? " hidden sm:inline-flex" : ""
            }`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
