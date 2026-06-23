import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('BitGold Accessibility Checks', () => {
  test('intro page should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    
    // Check for a11y violations
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('auth selection page should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    
    // Go to Auth selection
    await page.getByRole('button', { name: /Acknowledge & Proceed/i }).click();
    
    // Ensure it loaded
    await expect(page.getByRole('button', { name: /Instant Demo Account/i })).toBeVisible();

    // Check for a11y violations
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
