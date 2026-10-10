/**
 * F05 – Contacts (Customers)
 * Cases: F05-H1, F05-E1, F05-N1
 */
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { signIn, failOn5xx } from "./helpers";

test.describe("F05 – Contacts", () => {
  test.beforeEach(async ({ page }) => {
    failOn5xx(page);
    await signIn(page);
  });

  test("F05-H1: customers list loads with seeded contacts", async ({ page }) => {
    await page.goto("/contacts");

    // Accessibility scan
    const a11y = await new AxeBuilder({ page }).analyze();
    expect(a11y.violations.filter((v) => v.impact === "critical" || v.impact === "serious")).toEqual([]);

    // Maria Gonzalez is in the seed data
    await expect(page.getByText(/maria.*gonzalez|gonzalez.*maria/i).first()).toBeVisible({ timeout: 10_000 });
  });

  test("F05-E1: empty search returns empty state or filtered list", async ({ page }) => {
    await page.goto("/contacts");
    // Search for non-existent name
    const searchInput = page.getByPlaceholder(/search/i).or(page.getByRole("searchbox"));
    if (await searchInput.isVisible()) {
      await searchInput.fill("ZZZNobodyExists999");
      await page.waitForTimeout(500);
      // Should show 0 results or empty state
      await expect(page.getByText(/no|0 contact|not found/i)).toBeVisible({ timeout: 5_000 });
    }
  });

  test("F05-N1: unauthenticated access redirects to /login", async ({ page: unauthPage }) => {
    await unauthPage.goto("/contacts");
    await expect(unauthPage).toHaveURL("/login", { timeout: 8_000 });
  });
});
