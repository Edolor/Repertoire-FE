import { describe, it, expect } from "vitest";
import sitemap from "@/app/sitemap";
import { publishedPosts, publishedWork } from "@/lib/content";
import { SITE_URL } from "@/lib/seo";

const entries = sitemap();
const byUrl = new Map(entries.map((e) => [e.url, e]));
const urls = entries.map((e) => e.url);

describe("sitemap", () => {
  it("includes the static routes with their declared priorities", () => {
    const expected: Record<string, number> = {
      [SITE_URL]: 1,
      [`${SITE_URL}/work`]: 0.9,
      [`${SITE_URL}/writing`]: 0.8,
      [`${SITE_URL}/about`]: 0.7,
      [`${SITE_URL}/research`]: 0.6,
    };
    for (const [url, priority] of Object.entries(expected)) {
      expect(byUrl.get(url)?.priority).toBe(priority);
    }
  });

  it("lists every published post permalink exactly once as an absolute URL", () => {
    for (const p of publishedPosts) {
      const url = `${SITE_URL}${p.permalink}`;
      expect(urls.filter((u) => u === url)).toHaveLength(1);
    }
  });

  it("lists every published work permalink exactly once as an absolute URL", () => {
    for (const w of publishedWork) {
      const url = `${SITE_URL}${w.permalink}`;
      expect(urls.filter((u) => u === url)).toHaveLength(1);
    }
  });

  it("contains no duplicate URLs", () => {
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("only emits URLs under the canonical origin", () => {
    for (const url of urls) {
      expect(url.startsWith(SITE_URL)).toBe(true);
    }
  });

  it("gives every entry a valid lastModified date", () => {
    for (const e of entries) {
      const d = new Date(e.lastModified as string | Date);
      expect(Number.isNaN(d.getTime())).toBe(false);
    }
  });

  it("sets a post entry's lastModified to its updated ?? date fallback", () => {
    const post = publishedPosts[0];
    const entry = byUrl.get(`${SITE_URL}${post.permalink}`);
    expect(entry).toBeDefined();
    const got = new Date(entry!.lastModified as string | Date).getTime();
    const expectedTime = new Date(post.updated ?? post.date).getTime();
    expect(got).toBe(expectedTime);
  });
});
