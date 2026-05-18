import { test, expect } from "@playwright/test";
import { trackPageErrors, assertNoErrors } from "./helpers";

test("home hero shows the current positioning and renders cleanly", async ({
  page,
}, testInfo) => {
  const errors = trackPageErrors(page);
  await page.goto("/");

  // The repositioned hero copy must be present.
  await expect(
    page.getByText("Agentic AI Systems Engineer").first()
  ).toBeVisible();

  assertNoErrors(errors, testInfo);
});

test("about page renders the portrait with no runtime errors", async ({
  page,
}, testInfo) => {
  // Highest client-risk change: next/image static import + framer-motion on a
  // route the other specs never load. A build cannot catch a crash here.
  const errors = trackPageErrors(page);
  await page.goto("/about");

  await expect(
    page.getByRole("heading", { name: "Aghoghomena Akasukpe" })
  ).toBeVisible();

  const portrait = page.getByAltText("Aghoghomena Akasukpe").first();
  await expect(portrait).toBeVisible();
  // next/image actually decoded the imported asset (not a broken image).
  await expect
    .poll(() => portrait.evaluate((img: HTMLImageElement) => img.naturalWidth))
    .toBeGreaterThan(0);

  assertNoErrors(errors, testInfo);
});
