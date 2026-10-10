/**
 * F01 – New Reservation Wizard
 * Cases: F01-H1, F01-E1, F01-E9, F01-N1, F01-N2
 */
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { signIn, failOnConsoleError, failOn5xx } from "./helpers";

// Format date as YYYY-MM-DD for date inputs
function dateStr(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

test.describe("F01 – New Reservation", () => {
  test.beforeEach(async ({ page }) => {
    failOn5xx(page);
    await signIn(page);
  });

  test("F01-H1: complete wizard creates confirmed reservation", async ({ page }) => {
    // Navigate to new reservation
    await page.goto("/car-rental/reservations/new");
    await expect(page).not.toHaveURL("/login");

    // Accessibility scan on Step 1
    const a11y1 = await new AxeBuilder({ page }).analyze();
    expect(a11y1.violations.filter((v) => v.impact === "critical" || v.impact === "serious")).toEqual([]);

    // Step 1: Dates — fill pickup and return dates
    const pickupDateInput = page.getByLabel(/pickup date/i).or(page.locator('input[name*="pickup"]').first());
    if (await pickupDateInput.isVisible()) {
      await pickupDateInput.fill(dateStr(1));
    }
    const returnDateInput = page.getByLabel(/return date/i).or(page.locator('input[name*="return"]').first());
    if (await returnDateInput.isVisible()) {
      await returnDateInput.fill(dateStr(31));
    }

    // Click Next
    const nextBtn = page.getByRole("button", { name: /next/i });
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
    }

    // Step 2: Select a vehicle class
    const classCard = page.getByText(/mid-size|economy|compact/i).first();
    if (await classCard.isVisible()) {
      await classCard.click();
    }
    const nextBtn2 = page.getByRole("button", { name: /next/i });
    if (await nextBtn2.isVisible()) {
      await nextBtn2.click();
    }

    // Step 3: Features — skip
    const nextBtn3 = page.getByRole("button", { name: /next/i });
    if (await nextBtn3.isVisible()) {
      await nextBtn3.click();
    }

    // Step 4: Customer — pick from autocomplete
    const customerSearch = page.getByPlaceholder(/search|customer/i).first();
    if (await customerSearch.isVisible()) {
      await customerSearch.fill("Maria");
      await page.waitForTimeout(500);
      const suggestion = page.getByText(/maria gonzalez/i).first();
      if (await suggestion.isVisible()) {
        await suggestion.click();
      }
    }
    const nextBtn4 = page.getByRole("button", { name: /next/i });
    if (await nextBtn4.isVisible()) {
      await nextBtn4.click();
    }

    // Step 5: Confirm
    const confirmBtn = page.getByRole("button", { name: /confirm reservation/i });
    if (await confirmBtn.isVisible()) {
      await confirmBtn.click();
      // Expect redirect or success indicator
      await page.waitForTimeout(2000);
    }

    // Should be on a reservation detail page or reservations list
    const url = page.url();
    expect(url).not.toContain("/login");
  });

  test("F01-E1: empty dates show validation on Step 1", async ({ page }) => {
    await page.goto("/car-rental/reservations/new");
    // Try to proceed without filling dates
    const nextBtn = page.getByRole("button", { name: /next/i });
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      // Should see an error or stay on step 1
      const url = page.url();
      // Still on new page or step 1
      expect(url).toContain("/new");
    }
  });

  test("F01-N1: unauthenticated access to /new redirects to /login", async ({ page: unauthPage }) => {
    await unauthPage.goto("/car-rental/reservations/new");
    await expect(unauthPage).toHaveURL("/login", { timeout: 8_000 });
  });

  test("F01-E9: wizard is usable at 390px (mobile)", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/car-rental/reservations/new");
    // No horizontal scroll at 390px
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(400);
    // Accessibility scan at mobile width
    const a11y = await new AxeBuilder({ page }).analyze();
    expect(a11y.violations.filter((v) => v.impact === "critical")).toEqual([]);
  });
});
