import { test, expect } from "@playwright/test";
import { trackPageErrors, assertNoErrors } from "./helpers";

// The contact form is client-only (React Hook Form + Zod). We exercise
// validation and the ungated fallback path, NOT a real backend submit (the
// API is rate-limited 10/day/IP and is out of scope for a smoke run).
test("contact form validates and exposes the ungated mailto fallback", async ({
  page,
}, testInfo) => {
  const errors = trackPageErrors(page);
  await page.goto("/#contact");

  await expect(
    page.getByRole("heading", { name: "Let's talk" }),
  ).toBeVisible({ timeout: 30_000 });

  // Submitting empty triggers client-side Zod errors, not a network call.
  await page.getByRole("button", { name: "Send" }).click();
  await expect(page.getByText("Tell me who you are")).toBeVisible();

  // Hiring / peer path must be reachable without the form.
  const mailto = page
    .locator('a[href^="mailto:"]')
    .first();
  await expect(mailto).toBeVisible();

  assertNoErrors(errors, testInfo);
});
