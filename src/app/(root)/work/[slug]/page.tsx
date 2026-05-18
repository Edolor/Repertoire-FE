import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { work } from "#content";
import { Badge } from "@/components/ui/Badge";
import { JsonLd } from "@/components/JsonLd";
import { graph, articleNode, breadcrumbNode } from "@/lib/seo";

export function generateStaticParams() {
  return work.filter((w) => !w.draft).map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const w = work.find((x) => x.slug === slug);
  if (!w) return {};
  return {
    title: w.title,
    description: w.summary,
    keywords: w.tags,
    alternates: { canonical: w.permalink },
    openGraph: {
      title: w.title,
      description: w.summary,
      type: "article",
      url: w.permalink,
      tags: w.tags,
    },
  };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const w = work.find((x) => x.slug === slug && !x.draft);
  if (!w) notFound();

  const ld = graph(
    articleNode({
      section: "Case study",
      title: w.title,
      description: w.summary,
      abstract: w.outcome,
      path: w.permalink,
      keywords: w.tags,
    }),
    breadcrumbNode([
      { name: "Home", path: "/" },
      { name: "Selected work", path: "/#selected-work" },
      { name: w.title, path: w.permalink },
    ]),
  );

  return (
    <article className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
      <JsonLd data={ld} />
      <Link
        href="/#selected-work"
        className="font-mono text-xs text-text/55 hover:text-text"
      >
        &lt; selected work
      </Link>
      <p className="mt-6 font-mono text-[11px] uppercase tracking-widest text-text/45">
        {w.client}
      </p>
      <h1 className="mt-2 text-balance text-3xl font-bold leading-tight sm:text-4xl">
        {w.title}
      </h1>
      <p className="mt-3 text-pretty text-lg text-text/70">{w.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {w.tags.map((t) => (
          <Badge key={t}>{t}</Badge>
        ))}
      </div>
      <p className="mt-6 border-l-2 border-accent pl-4 text-text/85">
        {w.outcome}
      </p>

      <div
        className="prose mt-10"
        dangerouslySetInnerHTML={{ __html: w.body }}
      />


      <div className="mt-12 border-t border-divider pt-6">
        <Link
          href="/#contact"
          className="font-mono text-sm text-accent-2 hover:underline"
        >
          &gt; talk to me about work like this
        </Link>
      </div>
    </article>
  );
}
