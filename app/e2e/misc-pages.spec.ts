/**
 * Smoke tests for remaining pages: reservations list, quotes, attempts,
 * external charges, maintenance, repair orders, fines, toll tags, reports,
 * audits, trash.
 */
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { signIn, failOn5xx } from "./helpers";

const PAGES = [
  { path: "/car-rental/reservations", name: "Reservations list" },
  { path: "/car-rental/reservation-attempts", name: "Reservation Attempts" },
  { path: "/car-rental/quotes", name: "Quotes" },
  { path: "/car-rental/external-charges", name: "External Charges" },
  { path: "/fleets/maintenance", name: "Maintenance" },
  { path: "/fleets/repair-orders", name: "Repair Orders" },
  { path: "/sheets/1/items", name: "Fines" },
  { path: "/sheets/2/items", name: "Toll Tags" },
  { path: "/reports", name: "Reports" },
  { path: "/audits", name: "Audit Logs" },
  { path: "/trash", name: "Trash" },
];

test.describe("Smoke tests – all pages load without 5xx", () => {
  test.beforeEach(async ({ page }) => {
    failOn5xx(page);
    await signIn(page);
  });

  for (const pg of PAGES) {
    test(`${pg.name} (${pg.path}) loads and has content`, async ({ page }) => {
      await page.goto(pg.path);
      await page.waitForTimeout(1500);

      // Not redirected to login
      expect(page.url()).not.toContain("/login");

      // Page renders some content
      const body = await page.textContent("body");
      expect(body?.length).toBeGreaterThan(50);

      // Critical axe violations
      const a11y = await new AxeBuilder({ page }).analyze();
      const criticalViolations = a11y.violations.filter((v) => v.impact === "critical");
      if (criticalViolations.length > 0) {
        console.warn(`${pg.name} a11y critical:`, criticalViolations.map((v) => v.id));
      }
      expect(criticalViolations).toEqual([]);
    });
  }
});

test.describe("Unauthenticated redirects", () => {
  for (const pg of PAGES.slice(0, 4)) {
    test(`${pg.path} → /login when not signed in`, async ({ page }) => {
      await page.goto(pg.path);
      await expect(page).toHaveURL("/login", { timeout: 8_000 });
    });
  }
});
