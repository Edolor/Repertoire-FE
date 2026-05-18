import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { posts } from "#content";
import { formatDate } from "@/lib/content";

export function generateStaticParams() {
  return posts.filter((p) => !p.draft).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = posts.find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: p.permalink },
    openGraph: {
      type: "article",
      title: p.title,
      description: p.description,
      publishedTime: p.date,
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

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.title,
    description: p.description,
    datePublished: p.date,
    dateModified: p.updated ?? p.date,
    author: { "@type": "Person", name: "Aghoghomena Akasukpe" },
    keywords: p.tags.join(", "),
    mainEntityOfPage: `https://www.aghoghomena.com${p.permalink}`,
  };

  return (
    <article className="mx-auto w-full max-w-2xl px-5 py-16 sm:px-8 sm:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
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
      <div
        className="prose mt-10"
        dangerouslySetInnerHTML={{ __html: p.body }}
      />
      <div className="mt-12 border-t border-divider pt-6">
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
