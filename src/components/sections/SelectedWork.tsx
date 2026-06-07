import Link from "next/link";
import { work } from "#content";
import { Section } from "@/components/primitives/Section";
import { RevealGroup, RevealItem } from "@/components/primitives/Reveal";
import { CornerBrackets } from "@/components/primitives/CornerBrackets";
import { Tilt } from "@/components/primitives/Tilt";
import { Badge } from "@/components/ui/Badge";

export function SelectedWork() {
  const items = work
    .filter((w) => !w.draft)
    .sort((a, b) => a.order - b.order);

  return (
    <Section
      id="selected-work"
      index="02"
      eyebrow="Selected work"
      title="What I've built"
      intro="Engineering writeups, sanitized where under NDA. Each one: the context, the constraint, the decisions, and what I would do differently."
    >
      <RevealGroup className="grid gap-5 sm:gap-6 md:grid-cols-2">
        {items.map((w) => (
          <RevealItem key={w.slug} className="h-full">
            <Tilt max={6} sheen className="group relative h-full">
            <article className="panel relative flex h-full flex-col border border-divider bg-surface transition-[border-color,box-shadow] duration-200 ease-out hover:border-accent/40 hover:shadow-[0_22px_50px_-26px_rgb(var(--accent)/0.5)] motion-reduce:transition-none">
              <CornerBrackets />
              <Link
                href={w.permalink}
                className="flex h-full flex-col p-5 sm:p-6"
              >
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
                  <p className="border-l-2 border-accent pl-3 text-sm text-text/80 transition-colors duration-200 group-hover:bg-accent/5 group-hover:text-text/95">
                    {w.outcome}
                  </p>
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
    </Section>
  );
}
