import { Page, expect } from "@playwright/test";

export const TEST_EMAIL = process.env.E2E_EMAIL ?? "admin@rentacarllc.example";
export const TEST_PASSWORD = process.env.E2E_PASSWORD ?? "Admin1234!";
export const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:3000";

/** Sign in and assert we reach the dashboard. */
export async function signIn(page: Page) {
  await page.goto("/login");
  await page.getByLabel(/email/i).fill(TEST_EMAIL);
  await page.getByLabel(/password/i).fill(TEST_PASSWORD);
  await page.getByRole("button", { name: /sign in|log in/i }).click();
  await expect(page).toHaveURL("/", { timeout: 10_000 });
}

/** Fail the test if any console error fires. */
export function failOnConsoleError(page: Page) {
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      // Ignore known benign errors
      const text = msg.text();
      if (text.includes("favicon") || text.includes("404") || text.includes("hydration")) return;
      throw new Error(`Console error: ${text}`);
    }
  });
}

/** Fail if any 5xx response is received. */
export function failOn5xx(page: Page) {
  page.on("response", (resp) => {
    if (resp.status() >= 500) {
      throw new Error(`5xx response: ${resp.status()} ${resp.url()}`);
    }
  });
}
