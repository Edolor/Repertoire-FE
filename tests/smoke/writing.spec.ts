import { test, expect } from "@playwright/test";
import { trackPageErrors, assertNoErrors } from "./helpers";

test("writing index lists posts and a post renders", async ({
  page,
}, testInfo) => {
  const errors = trackPageErrors(page);
  await page.goto("/writing");

  // Generous first-paint timeout: the dev server compiles this route on
  // first hit, and the smoke harness boots `next dev` (see CLAUDE.md).
  await expect(
    page.getByRole("heading", { name: "Building reliable systems" }),
  ).toBeVisible({ timeout: 30_000 });

  const firstPost = page.locator("main ul li a").first();
  await firstPost.click();
  await expect(page).toHaveURL(/\/writing\/.+/);
  // Compiled-markdown body renders as real HTML (CSP-safe, no eval).
  await expect(page.locator("article .prose p").first()).toBeVisible();

  assertNoErrors(errors, testInfo);
});

test("a cloned post renders local images, copy buttons, and lightbox", async ({
  page,
}, testInfo) => {
  const errors = trackPageErrors(page);
  // Deliberately do NOT grant clipboard permission: this exercises the real
  // path most users hit, where the async Clipboard API is blocked and the copy
  // must succeed via the execCommand fallback and still show "copied" feedback.
  await page.goto("/writing/role-based-access-control-nextjs-middleware");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible({
    timeout: 30_000,
  });

  // Images are local (same-origin /blog/...) and actually decode.
  const img = page.locator("article figure img").first();
  await expect(img).toBeVisible();
  const w = await img.evaluate((n: HTMLImageElement) => n.naturalWidth);
  expect(w).toBeGreaterThan(0);
  expect(await img.getAttribute("src")).toMatch(/^\/blog\//);

  // ArticleBody enhanced code blocks with a working copy button.
  const copy = page.locator("button.code-copy").first();
  await expect(copy).toBeVisible();
  await copy.click();
  await expect(copy).toContainText("copied");
  await expect(copy).toHaveClass(/is-copied/);

  // Build-time syntax highlighting: code is tokenized (hljs) and the brand
  // theme colors keyword tokens with the accent-2 blue (rgb 29 74 255).
  await expect(page.locator("article pre code.hljs").first()).toBeVisible();
  const keyword = page.locator("article .hljs-keyword").first();
  await expect(keyword).toBeVisible();
  expect(await keyword.evaluate((el) => getComputedStyle(el).color)).toBe(
    "rgb(29, 74, 255)",
  );

  // Zoomable figure opens the Lightbox; Esc closes it.
  await page.locator("article figure img.zoomable").first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();

  assertNoErrors(errors, testInfo);
});

test("a selected-work case study renders its sanitized writeup", async ({
  page,
}, testInfo) => {
  const errors = trackPageErrors(page);
  await page.goto("/work/agentic-coding-platform");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible({
    timeout: 30_000,
  });
  // The compiled-markdown writeup body renders as real HTML.
  await expect(page.locator("article .prose").first()).toBeVisible();

  assertNoErrors(errors, testInfo);
});

test("RSS and JSON feeds are served", async ({ request }) => {
  const rss = await request.get("/feed.xml");
  expect(rss.ok()).toBeTruthy();
  expect(rss.headers()["content-type"]).toContain("rss+xml");
  expect(await rss.text()).toContain("<rss");

  const json = await request.get("/feed.json");
  expect(json.ok()).toBeTruthy();
  const feed = await json.json();
  expect(feed.version).toContain("jsonfeed.org");
  expect(Array.isArray(feed.items)).toBeTruthy();
});
