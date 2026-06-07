import Link from "next/link";
import type { Work } from "#content";
import { RevealGroup, RevealItem } from "@/components/primitives/Reveal";
import { CornerBrackets } from "@/components/primitives/CornerBrackets";
import { Tilt } from "@/components/primitives/Tilt";
import { Badge } from "@/components/ui/Badge";

// Derive the card contract from the Velite-validated source of truth instead
// of redeclaring a parallel shape — a schema rename now fails here, not at a
// random call site. (Type-only import: elided at runtime, no JSON pulled in.)
export type WorkCardItem = Pick<
  Work,
  "slug" | "permalink" | "client" | "locked" | "title" | "summary" | "outcome" | "tags"
>;

/** The selected-work card grid. Shared by the home teaser and the /work index. */
export function WorkGrid({ items }: { items: WorkCardItem[] }) {
  return (
    <RevealGroup className="grid gap-5 sm:gap-6 md:grid-cols-2">
      {items.map((w) => (
        <RevealItem key={w.slug} className="h-full">
          <Tilt max={6} sheen className="group relative h-full">
            <article className="panel relative flex h-full flex-col border border-divider bg-surface transition-[border-color,box-shadow] duration-200 ease-out hover:border-accent/40 hover:shadow-[0_22px_50px_-26px_rgb(var(--accent)/0.5)] motion-reduce:transition-none">
              <CornerBrackets />
              <Link href={w.permalink} className="flex h-full flex-col p-5 sm:p-6">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-text/65">
                    {w.client}
                  </span>
                  {w.locked && (
                    <span className="font-mono text-[11px] text-accent">
                      details under NDA
                    </span>
                  )}
                </div>
                <div className="mt-3 space-y-3">
                  <h3 className="text-lg font-bold leading-snug transition-colors group-hover:text-accent-2">
                    {w.title}
                  </h3>
                  <p className="text-sm text-text/70">{w.summary}</p>
                  <div className="space-y-1">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent/80">
                      outcome
                    </p>
                    <p className="text-sm text-text/80 transition-colors duration-200 group-hover:text-text/95">
                      {w.outcome}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {w.tags.map((t) => (
                      <Badge key={t}>{t}</Badge>
                    ))}
                  </div>
                </div>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-4 font-mono text-xs text-accent-2">
                  <span className="group-hover:underline">read the writeup</span>
                  <span
                    aria-hidden
                    className="inline-block transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                  >
                    &gt;
                  </span>
                </span>
              </Link>
            </article>
          </Tilt>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
