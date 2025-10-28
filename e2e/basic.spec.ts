import { test, expect } from '@playwright/test';

test.describe('Versuni Frontline PWA', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/');
    
    // Should redirect to /home
    await expect(page).toHaveURL(/\/home/);
    
    // Check for main heading
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
  });

  test('should navigate between pages', async ({ page }) => {
    await page.goto('/home');
    
    // Navigate to chat
    await page.getByRole('link', { name: /agents/i }).first().click();
    await expect(page).toHaveURL(/\/chat/);
    
    // Navigate to scenarios
    await page.getByRole('link', { name: /scenarios/i }).first().click();
    await expect(page).toHaveURL(/\/scenarios/);
  });

  test('should have PWA manifest', async ({ page }) => {
    await page.goto('/');
    
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toHaveAttribute('href', '/manifest.webmanifest');
  });

  test('should be responsive', async ({ page }) => {
    // Test desktop
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/home');
    await expect(page.getByText('Versuni Frontline')).toBeVisible();
    
    // Test mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByText('Versuni')).toBeVisible();
  });
});
