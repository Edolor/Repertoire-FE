import { posts } from "#content";
import { terminalImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Article by Aghoghomena Akasukpe";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return posts.filter((p) => !p.draft).map((p) => ({ slug: p.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = posts.find((x) => x.slug === slug);
  return terminalImage({
    kicker: "aghoghomena.com / writing",
    title: p?.title ?? "Writing",
    footer: "Aghoghomena Akasukpe · Systems & Full-Stack Engineer",
  });
}
