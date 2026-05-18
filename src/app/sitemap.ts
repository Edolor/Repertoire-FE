import type { MetadataRoute } from "next";
import { publishedPosts, publishedWork } from "@/lib/content";

const SITE = "https://www.aghoghomena.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const stat = ["", "/writing", "/about"].map((path) => ({
    url: `${SITE}${path}`,
    lastModified: new Date(),
  }));
  const posts = publishedPosts.map((p) => ({
    url: `${SITE}${p.permalink}`,
    lastModified: new Date(p.updated ?? p.date),
  }));
  const work = publishedWork.map((w) => ({
    url: `${SITE}${w.permalink}`,
    lastModified: new Date(),
  }));
  return [...stat, ...work, ...posts];
}
