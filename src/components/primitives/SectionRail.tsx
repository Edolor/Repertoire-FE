"use client";

import { usePathname } from "next/navigation";
import { useActiveSection } from "@/hooks/useActiveSection";
import { cn } from "@/lib/cn";

const SECTIONS: { id: string; label: string }[] = [
  { id: "hero", label: "Top" },
  { id: "how-i-build", label: "How I build" },
  { id: "selected-work", label: "Work" },
  { id: "agent-demo", label: "Agent loop" },
  { id: "research", label: "Research" },
  { id: "writing", label: "Writing" },
  { id: "about", label: "About" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

/**
 * Desktop spec-rail: a fixed vertical index of the page. The active section
 * (from a shared IntersectionObserver) gets a longer accent tick + label.
 * Shown only on wide viewports where it clears the centered content column.
 */
export function SectionRail() {
  const pathname = usePathname();
  const active = useActiveSection(SECTIONS.map((s) => s.id));
  if (pathname !== "/") return null;

  return (
    <nav
      aria-label="Section navigation"
      className="fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-3 min-[1320px]:flex"
    >
      {SECTIONS.map((s) => {
        const on = active === s.id;
        return (
          <a
            key={s.id}
            href={`/#${s.id}`}
            className="group flex items-center gap-2"
            aria-current={on ? "true" : undefined}
          >
            <span
              className={cn(
                "font-mono text-[10px] uppercase tracking-widest transition-all duration-200",
                on
                  ? "text-accent opacity-100"
                  : "text-text/50 opacity-0 group-hover:opacity-100",
              )}
            >
              {s.label}
            </span>
            <span
              className={cn(
                "h-px transition-all duration-200",
                on ? "w-6 bg-accent" : "w-3 bg-text/30 group-hover:w-5 group-hover:bg-text/60",
              )}
            />
          </a>
        );
      })}
    </nav>
  );
}
