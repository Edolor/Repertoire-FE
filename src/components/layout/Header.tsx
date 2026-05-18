"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useResume } from "@/context/ResumeContext/ResumeContext";
import { useTheme } from "@/context/ThemeContext/ThemeContext";
import { NAV, PERSON } from "@/content/site";
import { Cursor } from "@/components/primitives/Cursor";
import { cn } from "@/lib/cn";

export function openCommandPalette() {
  window.dispatchEvent(new CustomEvent("open-command-palette"));
}

export function Header() {
  const { open } = useResume();
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Logo" className="h-6 w-6 dark:invert" />
          <span>
            aa<Cursor className="ml-0.5 h-[0.95em] w-[0.5em]" />
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 font-mono text-sm md:flex"
        >
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="px-2 py-1 text-text/70 transition-colors hover:text-text"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openCommandPalette}
            aria-label="Open command palette"
            className="hidden items-center gap-2 border border-divider px-2.5 py-1.5 font-mono text-xs text-text/60 hover:text-text sm:flex"
          >
            <span aria-hidden>&#8984;K</span>
          </button>
          <a
            href={PERSON.github}
            target="_blank"
            rel="noreferrer"
            className="px-2 py-1 font-mono text-sm text-text/70 hover:text-text"
          >
            GitHub
          </a>
          <button
            type="button"
            onClick={open}
            className="border border-divider px-3 py-1.5 font-mono text-sm hover:bg-surface"
          >
            Resume
          </button>
          <button
            type="button"
            onClick={toggle}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            className="border border-divider px-2.5 py-1.5 font-mono text-sm hover:bg-surface"
          >
            {theme === "dark" ? "☼" : "☾"}
          </button>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="border border-divider px-3 py-1.5 font-mono text-sm md:hidden"
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
          </nav>
        </div>
      )}
    </header>
  );
}
