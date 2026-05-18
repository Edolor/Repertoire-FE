import { test, expect } from "@playwright/test";
import { trackPageErrors, assertNoErrors } from "./helpers";

// The hero terminal is client-only and routes into sections. A build never
// evaluates it; only a real browser does.
test("hero terminal runs a canned command and routes into a section", async ({
  page,
}, testInfo) => {
  const errors = trackPageErrors(page);
  await page.goto("/");

  const input = page.getByLabel("Terminal command input");
  await expect(input).toBeVisible({ timeout: 30_000 });
  await input.fill("ls work/");
  await input.press("Enter");

  // Routes to #selected-work; that section heading must come into view.
  await expect(
    page.getByRole("heading", {
      name: "What I have actually built and broken",
    }),
  ).toBeVisible();

  assertNoErrors(errors, testInfo);
});

// Command palette (cmdk) is mounted globally and opened by ⌘/Ctrl-K.
test("command palette opens with the keyboard and navigates", async ({
  page,
}, testInfo) => {
  const errors = trackPageErrors(page);
  await page.goto("/");

  // Warm the route before the keyboard interaction (dev cold-compile).
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible({
    timeout: 30_000,
  });
  await page.keyboard.press("ControlOrMeta+k");
  const search = page.getByPlaceholder("Jump to anything…");
  await expect(search).toBeVisible();

  await search.fill("writing");
  await page.getByRole("option", { name: /Writing/i }).first().click();
  await expect(page).toHaveURL(/\/writing$/);

  assertNoErrors(errors, testInfo);
});

// The home About details (large backend-driven section) is behind a
// popup. Assert the popup mechanism, not backend content (no network dep).
test("home About details open in a popup", async ({ page }, testInfo) => {
  const errors = trackPageErrors(page);
  await page.goto("/#about");

  const trigger = page.getByRole("button", {
    name: /View experience, education/i,
  });
  await expect(trigger).toBeVisible({ timeout: 30_000 });
  await trigger.click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByText("Experience, education & certifications"),
  ).toBeVisible();
  await expect(
    dialog.getByRole("link", { name: /open the full About page/i }),
  ).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();

  assertNoErrors(errors, testInfo);
});

// The "watch an agent work" explorable: stepping must not crash.
test("agent explorable steps without runtime errors", async ({
  page,
}, testInfo) => {
  const errors = trackPageErrors(page);
  await page.goto("/#agent-demo");

  const next = page.getByRole("button", { name: "next →" });
  await expect(next).toBeVisible({ timeout: 30_000 });
  await next.click();
  await next.click();
  await expect(page.getByText("now:")).toBeVisible();

  assertNoErrors(errors, testInfo);
});
