"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/cn";
import { useTheme } from "@/context/ThemeContext/ThemeContext";
import { useResume } from "@/context/ResumeContext/ResumeContext";
import { useOsMode } from "./OsModeContext";
import { Window, MENUBAR_H, TASKBAR_H, type Rect } from "./Window";
import { OS_APPS, APP_BY_ID, type AppId, type OsApp } from "./osApps";

const README_KEY = "os-readme-seen";

type WinState = {
  id: AppId;
  z: number;
  minimized: boolean;
  maximized: boolean;
  rect: Rect;
};

/** Fire the cross-fade toast that OsGate renders (it outlives the shell,
 *  so the "switched to website mode" message survives the unmount). */
function toast(message: string) {
  window.dispatchEvent(new CustomEvent("os-toast", { detail: message }));
}

function Dropdown({
  label,
  children,
}: {
  label: string;
  children: (close: () => void) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "px-2 py-1 font-mono text-xs hover:bg-surface",
          open && "bg-surface",
        )}
      >
        {label}
      </button>
      {open && (
        <div
          id={id}
          role="menu"
          className="absolute left-0 top-full z-10 min-w-44 border border-divider bg-bg py-1 shadow-2xl"
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

function MenuItem({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="block w-full px-3 py-1.5 text-left font-mono text-xs text-text/80 hover:bg-surface hover:text-text"
    >
      {children}
    </button>
  );
}

export function OsShell() {
  const { disable } = useOsMode();
  const { theme, toggle } = useTheme();
  const { open: openResume } = useResume();
  const [wins, setWins] = useState<WinState[]>([]);
  const zTop = useRef(10);
  const launchCount = useRef(0);
  const desktopRef = useRef<HTMLDivElement>(null);

  const focusedId = wins
    .filter((w) => !w.minimized)
    .reduce<WinState | null>(
      (top, w) => (!top || w.z > top.z ? w : top),
      null,
    )?.id;

  const exit = useCallback(() => {
    toast("Switched to website mode");
    disable();
  }, [disable]);

  const openApp = useCallback(
    (app: OsApp) => {
      if (app.kind === "action") {
        if (app.action === "exit") exit();
        else openResume();
        return;
      }
      setWins((prev) => {
        const existing = prev.find((w) => w.id === app.id);
        const z = ++zTop.current;
        if (existing) {
          return prev.map((w) =>
            w.id === app.id ? { ...w, z, minimized: false } : w,
          );
        }
        const i = launchCount.current++;
        const w = Math.min(app.w, window.innerWidth - 80);
        const h = Math.min(
          app.h,
          window.innerHeight - MENUBAR_H - TASKBAR_H - 24,
        );
        const rect: Rect = {
          x: Math.min(140 + i * 28, window.innerWidth - w - 24),
          y: MENUBAR_H + 16 + (i % 5) * 26,
          w,
          h,
        };
        return [
          ...prev,
          { id: app.id, z, minimized: false, maximized: false, rect },
        ];
      });
    },
    [exit, openResume],
  );

  const focus = useCallback((id: AppId) => {
    setWins((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, z: ++zTop.current } : w,
      ),
    );
  }, []);

  const close = useCallback((id: AppId) => {
    setWins((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const setFlag = useCallback(
    (id: AppId, patch: Partial<WinState>) => {
      setWins((prev) =>
        prev.map((w) => (w.id === id ? { ...w, ...patch } : w)),
      );
    },
    [],
  );

  const taskbarClick = useCallback(
    (w: WinState) => {
      if (w.minimized) {
        setWins((prev) =>
          prev.map((x) =>
            x.id === w.id
              ? { ...x, minimized: false, z: ++zTop.current }
              : x,
          ),
        );
      } else if (w.id === focusedId) {
        setFlag(w.id, { minimized: true });
      } else {
        focus(w.id);
      }
    },
    [focusedId, focus, setFlag],
  );

  // First run: show the readme once. Deep link: an incoming hash (e.g.
  // /#contact) opens the matching window so OS mode has content parity
  // with the normal site's anchors.
  useEffect(() => {
    let seen = true;
    try {
      seen = localStorage.getItem(README_KEY) === "1";
    } catch {
      /* ignore */
    }
    const hash = window.location.hash;
    const deep =
      hash && OS_APPS.find((a) => a.kind === "window" && a.hash === hash);
    if (deep) openApp(deep);
    if (!seen) {
      openApp(APP_BY_ID.readme);
      try {
        localStorage.setItem(README_KEY, "1");
      } catch {
        /* ignore */
      }
    }
    // Run once on mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const themeNext = theme === "dark" ? "light" : "dark";

  return (
    <div
      className="fixed inset-0 z-[55] flex flex-col overflow-hidden bg-bg"
      data-os-shell
    >
      {/* Top menu bar */}
      <div
        style={{ height: MENUBAR_H }}
        className="z-20 flex shrink-0 items-center gap-1 border-b border-divider bg-bg/95 px-2 backdrop-blur"
      >
        <span className="px-2 font-mono text-sm font-bold" aria-hidden>
          aa<span className="ml-0.5 inline-block h-[0.9em] w-[0.45em] bg-accent align-middle" />
        </span>
        <Dropdown label="Go">
          {(c) => (
            <>
              {OS_APPS.filter((a) => a.kind === "window").map((a) => (
                <MenuItem
                  key={a.id}
                  onClick={() => {
                    openApp(a);
                    c();
                  }}
                >
                  {a.glyph} &nbsp;{a.file}
                </MenuItem>
              ))}
            </>
          )}
        </Dropdown>
        <Dropdown label="View">
          {(c) => (
            <MenuItem
              onClick={() => {
                toggle();
                c();
              }}
            >
              Switch to {themeNext} theme
            </MenuItem>
          )}
        </Dropdown>
        <Dropdown label="Help">
          {(c) => (
            <>
              <MenuItem
                onClick={() => {
                  openApp(APP_BY_ID.readme);
                  c();
                }}
              >
                What is this?
              </MenuItem>
              <MenuItem
                onClick={() => {
                  exit();
                  c();
                }}
              >
                Back to website mode
              </MenuItem>
            </>
          )}
        </Dropdown>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => openApp(APP_BY_ID.contact)}
            className="border border-divider px-3 py-1 font-mono text-xs hover:bg-surface"
          >
            Work with me
          </button>
          <button
            type="button"
            onClick={exit}
            className="border border-divider px-3 py-1 font-mono text-xs hover:border-accent hover:bg-accent hover:text-accent-fg"
          >
            Website mode
          </button>
        </div>
      </div>

      {/* Desktop */}
      <div
        ref={desktopRef}
        className="graph-paper relative min-h-0 flex-1"
        aria-label="Desktop"
      >
        <div className="absolute left-3 top-3 flex flex-col gap-1">
          {OS_APPS.map((app) => (
            <button
              key={app.id}
              type="button"
              onClick={() => openApp(app)}
              aria-label={`Open ${app.file}`}
              className="group flex w-24 flex-col items-center gap-1 border border-transparent p-2 text-center hover:border-divider hover:bg-surface/60 focus-visible:border-divider"
            >
              <span
                aria-hidden
                className="flex h-10 w-10 items-center justify-center border border-divider bg-bg text-lg text-text/80 group-hover:border-accent group-hover:text-accent"
              >
                {app.glyph}
              </span>
              <span className="break-all font-mono text-[11px] leading-tight text-text/75">
                {app.file}
              </span>
            </button>
          ))}
        </div>

        {wins
          .filter((w) => !w.minimized)
          .map((w) => {
            const app = APP_BY_ID[w.id];
            if (app.kind !== "window") return null;
            const Body = app.Body;
            return (
              <Window
                key={w.id}
                title={app.title}
                focused={w.id === focusedId}
                zIndex={w.z}
                maximized={w.maximized}
                defaultRect={w.rect}
                onFocus={() => focus(w.id)}
                onClose={() => close(w.id)}
                onMinimize={() => setFlag(w.id, { minimized: true })}
                onToggleMax={() =>
                  setFlag(w.id, { maximized: !w.maximized })
                }
              >
                <Body />
              </Window>
            );
          })}
      </div>

      {/* Taskbar */}
      <div
        style={{ height: TASKBAR_H }}
        className="z-20 flex shrink-0 items-center gap-1 overflow-x-auto border-t border-divider bg-bg/95 px-2 backdrop-blur"
      >
        <span className="shrink-0 px-1 font-mono text-[11px] text-text/40">
          {wins.length === 0 ? "no windows open" : "windows:"}
        </span>
        {wins.map((w) => {
          const app = APP_BY_ID[w.id];
          return (
            <button
              key={w.id}
              type="button"
              onClick={() => taskbarClick(w)}
              aria-label={`${w.minimized ? "Restore" : "Focus"} ${app.title}`}
              className={cn(
                "shrink-0 border px-2 py-1 font-mono text-[11px]",
                w.id === focusedId && !w.minimized
                  ? "border-accent text-text"
                  : "border-divider text-text/60 hover:text-text",
                w.minimized && "opacity-60",
              )}
            >
              {app.glyph} {app.file}
            </button>
          );
        })}
      </div>
    </div>
  );
}
