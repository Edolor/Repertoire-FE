import type { Metadata } from "next";
import Link from "next/link";
import { publishedWork } from "@/lib/content";
import { WorkGrid } from "@/components/work/WorkGrid";
import { PageHeader } from "@/components/primitives/PageHeader";
import { JsonLd } from "@/components/JsonLd";
import { graph, abs, breadcrumbNode, SITE_URL } from "@/lib/seo";
import { PERSON } from "@/content/site";

const WORK_DESCRIPTION =
  "Selected engineering work by Aghoghomena Akasukpe: agent infrastructure for Fabric (Farpoint), the healthcare claims backend at Cavista, a school-management platform for 100,000+ users, and more — each with the context, the constraint, the decisions, and the outcome, sanitized where under NDA.";

export const metadata: Metadata = {
  title: "Work",
  description: WORK_DESCRIPTION,
  alternates: { canonical: "/work" },
  openGraph: {
    type: "website",
    url: "/work",
    title: `Work | ${PERSON.name}`,
    description: WORK_DESCRIPTION,
  },
};

const workLd = graph(
  {
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/work#collection`,
    url: abs("/work"),
    name: "Selected work",
    description: WORK_DESCRIPTION,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#person` },
    hasPart: publishedWork.map((w) => ({
      "@type": "CreativeWork",
      name: w.title,
      url: abs(w.permalink),
      abstract: w.summary,
    })),
  },
  breadcrumbNode([
    { name: "Home", path: "/" },
    { name: "Work", path: "/work" },
  ]),
);

export default function WorkIndex() {
  return (
    <div className="mx-auto w-full max-w-content px-5 py-16 sm:px-8 sm:py-24">
      <JsonLd data={workLd} />

      <PageHeader
        eyebrow="Selected work"
        title="What I've built"
        intro="Engineering writeups across systems, full-stack product, and backend work — the context, the constraint, the decisions, and what I'd do differently. Sanitized where under NDA."
      />

      <section aria-labelledby="all-work" className="mt-10 sm:mt-12">
        <h2 id="all-work" className="sr-only">
          All work
        </h2>
        <WorkGrid items={publishedWork} />
      </section>

      {/* Contact CTA */}
      <div className="mt-14 border-t border-divider pt-8 sm:mt-16">
        <p className="max-w-2xl text-pretty text-text/75">
          Building an agent platform or shipping product end to end?{" "}
          <Link href="/#contact" className="link-underline text-accent-2">
            Let&apos;s talk
          </Link>
          , or read the{" "}
          <Link href="/about" className="link-underline text-accent-2">
            full background
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
