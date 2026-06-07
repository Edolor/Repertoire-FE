"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useResume } from "@/context/ResumeContext/ResumeContext";
import { useTheme } from "@/context/ThemeContext/ThemeContext";
import { useOsMode } from "@/components/os/OsModeContext";
import { NAV, PERSON } from "@/content/site";
import { Cursor } from "@/components/primitives/Cursor";
import { cn } from "@/lib/cn";

export function openCommandPalette() {
  window.dispatchEvent(new CustomEvent("open-command-palette"));
}

// Sun↔moon that morphs: a mask circle slides in to carve the crescent while the
// rays fade and rotate out. Geometry/opacity transitions are CSS so the global
// reduced-motion rule collapses them automatically.
function ThemeIcon({ dark }: { dark: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden focusable="false">
      <mask id="theme-moon">
        <rect x="0" y="0" width="24" height="24" fill="white" />
        <circle
          cx={dark ? 17 : 30}
          cy="7"
          r="8"
          fill="black"
          style={{ transition: "cx 0.45s ease" }}
        />
      </mask>
      <circle
        cx="12"
        cy="12"
        r={dark ? 7 : 5.5}
        fill="currentColor"
        mask="url(#theme-moon)"
        style={{ transition: "r 0.45s ease" }}
      />
      <g
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        style={{
          transition: "opacity 0.4s ease, transform 0.45s ease",
          transformOrigin: "center",
          opacity: dark ? 0 : 1,
          transform: dark ? "rotate(40deg) scale(0.5)" : "rotate(0) scale(1)",
        }}
      >
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * Math.PI) / 4;
          const x = 12 + Math.cos(a) * 9;
          const y = 12 + Math.sin(a) * 9;
          const x2 = 12 + Math.cos(a) * 11;
          const y2 = 12 + Math.sin(a) * 11;
          return <line key={i} x1={x} y1={y} x2={x2} y2={y2} />;
        })}
      </g>
    </svg>
  );
}

export function Header() {
  const { open } = useResume();
  const { theme, toggle } = useTheme();
  const { enable, desktop, mounted } = useOsMode();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const sectionIds = NAV.filter((n) => n.href.startsWith("/#")).map((n) =>
    n.href.slice(2),
  );
  const activeId = useActiveSection(sectionIds);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-40 h-16 border-b border-divider bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-full max-w-content items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-base font-bold"
          aria-label="Aghoghomena Akasukpe, home"
        >
          <span>
            aa<Cursor className="ml-0.5 h-[0.95em] w-[0.5em]" />
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 font-mono text-sm md:flex"
        >
          {NAV.map((n) => {
            const isActive =
              pathname === "/" &&
              n.href.startsWith("/#") &&
              n.href.slice(2) === activeId;
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "link-underline px-2 py-1 transition-colors hover:text-text",
                  isActive ? "text-accent" : "text-text/70",
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {mounted && desktop && (
            <button
              type="button"
              onClick={enable}
              aria-label="Switch to desktop mode"
              className="hidden border border-divider px-3 py-2 font-mono text-xs text-text/70 hover:bg-surface hover:text-text lg:flex"
            >
              Desktop mode
            </button>
          )}
          <button
            type="button"
            onClick={openCommandPalette}
            aria-label="Open command palette"
            className="hidden items-center gap-2 border border-divider px-3 py-2 font-mono text-xs text-text/60 hover:text-text sm:flex"
          >
            <span aria-hidden>&#8984;K</span>
          </button>
          <a
            href={PERSON.github}
            target="_blank"
            rel="noreferrer"
            className="hidden px-3 py-2 font-mono text-sm text-text/70 hover:text-text sm:inline-flex"
          >
            GitHub
          </a>
          <button
            type="button"
            onClick={open}
            className="border border-divider min-h-10 px-3 py-2 font-mono text-sm hover:bg-surface"
          >
            Resume
          </button>
          <button
            type="button"
            onClick={toggle}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            className="flex min-h-10 items-center justify-center border border-divider px-3 py-2 text-text/80 hover:bg-surface hover:text-text"
          >
            <ThemeIcon dark={theme === "dark"} />
          </button>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="min-h-10 border border-divider px-3 py-2 font-mono text-sm md:hidden"
          >
            {menuOpen ? "✕" : "≡"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-b border-divider bg-bg md:hidden">
          <nav aria-label="Mobile" className="flex flex-col p-4 font-mono">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "border-b border-divider py-3 text-text/80 last:border-0",
                )}
              >
                <span className="text-accent">&gt;</span> {n.label}
              </Link>
            ))}
            <a
              href={PERSON.github}
              target="_blank"
              rel="noreferrer"
              onClick={() => setMenuOpen(false)}
              className="border-b border-divider py-3 text-text/80 last:border-0"
            >
              <span className="text-accent">&gt;</span> GitHub
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
