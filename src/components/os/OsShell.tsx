"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { cn } from "@/lib/cn";
import { useTheme } from "@/context/ThemeContext/ThemeContext";
import { useResume } from "@/context/ResumeContext/ResumeContext";
import { useOsMode } from "./OsModeContext";
import { Window, MENUBAR_H, TASKBAR_H, type Rect } from "./Window";
import { OsIcon } from "./OsIcon";
import { OS_APPS, APP_BY_ID, type AppId, type OsApp } from "./osApps";

const README_KEY = "os-readme-seen";
const ICONS_KEY = "os-icons";

// Default desktop layout: icons split down the left and right edges. They
// are free-draggable from there and the arrangement persists.
const LEFT_COL: AppId[] = ["about", "work", "writing", "research", "agent"];
const RIGHT_COL: AppId[] = ["shell", "contact", "readme", "trash", "resume", "exit"];
const ICON_W = 84;
const ICON_H = 78;

type Pt = { x: number; y: number };
type IconPos = Partial<Record<AppId, Pt>>;

type WinState = {
  id: AppId;
  z: number;
  minimized: boolean;
  maximized: boolean;
  rect: Rect;
};

type Ctx = { x: number; y: number; app: OsApp | null };

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), Math.max(min, max));
}

/** Fire the cross-fade toast that OsGate renders (it outlives the shell,
 *  so the "switched to website mode" message survives the unmount). */
function toast(message: string) {
  window.dispatchEvent(new CustomEvent("os-toast", { detail: message }));
}

function defaultLayout(w: number, h: number): IconPos {
  const pos: IconPos = {};
  const usableH = h - MENUBAR_H - TASKBAR_H;
  const place = (ids: AppId[], x: number) =>
    ids.forEach((id, i) => {
      pos[id] = { x, y: clamp(16 + i * (ICON_H + 8), 12, usableH - ICON_H) };
    });
  place(LEFT_COL, 16);
  place(RIGHT_COL, Math.max(120, w - ICON_W - 16));
  return pos;
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
          "rounded-sm px-3 py-2 font-mono text-[13px] leading-none hover:bg-surface",
          open && "bg-surface",
        )}
      >
        {label}
      </button>
      {open && (
        <div
          id={id}
          role="menu"
          className="absolute left-0 top-full z-10 mt-0.5 min-w-52 border border-divider bg-bg py-1 shadow-2xl"
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
      className="flex w-full items-center gap-2 px-3 py-2 text-left font-mono text-xs text-text/80 hover:bg-surface hover:text-text"
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
  const [iconPos, setIconPos] = useState<IconPos | null>(null);
  const [ctx, setCtx] = useState<Ctx | null>(null);
  const zTop = useRef(10);
  const launchCount = useRef(0);
  const desktopRef = useRef<HTMLDivElement>(null);
  const iconDrag = useRef<{
    id: AppId;
    sx: number;
    sy: number;
    ox: number;
    oy: number;
    moved: boolean;
  } | null>(null);
  const suppressClick = useRef(false);

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
          x: Math.min(160 + i * 28, Math.max(40, window.innerWidth - w - 24)),
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
      prev.map((w) => (w.id === id ? { ...w, z: ++zTop.current } : w)),
    );
  }, []);

  const close = useCallback((id: AppId) => {
    setWins((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const setFlag = useCallback((id: AppId, patch: Partial<WinState>) => {
    setWins((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...patch } : w)),
    );
  }, []);

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

  // Icon layout: restore the persisted arrangement, else lay icons out
  // down the left and right edges. Clamp into bounds on resize.
  useEffect(() => {
    const box = desktopRef.current;
    const w = box?.clientWidth ?? window.innerWidth;
    const h = window.innerHeight;
    let next: IconPos | null = null;
    try {
      const raw = localStorage.getItem(ICONS_KEY);
      if (raw) next = JSON.parse(raw) as IconPos;
    } catch {
      /* ignore malformed */
    }
    setIconPos(next ?? defaultLayout(w, h));

    const onResize = () => {
      const bw = desktopRef.current?.clientWidth ?? window.innerWidth;
      const bh = desktopRef.current?.clientHeight ?? window.innerHeight;
      setIconPos((p) => {
        if (!p) return p;
        const c: IconPos = {};
        (Object.keys(p) as AppId[]).forEach((id) => {
          const pt = p[id]!;
          c[id] = {
            x: clamp(pt.x, 4, bw - ICON_W),
            y: clamp(pt.y, 4, bh - ICON_H),
          };
        });
        return c;
      });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const persistIcons = useCallback((p: IconPos) => {
    try {
      localStorage.setItem(ICONS_KEY, JSON.stringify(p));
    } catch {
      /* private mode: in-memory only */
    }
  }, []);

  const resetIcons = useCallback(() => {
    const bw = desktopRef.current?.clientWidth ?? window.innerWidth;
    const layout = defaultLayout(bw, window.innerHeight);
    setIconPos(layout);
    try {
      localStorage.removeItem(ICONS_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  // First run shows the readme once. A deep-link hash opens the matching
  // window; otherwise whoami.sh opens by default so the desktop is never
  // empty when you switch in.
  useEffect(() => {
    let seen = true;
    try {
      seen = localStorage.getItem(README_KEY) === "1";
    } catch {
      /* ignore */
    }
    if (!seen) {
      openApp(APP_BY_ID.readme);
      try {
        localStorage.setItem(README_KEY, "1");
      } catch {
        /* ignore */
      }
    }
    const hash = window.location.hash;
    const deep =
      hash && OS_APPS.find((a) => a.kind === "window" && a.hash === hash);
    openApp(deep || APP_BY_ID.about);
    // Mount-only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close the context menu on any outside interaction.
  useEffect(() => {
    if (!ctx) return;
    const onDown = () => setCtx(null);
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCtx(null);
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("resize", onDown);
    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("resize", onDown);
      window.removeEventListener("keydown", onEsc);
    };
  }, [ctx]);

  const onIconPointerDown = useCallback(
    (e: ReactPointerEvent, id: AppId) => {
      if (e.button !== 0 || !iconPos?.[id]) return;
      const p = iconPos[id]!;
      iconDrag.current = {
        id,
        sx: e.clientX,
        sy: e.clientY,
        ox: p.x,
        oy: p.y,
        moved: false,
      };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [iconPos],
  );

  const onIconPointerMove = useCallback((e: ReactPointerEvent) => {
    const d = iconDrag.current;
    if (!d) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (!d.moved && Math.hypot(dx, dy) < 5) return;
    d.moved = true;
    const box = desktopRef.current;
    const bw = box?.clientWidth ?? window.innerWidth;
    const bh = box?.clientHeight ?? window.innerHeight;
    setIconPos((p) =>
      p
        ? {
            ...p,
            [d.id]: {
              x: clamp(d.ox + dx, 0, bw - ICON_W),
              y: clamp(d.oy + dy, 0, bh - ICON_H),
            },
          }
        : p,
    );
  }, []);

  const onIconPointerUp = useCallback(
    (e: ReactPointerEvent) => {
      const d = iconDrag.current;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
      if (d?.moved) {
        suppressClick.current = true;
        setIconPos((p) => {
          if (p) persistIcons(p);
          return p;
        });
      }
      iconDrag.current = null;
    },
    [persistIcons],
  );

  const themeNext = theme === "dark" ? "light" : "dark";

  const windowApps = OS_APPS.filter((a) => a.kind === "window");

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
          aa
          <span className="ml-0.5 inline-block h-[0.9em] w-[0.45em] bg-accent align-middle" />
        </span>
        <Dropdown label="Go">
          {(c) => (
            <>
              {windowApps.map((a) => (
                <MenuItem
                  key={a.id}
                  onClick={() => {
                    openApp(a);
                    c();
                  }}
                >
                  <OsIcon id={a.id} className="h-4 w-4 text-text/70" />
                  {a.file}
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
                <OsIcon id="readme" className="h-4 w-4 text-text/70" />
                What is this?
              </MenuItem>
              <MenuItem
                onClick={() => {
                  exit();
                  c();
                }}
              >
                <OsIcon id="exit" className="h-4 w-4 text-text/70" />
                Back to website mode
              </MenuItem>
            </>
          )}
        </Dropdown>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => openApp(APP_BY_ID.contact)}
            className="rounded-sm border border-divider px-3 py-1.5 font-mono text-xs hover:bg-surface"
          >
            Get in touch
          </button>
          <button
            type="button"
            onClick={exit}
            className="flex items-center gap-1.5 rounded-sm border border-divider px-3 py-1.5 font-mono text-xs hover:border-accent hover:bg-accent hover:text-accent-fg"
          >
            <OsIcon id="exit" className="h-3.5 w-3.5" />
            Website mode
          </button>
        </div>
      </div>

      {/* Desktop */}
      <div
        ref={desktopRef}
        className="graph-paper relative min-h-0 flex-1"
        aria-label="Desktop"
        onContextMenu={(e) => {
          e.preventDefault();
          setCtx({ x: e.clientX, y: e.clientY, app: null });
        }}
      >
        {iconPos &&
          OS_APPS.map((app) => {
            const p = iconPos[app.id];
            if (!p) return null;
            return (
              <button
                key={app.id}
                type="button"
                onPointerDown={(e) => onIconPointerDown(e, app.id)}
                onPointerMove={onIconPointerMove}
                onPointerUp={onIconPointerUp}
                onPointerCancel={onIconPointerUp}
                onClick={() => {
                  if (suppressClick.current) {
                    suppressClick.current = false;
                    return;
                  }
                  openApp(app);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCtx({ x: e.clientX, y: e.clientY, app });
                }}
                aria-label={`Open ${app.file}`}
                style={{ left: p.x, top: p.y, width: ICON_W }}
                className="group absolute flex touch-none flex-col items-center gap-1.5 rounded-sm border border-transparent p-2 text-center hover:border-divider hover:bg-surface/60 focus-visible:border-divider"
              >
                <span
                  aria-hidden
                  className="flex h-11 w-11 items-center justify-center rounded-sm border border-divider bg-bg text-text/80 group-hover:border-accent group-hover:text-accent"
                >
                  <OsIcon id={app.id} className="h-6 w-6" />
                </span>
                <span className="font-mono text-[11px] leading-tight text-text/75">
                  {app.file}
                </span>
              </button>
            );
          })}

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
                "flex shrink-0 items-center gap-1.5 border px-2 py-1 font-mono text-[11px]",
                w.id === focusedId && !w.minimized
                  ? "border-accent text-text"
                  : "border-divider text-text/60 hover:text-text",
                w.minimized && "opacity-60",
              )}
            >
              <OsIcon id={w.id} className="h-3.5 w-3.5" />
              {app.file}
            </button>
          );
        })}
      </div>

      {/* Right-click context menu */}
      {ctx && (
        <div
          role="menu"
          aria-label="Desktop actions"
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            left: Math.min(ctx.x, window.innerWidth - 220),
            top: Math.min(ctx.y, window.innerHeight - 240),
          }}
          className="fixed z-[70] min-w-52 border border-divider bg-bg py-1 shadow-2xl"
        >
          {ctx.app ? (
            <>
              <MenuItem
                onClick={() => {
                  openApp(ctx.app!);
                  setCtx(null);
                }}
              >
                <OsIcon id={ctx.app.id} className="h-4 w-4 text-text/70" />
                Open {ctx.app.file}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  resetIcons();
                  setCtx(null);
                }}
              >
                Reset icon layout
              </MenuItem>
            </>
          ) : (
            <>
              <MenuItem
                onClick={() => {
                  openApp(APP_BY_ID.about);
                  setCtx(null);
                }}
              >
                <OsIcon id="about" className="h-4 w-4 text-text/70" />
                Open whoami.sh
              </MenuItem>
              <MenuItem
                onClick={() => {
                  openApp(APP_BY_ID.readme);
                  setCtx(null);
                }}
              >
                <OsIcon id="readme" className="h-4 w-4 text-text/70" />
                What is this desktop?
              </MenuItem>
              <div className="my-1 border-t border-divider" />
              <MenuItem
                onClick={() => {
                  resetIcons();
                  setCtx(null);
                }}
              >
                Reset icon layout
              </MenuItem>
              <MenuItem
                onClick={() => {
                  toggle();
                  setCtx(null);
                }}
              >
                Switch to {themeNext} theme
              </MenuItem>
              <div className="my-1 border-t border-divider" />
              <MenuItem
                onClick={() => {
                  exit();
                  setCtx(null);
                }}
              >
                <OsIcon id="exit" className="h-4 w-4 text-text/70" />
                Back to website mode
              </MenuItem>
            </>
          )}
        </div>
      )}
    </div>
  );
}
