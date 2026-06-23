import { test, expect } from '@playwright/test';

test.describe('BitGold E2E Auth & Intro Flow', () => {
  test('should always show the disclaimer intro page first', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    
    // Check for the disclaimer page text or button
    await expect(page.getByText('Fintech Simulator')).toBeVisible();
    await expect(page.getByRole('button', { name: /Acknowledge & Proceed/i })).toBeVisible();
  });

  test('should show login/demo options after acknowledging disclaimer', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    
    // Acknowledge disclaimer
    await page.getByRole('button', { name: /Acknowledge & Proceed/i }).click();

    // Verify SignInPage (Login / Demo) appears
    await expect(page.getByRole('button', { name: /Instant Demo Account/i })).toBeVisible();
  });
});
