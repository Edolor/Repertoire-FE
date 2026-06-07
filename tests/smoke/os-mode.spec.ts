import { test, expect } from "@playwright/test";
import { trackPageErrors, assertNoErrors } from "./helpers";

// The "desktop OS" alternate skin is almost entirely client-only (provider,
// pointer-drag windows, localStorage persistence). A build never evaluates
// it; only a real browser does. Every case asserts NO console/page errors.

test("Header toggle opens the OS desktop", async ({ page }, testInfo) => {
  const errors = trackPageErrors(page);
  await page.goto("/");

  const toggle = page.getByRole("button", { name: "Switch to desktop mode" });
  await expect(toggle).toBeVisible({ timeout: 30_000 });
  await toggle.click();

  // Desktop icons are real buttons; `work/` must be present.
  await expect(
    page.getByRole("button", { name: "Open work/" }),
  ).toBeVisible();

  assertNoErrors(errors, testInfo);
});

test("opening the work app yields a dialog with the real section", async ({
  page,
}, testInfo) => {
  const errors = trackPageErrors(page);
  await page.goto("/");

  await page
    .getByRole("button", { name: "Switch to desktop mode" })
    .click({ timeout: 30_000 });
  await page.getByRole("button", { name: "Open work/" }).click();

  const dialog = page.getByRole("dialog", { name: /work\// });
  await expect(dialog).toBeVisible();
  // The window body renders the real shared WorkGrid (card headings present).
  await expect(dialog.getByRole("heading").first()).toBeVisible();

  assertNoErrors(errors, testInfo);
});

test("desktop-mode windows scroll with the wheel/gesture", async ({
  page,
}, testInfo) => {
  // Regression: enabling OS mode at runtime used to leave Lenis (smooth
  // scroll) alive, whose non-passive wheel listener swallowed gesture scroll
  // inside OS windows. Lenis must tear down when OS mode activates.
  const errors = trackPageErrors(page);
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");

  await page
    .getByRole("button", { name: "Switch to desktop mode" })
    .click({ timeout: 30_000 });
  await page.getByRole("button", { name: "Open work/" }).click();

  const dialog = page.getByRole("dialog", { name: /work\// });
  await expect(dialog).toBeVisible();

  const body = dialog.locator(".os-window-body");
  await expect(body).toBeVisible();

  // The window body must actually overflow, or the test proves nothing.
  const metrics = await body.evaluate((el) => ({
    sh: el.scrollHeight,
    ch: el.clientHeight,
  }));
  expect(metrics.sh).toBeGreaterThan(metrics.ch);

  // Wheel over the window body -> the body scrolls (not the locked page).
  const box = await body.boundingBox();
  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
  await page.mouse.wheel(0, 600);
  await expect
    .poll(async () => body.evaluate((el) => el.scrollTop))
    .toBeGreaterThan(20);

  // The underlying page never scrolls in OS mode.
  expect(await page.evaluate(() => window.scrollY)).toBe(0);

  assertNoErrors(errors, testInfo);
});

test("whoami.sh opens by default on entry", async ({ page }, testInfo) => {
  const errors = trackPageErrors(page);
  await page.goto("/");

  await page
    .getByRole("button", { name: "Switch to desktop mode" })
    .click({ timeout: 30_000 });

  // No icon click: the about window is opened for you.
  await expect(
    page.getByRole("dialog", { name: /whoami\.sh/ }),
  ).toBeVisible();

  assertNoErrors(errors, testInfo);
});

test("right-click opens a desktop context menu", async ({
  page,
}, testInfo) => {
  const errors = trackPageErrors(page);
  await page.goto("/");

  await page
    .getByRole("button", { name: "Switch to desktop mode" })
    .click({ timeout: 30_000 });

  // Bottom-left corner of the desktop: clear of windows and icons.
  await page
    .locator('[aria-label="Desktop"]')
    .click({ button: "right", position: { x: 6, y: 6 } });
  const menu = page.getByRole("menu", { name: "Desktop actions" });
  await expect(menu).toBeVisible();
  await expect(
    menu.getByRole("menuitem", { name: /Reset icon layout/ }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();

  assertNoErrors(errors, testInfo);
});

test("Escape closes the focused window", async ({ page }, testInfo) => {
  const errors = trackPageErrors(page);
  await page.goto("/");

  await page
    .getByRole("button", { name: "Switch to desktop mode" })
    .click({ timeout: 30_000 });
  await page.getByRole("button", { name: "Open work/" }).click();

  const dialog = page.getByRole("dialog", { name: /work\// });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();

  assertNoErrors(errors, testInfo);
});

test("Website mode returns to the normal scrolling site", async ({
  page,
}, testInfo) => {
  const errors = trackPageErrors(page);
  await page.goto("/");

  await page
    .getByRole("button", { name: "Switch to desktop mode" })
    .click({ timeout: 30_000 });
  await expect(
    page.getByRole("button", { name: "Open work/" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Website mode" }).click();

  // The normal hero (the only level-1 heading) is back.
  await expect(
    page.getByRole("heading", { level: 1 }),
  ).toBeVisible();
  await expect(page.getByText("Switched to website mode")).toBeVisible();

  assertNoErrors(errors, testInfo);
});

test("OS mode persists across a reload", async ({ page }, testInfo) => {
  const errors = trackPageErrors(page);
  await page.goto("/");

  await page
    .getByRole("button", { name: "Switch to desktop mode" })
    .click({ timeout: 30_000 });
  await expect(
    page.getByRole("button", { name: "Open work/" }),
  ).toBeVisible();

  await page.reload();

  // Restored straight into OS mode, no second click.
  await expect(
    page.getByRole("button", { name: "Open work/" }),
  ).toBeVisible({ timeout: 30_000 });

  assertNoErrors(errors, testInfo);
});

test("below 1024px the OS is unavailable even if persisted", async ({
  page,
}, testInfo) => {
  const errors = trackPageErrors(page);
  await page.setViewportSize({ width: 390, height: 800 });
  await page.addInitScript(() => {
    try {
      localStorage.setItem("os-mode", "os");
    } catch {
      /* ignore */
    }
  });
  await page.goto("/");

  // The normal site renders despite the persisted "os" preference.
  await expect(
    page.getByRole("heading", { level: 1 }),
  ).toBeVisible({ timeout: 30_000 });
  // The toggle is not offered on small screens.
  await expect(
    page.getByRole("button", { name: "Switch to desktop mode" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Open work/" }),
  ).toHaveCount(0);

  assertNoErrors(errors, testInfo);
});
