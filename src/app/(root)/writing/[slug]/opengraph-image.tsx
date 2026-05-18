import { ImageResponse } from "next/og";
import { posts } from "#content";

export const alt = "Article: Aghoghomena Akasukpe";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return posts.filter((p) => !p.draft).map((p) => ({ slug: p.slug }));
}

export default async function OG({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = posts.find((x) => x.slug === slug);
  const title = p?.title ?? "Writing";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#EEEFE9",
          color: "#151515",
          padding: 72,
          fontFamily: "monospace",
        }}
      >
        <div style={{ fontSize: 26, color: "#F54E00" }}>
          &gt; aghoghomena.com / writing
        </div>
        <div style={{ fontSize: 60, fontWeight: 700, lineHeight: 1.1 }}>
          {title}
        </div>
        <div style={{ fontSize: 26, color: "#151515" }}>
          Aghoghomena Akasukpe, Agentic AI Systems Engineer
        </div>
      </div>
    ),
    size,
  );
}
