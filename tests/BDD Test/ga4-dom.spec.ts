import { test, expect } from '@playwright/test';

test.describe('Google Analytics DOM Presence - Blog Home', () => {
  test('GA4 script is present in the DOM on blog home page', async ({ page }) => {
    await page.goto('https://blog.silverandfit.com', { waitUntil: 'domcontentloaded' });

    // Accept cookies or close popups if present (optional)
    const acceptCookies = page.locator('button', { hasText: /accept|agree|close/i });
    if (await acceptCookies.first().isVisible().catch(() => false)) {
      await acceptCookies.first().click();
    }

    // Check for GA4 script tag in the DOM
    const ga4Script = page.locator('script[src*="googletagmanager.com/gtag"], script[src*="google-analytics.com"]');
    await expect(ga4Script).toHaveCount(1);
  });
});
