"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { useTheme } from "@/context/ThemeContext/ThemeContext";
import { useResume } from "@/context/ResumeContext/ResumeContext";
import { useOsMode } from "./OsModeContext";
import { Window, MENUBAR_H, TASKBAR_H, type Rect } from "./Window";
import { OsIcon } from "./OsIcon";
import { OS_APPS, APP_BY_ID, type AppId, type OsApp } from "./osApps";
import { publishedPosts, publishedWork, formatDate } from "@/lib/content";
import { ArticleBody } from "@/components/interactive/ArticleBody";

// In OS mode the document site is hidden behind the shell, so a normal
// <Link> to a detail page would navigate "underneath" the desktop and appear
// to do nothing. Instead we intercept internal link clicks inside windows and
// open the content in a reader window (detail pages) or the matching app
// window (section/index routes). These maps resolve a link href to content.
const POST_BY_PERMALINK = new Map(publishedPosts.map((p) => [p.permalink, p]));
const WORK_BY_PERMALINK = new Map(publishedWork.map((w) => [w.permalink, w]));
const PATH_TO_APP: Record<string, AppId> = {
  "/work": "work",
  "/writing": "writing",
  "/research": "research",
  "/about": "about",
  "/#contact": "contact",
};

type ReaderDoc = { title: string; subtitle: string; html: string };

/** Body of the dynamic reader window: an article/case-study opened from a link. */
function ReaderPane({ doc }: { doc: ReaderDoc }) {
  return (
    <div className="p-5">
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.125em] text-text/60">
        <span className="mr-2 text-accent">&gt;</span>
        {doc.subtitle}
      </p>
      <h1 className="text-2xl font-bold leading-tight">{doc.title}</h1>
      <ArticleBody html={doc.html} />
    </div>
  );
}

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
  const router = useRouter();
  const [wins, setWins] = useState<WinState[]>([]);
  const [readerDoc, setReaderDoc] = useState<ReaderDoc | null>(null);
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

  // Dynamic "reader" window: opened when a link inside a window points at a
  // post or work case study. One reader window, reused and re-focused.
  const openReader = useCallback((doc: ReaderDoc) => {
    setReaderDoc(doc);
    setWins((prev) => {
      const z = ++zTop.current;
      const existing = prev.find((w) => w.id === "reader");
      if (existing)
        return prev.map((w) =>
          w.id === "reader" ? { ...w, z, minimized: false } : w,
        );
      const i = launchCount.current++;
      const ww = Math.min(780, window.innerWidth - 80);
      const hh = Math.min(
        660,
        window.innerHeight - MENUBAR_H - TASKBAR_H - 24,
      );
      const rect: Rect = {
        x: Math.min(180 + i * 28, Math.max(40, window.innerWidth - ww - 24)),
        y: MENUBAR_H + 16 + (i % 5) * 26,
        w: ww,
        h: hh,
      };
      return [
        ...prev,
        { id: "reader", z, minimized: false, maximized: false, rect },
      ];
    });
  }, []);

  // Capture-phase click interception for internal links inside windows. Runs
  // before next/link's own handler; calling preventDefault makes Link bail, so
  // we route the click to a window instead of a hidden navigation.
  const onShellNavCapture = useCallback(
    (e: React.MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;
      // Leave new-tab and non-internal (http/mailto/tel) links to the browser.
      const tgt = anchor.getAttribute("target");
      if (tgt && tgt !== "_self") return;
      if (!href.startsWith("/") && !href.startsWith("#")) return;

      const post = POST_BY_PERMALINK.get(href);
      if (post) {
        e.preventDefault();
        openReader({
          title: post.title,
          subtitle: `writing · ${formatDate(post.date)} · ${post.metadata.readingTime} min`,
          html: post.body,
        });
        return;
      }
      const wk = WORK_BY_PERMALINK.get(href);
      if (wk) {
        e.preventDefault();
        openReader({
          title: wk.title,
          subtitle: `work · ${wk.client}`,
          html: wk.body,
        });
        return;
      }
      // Section/index routes → the matching app window (stay in OS mode).
      const hash = href.startsWith("/#")
        ? href.slice(1)
        : href.startsWith("#")
          ? href
          : null;
      let app = hash
        ? OS_APPS.find((a) => a.kind === "window" && a.hash === hash)
        : undefined;
      if (!app) {
        const id = PATH_TO_APP[href];
        if (id) app = APP_BY_ID[id];
      }
      if (app) {
        e.preventDefault();
        openApp(app);
        return;
      }
      // Unknown internal route: leave OS mode so the destination is visible
      // rather than rendering hidden behind the shell.
      e.preventDefault();
      exit();
      router.push(href);
    },
    [openReader, openApp, exit, router],
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
      data-lenis-prevent
      onClickCapture={onShellNavCapture}
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
            if (w.id === "reader") {
              if (!readerDoc) return null;
              return (
                <Window
                  key="reader"
                  title={readerDoc.title}
                  focused={w.id === focusedId}
                  zIndex={w.z}
                  maximized={w.maximized}
                  defaultRect={w.rect}
                  onFocus={() => focus(w.id)}
                  onClose={() => close(w.id)}
                  onMinimize={() => setFlag(w.id, { minimized: true })}
                  onToggleMax={() => setFlag(w.id, { maximized: !w.maximized })}
                >
                  <ReaderPane doc={readerDoc} />
                </Window>
              );
            }
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
        <span className="shrink-0 px-1 font-mono text-[11px] text-text/60">
          {wins.length === 0 ? "no windows open" : "windows:"}
        </span>
        {wins.map((w) => {
          const isReader = w.id === "reader";
          const app = isReader ? null : APP_BY_ID[w.id];
          const label = isReader ? readerDoc?.title ?? "reader" : app!.file;
          return (
            <button
              key={w.id}
              type="button"
              onClick={() => taskbarClick(w)}
              aria-label={`${w.minimized ? "Restore" : "Focus"} ${label}`}
              className={cn(
                "flex shrink-0 items-center gap-1.5 border px-2 py-1 font-mono text-[11px]",
                w.id === focusedId && !w.minimized
                  ? "border-accent text-text"
                  : "border-divider text-text/60 hover:text-text",
                w.minimized && "opacity-60",
              )}
            >
              <OsIcon id={w.id} className="h-3.5 w-3.5" />
              <span className="max-w-[12rem] truncate">{label}</span>
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
