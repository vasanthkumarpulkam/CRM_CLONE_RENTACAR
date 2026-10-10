/**
 * F18 – Authentication
 * Cases: F18-H1, F18-H2, F18-E1, F18-E2 (partial), F18-N1, F18-N2, F18-N3
 */
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { signIn, failOnConsoleError, failOn5xx, TEST_EMAIL, TEST_PASSWORD } from "./helpers";

test.describe("F18 – Authentication", () => {
  test("F18-H1: sign in with valid credentials reaches dashboard", async ({ page }) => {
    failOn5xx(page);
    await page.goto("/login");

    // Accessibility scan on login page
    const a11y = await new AxeBuilder({ page }).analyze();
    expect(a11y.violations.filter((v) => v.impact === "critical" || v.impact === "serious")).toEqual([]);

    await page.getByLabel(/email/i).fill(TEST_EMAIL);
    await page.getByLabel(/password/i).fill(TEST_PASSWORD);
    await page.getByRole("button", { name: /sign in|log in/i }).click();
    await expect(page).toHaveURL("/", { timeout: 10_000 });
    // Sidebar or nav should be visible
    await expect(page.getByRole("navigation")).toBeVisible();
  });

  test("F18-H2: logout clears session and redirects to /login", async ({ page }) => {
    failOn5xx(page);
    await signIn(page);
    // Find and click sign-out (button or link)
    const signOutBtn = page.getByRole("button", { name: /sign out|log out/i });
    if (await signOutBtn.isVisible()) {
      await signOutBtn.click();
    } else {
      // May be behind a menu
      await page.getByRole("button", { name: /account|user|menu/i }).first().click();
      await page.getByRole("menuitem", { name: /sign out|log out/i }).click();
    }
    await expect(page).toHaveURL("/login", { timeout: 8_000 });

    // Direct access to dashboard redirects to login
    await page.goto("/");
    await expect(page).toHaveURL("/login", { timeout: 8_000 });
  });

  test("F18-E1: already-authenticated user navigating to /login is redirected to /", async ({ page }) => {
    failOn5xx(page);
    await signIn(page);
    await page.goto("/login");
    await expect(page).toHaveURL("/", { timeout: 8_000 });
  });

  test("F18-N1: wrong password shows error, does not redirect", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill(TEST_EMAIL);
    await page.getByLabel(/password/i).fill("WrongPassword999!");
    await page.getByRole("button", { name: /sign in|log in/i }).click();
    // Should stay on /login
    await expect(page).toHaveURL("/login");
    // Should show some error text
    await expect(page.getByText(/invalid|incorrect|error/i)).toBeVisible({ timeout: 5_000 });
  });

  test("F18-N2: empty email shows validation", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/password/i).fill(TEST_PASSWORD);
    await page.getByRole("button", { name: /sign in|log in/i }).click();
    await expect(page).toHaveURL("/login");
  });

  test("F18-N3: unauthenticated access to / redirects to /login", async ({ page }) => {
    failOn5xx(page);
    await page.goto("/");
    await expect(page).toHaveURL("/login", { timeout: 8_000 });
  });
});
