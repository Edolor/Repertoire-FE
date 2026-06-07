import { describe, it, expect, vi } from "vitest";

// Deterministic fixtures for the "#content" data module. Includes draft items
// and intentionally out-of-order date/order values so sorting is observable.
vi.mock("#content", () => ({
  posts: [
    { slug: "old", date: "2021-01-01", draft: false, tags: ["b", "a"] },
    { slug: "new", date: "2024-06-15", draft: false, tags: ["c", "a"] },
    { slug: "mid", date: "2022-09-10", draft: false, tags: ["b"] },
    // Drafts must be excluded even though this is the newest date + has a tag.
    { slug: "draft", date: "2025-12-31", draft: true, tags: ["zzz"] },
  ],
  work: [
    { slug: "w-third", order: 3, draft: false },
    { slug: "w-first", order: 1, draft: false },
    { slug: "w-second", order: 2, draft: false },
    // Draft excluded even though it would sort first by order.
    { slug: "w-draft", order: 0, draft: true },
  ],
}));

// Imported after the mock is registered (vi.mock is hoisted regardless).
import { publishedPosts, publishedWork, allTags, formatDate } from "@/lib/content";

describe("publishedPosts", () => {
  it("excludes drafts", () => {
    expect(publishedPosts.map((p) => p.slug)).not.toContain("draft");
    expect(publishedPosts).toHaveLength(3);
  });

  it("sorts newest-first by date", () => {
    expect(publishedPosts.map((p) => p.slug)).toEqual(["new", "mid", "old"]);
  });
});

describe("publishedWork", () => {
  it("excludes drafts", () => {
    expect(publishedWork.map((w) => w.slug)).not.toContain("w-draft");
    expect(publishedWork).toHaveLength(3);
  });

  it("sorts by order ascending", () => {
    expect(publishedWork.map((w) => w.slug)).toEqual([
      "w-first",
      "w-second",
      "w-third",
    ]);
    expect(publishedWork.map((w) => w.order)).toEqual([1, 2, 3]);
  });
});

describe("allTags", () => {
  it("is the unique, sorted union of published-post tags", () => {
    // a (old,new), b (old,mid), c (new) -> deduped + sorted. "zzz" is a draft.
    expect(allTags).toEqual(["a", "b", "c"]);
  });

  it("excludes tags that only appear on drafts", () => {
    expect(allTags).not.toContain("zzz");
  });
});

describe("formatDate", () => {
  it("formats an ISO date as a long US date", () => {
    // Parsed as UTC midnight; assert the year/month rather than the exact day
    // to stay robust across the runner's timezone.
    const out = formatDate("2024-06-15");
    expect(out).toContain("June");
    expect(out).toContain("2024");
    expect(out).toMatch(/^June \d{1,2}, 2024$/);
  });
});
