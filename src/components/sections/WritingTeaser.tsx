import Link from "next/link";
import { Section } from "@/components/primitives/Section";
import { publishedPosts, formatDate } from "@/lib/content";

export function WritingTeaser() {
  const latest = publishedPosts.slice(0, 3);
  return (
    <Section
      id="writing"
      eyebrow="Writing"
      title="Notes on building systems and shipping product"
      intro={
        <Link href="/writing" className="text-accent-2 hover:underline">
          Full index &amp; RSS &gt;
        </Link>
      }
    >
      <ul className="divide-y divide-divider border-y border-divider">
        {latest.map((p) => (
          <li key={p.slug}>
            <Link
              href={p.permalink}
              className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between"
            >
              <div className="max-w-2xl">
                <h3 className="text-lg font-bold group-hover:text-accent-2">
                  {p.title}
                </h3>
                <p className="mt-1 text-sm text-text/65">{p.description}</p>
              </div>
              <span className="shrink-0 font-mono text-xs text-text/65 sm:pl-6">
                {formatDate(p.date)} · {p.metadata.readingTime} min
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
