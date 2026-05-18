"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// Opt-in "desktop OS" alternate skin. The normal credible document site is
// always the default; this only flips an overlay on top of it. The choice
// persists in localStorage and is restored on the next visit, but is only
// ever honored on pointer/desktop viewports (window dragging is bad on
// touch), so a persisted "os" preference is ignored below DESKTOP_MIN.
export const OS_MODE_KEY = "os-mode";
export const OS_MODE_CLASS = "os-mode";
export const DESKTOP_MIN = 1024;

type OsModeContextProps = {
  // True only when OS mode is active AND the viewport is desktop AND the
  // client has mounted (never true during SSR, to avoid hydration drift).
  active: boolean;
  // The persisted intent, regardless of viewport. Drives the toggle label.
  enabled: boolean;
  // The viewport is wide enough to offer OS mode at all.
  desktop: boolean;
  mounted: boolean;
  enable: () => void;
  disable: () => void;
  toggle: () => void;
};

const OsModeContext = createContext<OsModeContextProps>(
  {} as OsModeContextProps,
);

export const useOsMode = () => useContext(OsModeContext);

function readPersisted(): boolean {
  try {
    return localStorage.getItem(OS_MODE_KEY) === "os";
  } catch {
    return false;
  }
}

export default function OsModeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [desktop, setDesktop] = useState(false);

  // Sync from the persisted preference + a media query, only on the client.
  // The anti-FOUC inline script in the root layout has already applied the
  // `os-mode` class to <html> for the no-flash case; this just mirrors it
  // into React state.
  useEffect(() => {
    setMounted(true);
    setEnabled(readPersisted());
    const mq = window.matchMedia(`(min-width: ${DESKTOP_MIN}px)`);
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const persist = useCallback((on: boolean) => {
    try {
      localStorage.setItem(OS_MODE_KEY, on ? "os" : "site");
    } catch {
      /* private mode: in-memory only, no persistence */
    }
    document.documentElement.classList.toggle(OS_MODE_CLASS, on);
    setEnabled(on);
  }, []);

  const enable = useCallback(() => persist(true), [persist]);
  const disable = useCallback(() => persist(false), [persist]);
  const toggle = useCallback(
    () => persist(!readPersisted()),
    [persist],
  );

  const active = mounted && enabled && desktop;

  // Keep the <html> class honest if the viewport crosses the breakpoint
  // (e.g. window resized narrow): the CSS guards in globals.css hide the
  // normal chrome only while the class is present, so it must track
  // `active`, not just the stored intent.
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle(OS_MODE_CLASS, active);
  }, [mounted, active]);

  return (
    <OsModeContext.Provider
      value={{ active, enabled, desktop, mounted, enable, disable, toggle }}
    >
      {children}
    </OsModeContext.Provider>
  );
}
