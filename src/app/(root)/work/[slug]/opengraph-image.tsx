import { work } from "#content";
import { terminalImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Case study by Aghoghomena Akasukpe";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return work.filter((w) => !w.draft).map((w) => ({ slug: w.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const w = work.find((x) => x.slug === slug);
  return terminalImage({
    kicker: "aghoghomena.com / work",
    title: w?.title ?? "Selected work",
    footer: "Aghoghomena Akasukpe · Agentic AI Systems Engineer",
  });
}
