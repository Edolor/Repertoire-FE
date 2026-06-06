import Link from "next/link";
import { work } from "#content";
import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/primitives/Reveal";
import { Badge } from "@/components/ui/Badge";

export function SelectedWork() {
  const items = work
    .filter((w) => !w.draft)
    .sort((a, b) => a.order - b.order);

  return (
    <Section
      id="selected-work"
      eyebrow="Selected work"
      title="What I've built"
      intro="Engineering writeups, sanitized where under NDA. Each one: the context, the constraint, the decisions, and what I would do differently."
    >
      <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
        {items.map((w, idx) => (
          <Reveal key={w.slug} delay={idx * 0.05}>
            <article className="flex h-full flex-col border border-divider bg-surface">
              <Link
                href={w.permalink}
                className="group flex h-full flex-col p-5 sm:p-6"
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
                  <h3 className="text-lg font-bold leading-snug group-hover:text-accent-2">
                    {w.title}
                  </h3>
                  <p className="text-sm text-text/70">{w.summary}</p>
                  <p className="border-l-2 border-accent pl-3 text-sm text-text/80">
                    {w.outcome}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {w.tags.map((t) => (
                      <Badge key={t}>{t}</Badge>
                    ))}
                  </div>
                </div>
                <span className="mt-auto pt-4 font-mono text-xs text-accent-2 group-hover:underline">
                  read the writeup &gt;
                </span>
              </Link>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
