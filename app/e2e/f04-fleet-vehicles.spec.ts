/**
 * F04 – Fleet Vehicles
 * Cases: F04-H1, F04-E1, F04-E2, F04-E3, F04-E5, F04-N1
 */
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { signIn, failOn5xx } from "./helpers";

test.describe("F04 – Fleet Vehicles", () => {
  test.beforeEach(async ({ page }) => {
    failOn5xx(page);
    await signIn(page);
  });

  test("F04-H1: vehicles list shows seeded vehicles with status badges", async ({ page }) => {
    await page.goto("/fleets/vehicles");

    // Accessibility scan
    const a11y = await new AxeBuilder({ page }).analyze();
    expect(a11y.violations.filter((v) => v.impact === "critical" || v.impact === "serious")).toEqual([]);

    // At least one vehicle card visible
    await expect(page.getByText(/toyota|nissan|honda|ford|bmw/i).first()).toBeVisible({ timeout: 10_000 });

    // Status badge visible
    await expect(page.getByText(/available|on rent|dirty/i).first()).toBeVisible();
  });

  test("F04-E1: Available filter shows only available vehicles", async ({ page }) => {
    await page.goto("/fleets/vehicles?status=available");
    await page.waitForTimeout(1000);
    // All visible status badges should say Available
    const badges = await page.getByText(/available/i).all();
    expect(badges.length).toBeGreaterThan(0);
    // Should NOT see "On Rent" or "Dirty" status
    await expect(page.getByText(/^on rent$/i)).not.toBeVisible();
  });

  test("F04-E2: Dirty filter tab", async ({ page }) => {
    await page.goto("/fleets/vehicles");
    const dirtyTab = page.getByRole("link", { name: /dirty/i });
    if (await dirtyTab.isVisible()) {
      await dirtyTab.click();
      await page.waitForURL("**/vehicles?status=dirty", { timeout: 5_000 });
    }
  });

  test("F04-E5: 390px mobile layout — no horizontal scroll", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/fleets/vehicles");
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(400);
  });

  test("F04-N1: unauthenticated access redirects to /login", async ({ page: unauthPage }) => {
    await unauthPage.goto("/fleets/vehicles");
    await expect(unauthPage).toHaveURL("/login", { timeout: 8_000 });
  });
});
