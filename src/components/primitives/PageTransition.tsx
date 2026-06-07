"use client";

import { usePathname } from "next/navigation";

/**
 * Enter-only route transition: new pages rise + fade in, keyed on pathname so
 * the animation replays on navigation. CSS-only (no animation-library dep);
 * reduced-motion is handled by the .page-enter rule in globals.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  );
}
