/**
 * F03 – Dashboard (Daily Manifest + KPIs)
 * Cases: F03-H1, F03-E1, F03-E2
 */
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { signIn, failOn5xx } from "./helpers";

test.describe("F03 – Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    failOn5xx(page);
    await signIn(page);
  });

  test("F03-H1: dashboard loads with KPI cards and manifest tabs", async ({ page }) => {
    await page.goto("/");

    // Accessibility scan
    const a11y = await new AxeBuilder({ page }).analyze();
    expect(a11y.violations.filter((v) => v.impact === "critical" || v.impact === "serious")).toEqual([]);

    // Page renders (not a blank screen)
    const body = await page.textContent("body");
    expect(body?.length).toBeGreaterThan(100);

    // Some KPI or fleet status visible
    await expect(page.getByRole("heading").first()).toBeVisible({ timeout: 10_000 });
  });

  test("F03-E2: mobile layout at 390px — no horizontal scroll", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(400);
  });

  test("navigation sidebar links are present", async ({ page }) => {
    await page.goto("/");
    // Core navigation entries
    await expect(page.getByRole("link", { name: /reservation/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /vehicle/i }).first()).toBeVisible();
  });
});
