import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Acquitrack/);

  // Expect the main heading to be visible
  await expect(page.locator('h1')).toBeVisible();
});
