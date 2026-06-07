"use client";

import dynamic from "next/dynamic";
import { useOsMode } from "./OsModeContext";
import { OsToast } from "./OsToast";

// The OS shell (and every section body it embeds as a "window") is an opt-in
// alternate skin — never rendered until a returning desktop visitor switches
// to it. Code-split it so none of that ships in the shared First Load JS that
// every page pays for. It's already client-only, so ssr:false is correct and
// has no hydration/SEO impact.
const OsShell = dynamic(() => import("./OsShell").then((m) => m.OsShell), {
  ssr: false,
});

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
