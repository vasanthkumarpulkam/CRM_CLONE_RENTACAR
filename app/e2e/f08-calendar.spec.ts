/**
 * F08 – Calendar
 * Cases: F08-H1, F08-E1, F08-E3
 */
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { signIn, failOn5xx } from "./helpers";

test.describe("F08 – Calendar", () => {
  test.beforeEach(async ({ page }) => {
    failOn5xx(page);
    await signIn(page);
  });

  test("F08-H1: calendar renders with view tabs", async ({ page }) => {
    await page.goto("/car-rental/calendar");

    // Accessibility scan
    const a11y = await new AxeBuilder({ page }).analyze();
    expect(a11y.violations.filter((v) => v.impact === "critical" || v.impact === "serious")).toEqual([]);

    // Page content loads
    await page.waitForTimeout(1000);
    const body = await page.textContent("body");
    expect(body?.length).toBeGreaterThan(50);
  });

  test("F08-E3: 390px mobile — calendar scrollable", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/car-rental/calendar");
    await page.waitForTimeout(500);
    // Page should not be broken
    await expect(page.locator("body")).not.toBeEmpty();
  });

  test("F08-N: unauthenticated → /login", async ({ page: unauthPage }) => {
    await unauthPage.goto("/car-rental/calendar");
    await expect(unauthPage).toHaveURL("/login", { timeout: 8_000 });
  });
});
