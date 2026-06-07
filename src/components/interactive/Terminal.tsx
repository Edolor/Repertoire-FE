"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Cursor } from "@/components/primitives/Cursor";
import { useTheme } from "@/context/ThemeContext/ThemeContext";
import { playTick } from "@/lib/sound";
import { useScrollLock } from "@/lib/scroll-lock";
import { cn } from "@/lib/cn";

type WindowState = "normal" | "min" | "max";

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
  "about",
  "selected-work",
  "agent-demo",
  "writing",
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
  const [win, setWin] = useState<WindowState>("normal");
  const [closed, setClosed] = useState(false);
  useScrollLock(win === "max");

  // While maximized: lock body scroll and let Escape restore.
  useEffect(() => {
    if (win !== "max") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setWin("normal");
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [win]);

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
        setTimeout(() => router.push("/research"), 300);
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

  // A traffic-light window control: small colored dot, glyph on hover.
  const ctl = (color: string, label: string, glyph: string, onClick: () => void) => (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="group/ctl flex h-5 w-5 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-2"
    >
      <span className={cn("flex h-2.5 w-2.5 items-center justify-center rounded-full", color)}>
        <span
          aria-hidden
          className="text-[7px] font-bold leading-none text-bg opacity-0 transition-opacity group-hover/ctl:opacity-100"
        >
          {glyph}
        </span>
      </span>
    </button>
  );

  const chrome = (
    <div className="flex items-center gap-2 border-b border-divider px-3 py-2">
      <div className="flex items-center gap-1">
        {ctl("bg-accent", "Close agent shell", "×", () => setClosed(true))}
        {ctl(
          "bg-accent-3",
          win === "min" ? "Restore agent shell" : "Minimize agent shell",
          "–",
          () => setWin((w) => (w === "min" ? "normal" : "min")),
        )}
        {ctl(
          "bg-accent-2",
          win === "max" ? "Restore agent shell" : "Maximize agent shell",
          win === "max" ? "⤢" : "⤡",
          () => setWin((w) => (w === "max" ? "normal" : "max")),
        )}
      </div>
      <button
        type="button"
        onClick={() => win === "min" && setWin("normal")}
        onDoubleClick={() => setWin((w) => (w === "max" ? "normal" : "max"))}
        className="ml-1 select-none text-xs text-text/50"
        aria-label={win === "min" ? "Restore agent shell" : "agent shell window"}
      >
        agent shell
      </button>
    </div>
  );

  const shell = (maximized: boolean) => (
    <div
      className={cn(
        "panel flex flex-col overflow-hidden border border-divider bg-surface font-mono text-sm",
        maximized ? "h-[80vh] w-full" : "w-full",
      )}
    >
      {chrome}
      {win !== "min" && (
        <>
          <div
            ref={scrollRef}
            className={cn("thin-scroll overflow-auto p-3 graph-paper", maximized ? "min-h-0 flex-1" : "h-40")}
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
              placeholder="type a command — try `help`"
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
        </>
      )}
    </div>
  );

  // Closed → a slim launcher docked to the side of the page (portaled out so the
  // hero's tilt transform doesn't capture its fixed positioning).
  if (closed) {
    return createPortal(
      <button
        type="button"
        onClick={() => {
          setClosed(false);
          setWin("normal");
        }}
        aria-label="Reopen agent shell"
        className="panel fixed right-0 top-1/3 z-40 flex items-center gap-2 rounded-l border border-r-0 border-divider bg-surface px-2.5 py-3 font-mono text-[11px] uppercase tracking-widest text-text/70 transition-colors hover:text-accent [writing-mode:vertical-rl]"
      >
        <span className="h-2 w-2 rounded-full bg-accent [writing-mode:horizontal-tb]" />
        agent shell
      </button>,
      document.body,
    );
  }

  // Maximized → focused overlay with a dismissible backdrop.
  if (win === "max") {
    return createPortal(
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-8">
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          aria-hidden
          onClick={() => setWin("normal")}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Agent shell (maximized)"
          data-lenis-prevent
          className="relative z-10 w-full max-w-3xl"
        >
          {shell(true)}
        </div>
      </div>,
      document.body,
    );
  }

  return shell(false);
}
