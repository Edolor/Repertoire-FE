import { test, expect } from "@playwright/test";
import { trackPageErrors, assertNoErrors } from "./helpers";

// /day-out is a standalone, mobile-first invitation card outside the (root)
// group: no site chrome, its own palette and self-hosted Google faces. The
// assertions below are the mobile-friendliness contract: no horizontal
// overflow at 375px, all four illustrated stops present, and the
// scroll-reveal actually resolves to visible content.
test.use({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });

test("day-out invitation renders cleanly on a phone", async ({ page }, testInfo) => {
  const errors = trackPageErrors(page);
  await page.goto("/day-out");

  await expect(
    page.getByRole("heading", { level: 1, name: /A date with Ifeoma/ }),
  ).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText("I planned us a day.")).toBeVisible();
  await expect(page.getByText(/excited to see you/i)).toHaveCount(3);

  // No site chrome on this route.
  await expect(page.locator("header")).toHaveCount(0);
  await expect(page.locator("footer")).toHaveCount(0);

  // Four stops, in order, each with an illustration above the title.
  const h2 = page.getByRole("heading", { level: 2 });
  await expect(h2).toHaveText([
    "Matcha & Something Sweet",
    "A Walk by the Water",
    "A Little Friendly Competition",
    "Then North",
  ]);
  await expect(page.locator("svg[data-art]")).toHaveCount(4);
  await expect(page.getByText("Momochee’s Desserts")).toBeVisible();

  // Mobile-friendly: the document must never scroll sideways.
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    bodyOverflow: getComputedStyle(document.body).overflowY,
  }));
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
  expect(overflow.bodyOverflow).not.toBe("hidden");

  // Scroll-reveal resolves: the sign-off becomes fully opaque after entering view.
  const signoff = page.getByText("That’s the day. The rest we make up as we go.");
  await signoff.scrollIntoViewIfNeeded();
  await expect
    .poll(async () => signoff.evaluate((el) => getComputedStyle(el.parentElement!).opacity), {
      timeout: 5_000,
    })
    .toBe("1");

  // Tap-to-say-yes: swaps to the sign-off, blooms petals, and survives a reload.
  const yes = page.getByRole("button", { name: "I’ll be there" });
  await yes.scrollIntoViewIfNeeded();
  await yes.click();
  await expect(page.getByRole("button", { name: "See you soon." })).toBeVisible();
  await expect(page.locator("[data-petal]")).toHaveCount(26);
  await page.reload();
  await expect(page.getByRole("button", { name: "See you soon." })).toBeVisible({ timeout: 30_000 });
  await expect(page.locator("[data-petal]")).toHaveCount(0);

  // Private page: not for search engines (meta + header, see next.config.js).
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  const head = await page.request.head("/day-out");
  expect(head.headers()["x-robots-tag"]).toMatch(/noindex/);

  // Link preview: the generated share card is wired up and actually renders.
  const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
  expect(ogImage).toContain("/day-out/opengraph-image");
  const img = await page.request.get(ogImage!);
  expect(img.status()).toBe(200);
  expect(img.headers()["content-type"]).toBe("image/png");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "A date with Ifeoma");

  assertNoErrors(errors, testInfo);
});
