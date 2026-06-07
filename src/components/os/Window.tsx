"use client";

import {
  useCallback,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { cn } from "@/lib/cn";
import { useFocusTrap } from "@/hooks/useFocusTrap";

export const MENUBAR_H = 44;
export const TASKBAR_H = 38;

export type Rect = { x: number; y: number; w: number; h: number };

type WindowProps = {
  title: string;
  focused: boolean;
  zIndex: number;
  maximized: boolean;
  defaultRect: Rect;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMax: () => void;
  children: React.ReactNode;
};

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

/**
 * A draggable faux-OS window. Drag is hand-rolled on pointer events (no
 * library, no new dependency) and clamped so the title bar stays grabbable
 * inside the viewport. role="dialog" with an accessible name; Escape
 * closes; Tab is trapped within the focused window; opening animates
 * (CSS keyframe, auto-reduced by the global prefers-reduced-motion rule).
 */
export function Window({
  title,
  focused,
  zIndex,
  maximized,
  defaultRect,
  onFocus,
  onClose,
  onMinimize,
  onToggleMax,
  children,
}: WindowProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<Rect>(defaultRect);
  const drag = useRef<{ dx: number; dy: number } | null>(null);

  // Focus the shell on open (so it's announced and Escape works), restore
  // focus on close, and trap Tab within the window — all shared with Terminal.
  const onKeyDown = useFocusTrap(rootRef, { onEscape: onClose });

  const onTitlePointerDown = useCallback(
    (e: ReactPointerEvent) => {
      if (maximized) return;
      // Ignore drags that start on the control buttons.
      if ((e.target as HTMLElement).closest("button")) return;
      onFocus();
      drag.current = { dx: e.clientX - rect.x, dy: e.clientY - rect.y };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [maximized, onFocus, rect.x, rect.y],
  );

  const onTitlePointerMove = useCallback((e: ReactPointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const w = rootRef.current?.offsetWidth ?? 480;
    setRect((r) => ({
      ...r,
      x: clamp(e.clientX - d.dx, 0, window.innerWidth - Math.min(w, 160)),
      y: clamp(
        e.clientY - d.dy,
        MENUBAR_H,
        window.innerHeight - TASKBAR_H - 36,
      ),
    }));
  }, []);

  const endDrag = useCallback((e: ReactPointerEvent) => {
    drag.current = null;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* pointer already released */
    }
  }, []);

  const style: React.CSSProperties = maximized
    ? {
        left: 0,
        top: MENUBAR_H,
        width: "100vw",
        height: `calc(100vh - ${MENUBAR_H + TASKBAR_H}px)`,
        zIndex,
      }
    : {
        left: rect.x,
        top: rect.y,
        width: rect.w,
        height: rect.h,
        zIndex,
      };

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-label={title}
      aria-modal={false}
      tabIndex={-1}
      onMouseDownCapture={onFocus}
      onKeyDown={onKeyDown}
      style={style}
      className={cn(
        "os-window-anim absolute flex flex-col overflow-hidden border bg-bg shadow-2xl outline-none",
        focused ? "border-accent" : "border-divider opacity-90",
      )}
    >
      <div
        onPointerDown={onTitlePointerDown}
        onPointerMove={onTitlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={onToggleMax}
        className={cn(
          "flex shrink-0 select-none items-center gap-2 border-b border-divider px-2 py-1.5 font-mono text-xs",
          maximized ? "cursor-default" : "cursor-grab active:cursor-grabbing",
          focused ? "bg-surface text-text" : "bg-bg text-text/55",
        )}
      >
        <span className="text-accent" aria-hidden>
          &gt;
        </span>
        <span className="truncate">{title}</span>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={onMinimize}
            aria-label={`Minimize ${title}`}
            className="h-5 w-5 border border-divider text-[11px] leading-none hover:bg-bg"
          >
            &minus;
          </button>
          <button
            type="button"
            onClick={onToggleMax}
            aria-label={`${maximized ? "Restore" : "Maximize"} ${title}`}
            className="h-5 w-5 border border-divider text-[11px] leading-none hover:bg-bg"
          >
            {maximized ? "❐" : "▢"}
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${title}`}
            className="h-5 w-5 border border-divider text-[11px] leading-none hover:border-accent hover:bg-accent hover:text-accent-fg"
          >
            ✕
          </button>
        </div>
      </div>
      <div className="os-window-body thin-scroll min-h-0 flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
