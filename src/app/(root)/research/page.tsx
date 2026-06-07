import type { Metadata } from "next";
import Link from "next/link";
import { RESEARCH, PERSON, ACADEMIC_FOUNDATION } from "@/content/site";
import { ResearchList } from "@/components/research/ResearchList";
import { publishedPosts } from "@/lib/content";
import { JsonLd } from "@/components/JsonLd";
import { graph, abs, breadcrumbNode, SITE_URL } from "@/lib/seo";

const RESEARCH_DESCRIPTION =
  "Research & publications by Aghoghomena Akasukpe: a peer-reviewed paper at PST 2025 (IEEE Xplore) and a $20,000 MITACS research award funding agentic-coding infrastructure (MCP) — external evidence the engineering holds up under scrutiny.";

// Posts that expand on the research (cross-link, not duplicated content).
const RELATED_POSTS = publishedPosts
  .filter((p) => p.tags.includes("research"))
  .slice(0, 3);

export const metadata: Metadata = {
  title: "Research",
  description: RESEARCH_DESCRIPTION,
  alternates: { canonical: "/research" },
  openGraph: {
    type: "website",
    url: "/research",
    title: `Research | ${PERSON.name}`,
    description: RESEARCH_DESCRIPTION,
  },
};

const researchLd = graph(
  {
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/research#collection`,
    url: abs("/research"),
    name: "Research & publications",
    description: RESEARCH_DESCRIPTION,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#person` },
    hasPart: RESEARCH.map((r) => ({
      "@type": "CreativeWork",
      name: r.title,
      url: r.href,
      abstract: r.why,
    })),
  },
  breadcrumbNode([
    { name: "Home", path: "/" },
    { name: "Research", path: "/research" },
  ]),
);

export default function ResearchPage() {
  return (
    <div className="mx-auto w-full max-w-content px-5 py-16 sm:px-8 sm:py-24">
      <JsonLd data={researchLd} />

      <p className="font-mono text-xs uppercase tracking-[0.125em] text-text/65">
        <span aria-hidden className="text-accent">&gt;</span> Research &amp;
        publications
      </p>
      <h1 className="t-h2 mt-3 max-w-3xl text-balance font-bold">
        External evidence, in plain language
      </h1>
      <p className="mt-5 max-w-2xl text-pretty text-text/70 sm:text-lg">
        Peer review and competitive funding are external evidence the work holds
        up under scrutiny by people paid to find holes in it — the same bar I
        hold my engineering to.
      </p>

      <section aria-labelledby="publications" className="mt-10 sm:mt-12">
        <h2 id="publications" className="sr-only">
          Publications &amp; funding
        </h2>
        <ResearchList items={RESEARCH} />
      </section>

      {/* Academic foundation */}
      <section aria-labelledby="foundation" className="mt-14 sm:mt-16">
        <h2
          id="foundation"
          className="font-mono text-xs uppercase tracking-widest text-text/65"
        >
          <span aria-hidden className="text-accent">&gt;</span> Academic
          foundation
        </h2>
        <ul className="mt-4 divide-y divide-divider border-y border-divider">
          {ACADEMIC_FOUNDATION.map((f) => (
            <li key={f} className="flex gap-3 py-4 text-sm text-text/80">
              <span aria-hidden className="font-mono text-accent">
                &gt;
              </span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-pretty text-text/75">
          The full timeline lives on the{" "}
          <Link href="/about" className="link-underline text-accent-2">
            about page
          </Link>
          .
        </p>
      </section>

      {RELATED_POSTS.length > 0 && (
        <section aria-labelledby="related" className="mt-14 sm:mt-16">
          <h2
            id="related"
            className="font-mono text-xs uppercase tracking-widest text-text/65"
          >
            <span aria-hidden className="text-accent">&gt;</span> Related writing
          </h2>
          <ul className="mt-4 divide-y divide-divider border-y border-divider">
            {RELATED_POSTS.map((p) => (
              <li key={p.slug}>
                <Link
                  href={p.permalink}
                  className="group flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between"
                >
                  <span className="font-medium text-text/85 group-hover:text-accent-2">
                    {p.title}
                  </span>
                  <span className="shrink-0 font-mono text-xs text-text/55 sm:pl-6">
                    read &gt;
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
