import type { Metadata } from "next";
import Link from "next/link";
import { publishedPosts, allTags, formatDate } from "@/lib/content";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { JsonLd } from "@/components/JsonLd";
import { graph, abs, breadcrumbNode, SITE_URL } from "@/lib/seo";

const WRITING_DESCRIPTION =
  "Notes on building systems and shipping product: agent infrastructure, reliability, full-stack engineering, and lessons from real builds.";

export const metadata: Metadata = {
  title: "Writing",
  description: WRITING_DESCRIPTION,
  alternates: {
    canonical: "/writing",
    types: {
      "application/rss+xml": "/feed.xml",
      "application/feed+json": "/feed.json",
    },
  },
  openGraph: {
    type: "website",
    url: "/writing",
    title: "Writing",
    description: WRITING_DESCRIPTION,
  },
};

const writingLd = graph(
  {
    "@type": "Blog",
    "@id": `${SITE_URL}/writing#blog`,
    url: abs("/writing"),
    name: "Building reliable systems",
    description: WRITING_DESCRIPTION,
    inLanguage: "en",
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#person` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
    blogPost: publishedPosts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.description,
      url: abs(p.permalink),
      datePublished: p.date,
      dateModified: p.updated ?? p.date,
    })),
  },
  breadcrumbNode([
    { name: "Home", path: "/" },
    { name: "Writing", path: "/writing" },
  ]),
);

export default function WritingIndex() {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
      <JsonLd data={writingLd} />
      <Eyebrow>Writing</Eyebrow>
      <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
        Building reliable systems
      </h1>
      <p className="mt-3 text-text/70">
        <a href="/feed.xml" className="text-accent-2 hover:underline">
          RSS
        </a>
        {" · "}
        <a href="/feed.json" className="text-accent-2 hover:underline">
          JSON Feed
        </a>
      </p>

      {allTags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {allTags.map((t) => (
            <span
              key={t}
              className="border border-divider px-2 py-0.5 font-mono text-xs text-text/55"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <ul className="mt-10 divide-y divide-divider border-y border-divider">
        {publishedPosts.map((p) => (
          <li key={p.slug}>
            <Link
              href={p.permalink}
              className="group flex flex-col gap-5 py-6 sm:flex-row sm:items-start"
            >
              {p.cover && (
                <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden border border-divider bg-surface sm:w-56">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.cover}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="text-xl font-bold group-hover:text-accent-2">
                    {p.title}
                  </h2>
                  <span className="font-mono text-xs text-text/45">
                    {formatDate(p.date)} · {p.metadata.readingTime} min read
                  </span>
                </div>
                <p className="mt-2 text-text/70">{p.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[11px] text-text/45"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
