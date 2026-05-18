"use client";

import { useOsMode } from "./OsModeContext";
import { OsShell } from "./OsShell";
import { OsToast } from "./OsToast";

/**
 * Decides which skin renders. The normal document site is always mounted
 * (so React Query prefetch, the command palette keyboard listener, and an
 * instant switch-back all keep working); it is only visually hidden while
 * OS mode is active. The OS shell is never rendered on the server
 * (`active` is false until the client mounts), so there is no hydration
 * mismatch; the anti-FOUC class on <html> covers the pre-mount paint.
 */
export function OsGate({ children }: { children: React.ReactNode }) {
  const { active } = useOsMode();

  return (
    <>
      {/* `contents` keeps the normal layout box-free when OS is off; the
          CSS guards in globals.css (html.os-mode) also hide the chrome
          before this component mounts. */}
      <div className={active ? "hidden" : "contents"}>{children}</div>
      {active && <OsShell />}
      <OsToast />
    </>
  );
}
