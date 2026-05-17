import { test, expect } from "@playwright/test";
import { trackPageErrors, assertNoErrors } from "./helpers";

test("home page loads with no runtime errors", async ({ page }, testInfo) => {
  const errors = trackPageErrors(page);
  await page.goto("/");
  await expect(page.getByAltText("Logo").first()).toBeVisible();
  assertNoErrors(errors, testInfo);
});

test("resume opens in a full-screen viewer and renders a PDF page", async ({
  page,
}, testInfo) => {
  const errors = trackPageErrors(page);
  await page.goto("/");

  // Desktop header "Resume" button (visible at the default desktop viewport).
  await page.getByRole("button", { name: "Resume" }).first().click();

  const dialog = page.getByRole("dialog", { name: "Resume preview" });
  await expect(dialog).toBeVisible();

  // react-pdf rasterises each page to a <canvas>. If the pdf.js chunk fails
  // to evaluate (the bug this test exists for), no canvas ever appears and a
  // `pageerror` is recorded.
  const canvas = dialog.locator("canvas").first();
  await expect(canvas).toBeVisible({ timeout: 30_000 });

  const box = await canvas.boundingBox();
  expect(box?.width ?? 0).toBeGreaterThan(100);
  expect(box?.height ?? 0).toBeGreaterThan(100);

  assertNoErrors(errors, testInfo);
});
