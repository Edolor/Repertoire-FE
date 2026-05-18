import { publishedPosts } from "@/lib/content";

const SITE = "https://www.aghoghomena.com";

// JSON Feed 1.1 (https://www.jsonfeed.org/version/1.1/).
export function GET() {
  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: "Aghoghomena Akasukpe: Writing",
    home_page_url: `${SITE}/writing`,
    feed_url: `${SITE}/feed.json`,
    description: "Building and breaking agent systems.",
    authors: [{ name: "Aghoghomena Akasukpe" }],
    language: "en",
    items: publishedPosts.map((p) => ({
      id: `${SITE}${p.permalink}`,
      url: `${SITE}${p.permalink}`,
      title: p.title,
      summary: p.description,
      content_html: p.body,
      date_published: new Date(p.date).toISOString(),
      tags: p.tags,
    })),
  };
  return Response.json(feed, {
    headers: { "Cache-Control": "public, max-age=3600" },
  });
}
