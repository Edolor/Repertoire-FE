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
    page.getByRole("heading", { name: "Building and breaking agents" }),
  ).toBeVisible({ timeout: 30_000 });

  const firstPost = page.locator("main ul li a").first();
  await firstPost.click();
  await expect(page).toHaveURL(/\/writing\/.+/);
  // Compiled-markdown body renders as real HTML (CSP-safe, no eval).
  await expect(page.locator("article .prose p").first()).toBeVisible();

  assertNoErrors(errors, testInfo);
});

test("a selected-work case study renders its sanitized writeup", async ({
  page,
}, testInfo) => {
  const errors = trackPageErrors(page);
  await page.goto("/work/agentic-coding-platform-isolation");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible({
    timeout: 30_000,
  });
  await expect(page.getByText("What I would do differently")).toBeVisible();

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
