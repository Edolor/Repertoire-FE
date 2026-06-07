import Link from "next/link";
import { publishedWork } from "@/lib/content";
import { Section } from "@/components/primitives/Section";
import { WorkGrid } from "@/components/work/WorkGrid";

export function SelectedWork() {
  const all = publishedWork;
  const featured = all.slice(0, 2);

  return (
    <Section
      id="selected-work"
      eyebrow="Selected work"
      title="Featured work"
      intro="A couple of representative builds. Each writeup: the context, the constraint, the decisions, and what I would do differently — sanitized where under NDA."
    >
      <WorkGrid items={featured} />
      <div className="mt-8">
        <Link
          href="/work"
          className="group inline-flex items-center gap-1.5 border border-divider px-4 py-2.5 font-mono text-sm text-text/80 transition-colors hover:border-accent hover:text-accent focus-visible:border-accent-2 focus-visible:outline-none"
        >
          See all work
          <span className="text-text/45 group-hover:text-accent">
            ({all.length})
          </span>
          <span
            aria-hidden
            className="inline-block transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
          >
            &gt;
          </span>
        </Link>
      </div>
    </Section>
  );
}
