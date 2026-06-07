import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { posts } from "#content";
import { formatDate } from "@/lib/content";
import { JsonLd } from "@/components/JsonLd";
import { ArticleBody } from "@/components/interactive/ArticleBody";
import { graph, articleNode, breadcrumbNode } from "@/lib/seo";

// The content catalog is fully known at build time, so the param space is
// closed: any slug outside generateStaticParams serves the static not-found
// from the CDN instead of spinning up an on-demand render.
export const dynamicParams = false;

export function generateStaticParams() {
  return posts.filter((p) => !p.draft).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = posts.find((x) => x.slug === slug && !x.draft);
  if (!p) return {};
  return {
    title: p.title,
    description: p.description,
    keywords: p.tags,
    alternates: {
      canonical: p.permalink,
      types: { "application/rss+xml": "/feed.xml" },
    },
    openGraph: {
      type: "article",
      url: p.permalink,
      title: p.title,
      description: p.description,
      publishedTime: p.date,
      modifiedTime: p.updated ?? p.date,
      authors: ["Aghoghomena Akasukpe"],
      tags: p.tags,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = posts.find((x) => x.slug === slug && !x.draft);
  if (!p) notFound();

  const ld = graph(
    articleNode({
      title: p.title,
      description: p.description,
      path: p.permalink,
      datePublished: p.date,
      dateModified: p.updated ?? p.date,
      keywords: p.tags,
      wordCount: p.metadata.wordCount,
      section: p.tags[0],
    }),
    breadcrumbNode([
      { name: "Home", path: "/" },
      { name: "Writing", path: "/writing" },
      { name: p.title, path: p.permalink },
    ]),
  );

  return (
    <article className="mx-auto w-full max-w-3xl px-5 pb-8 pt-6 sm:px-8 sm:pb-12 sm:pt-10">
      <JsonLd data={ld} />
      <Link
        href="/writing"
        className="font-mono text-xs text-text/55 hover:text-text"
      >
        &lt; writing
      </Link>
      <h1 className="mt-6 text-balance text-3xl font-bold leading-tight sm:text-4xl">
        {p.title}
      </h1>
      <p className="mt-3 font-mono text-xs text-text/50">
        {formatDate(p.date)} · {p.metadata.readingTime} min read ·{" "}
        {p.tags.map((t) => `#${t}`).join(" ")}
      </p>
      {p.cover && (
        <div className="mt-8 overflow-hidden border border-divider bg-surface">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.cover}
            alt=""
            decoding="async"
            className="w-full"
          />
        </div>
      )}
      <ArticleBody html={p.body} />
      <div className="mt-10 border-t border-divider pt-6">
        <Link
          href="/#contact"
          className="font-mono text-sm text-accent-2 hover:underline"
        >
          &gt; reach out
        </Link>
      </div>
    </article>
  );
}
