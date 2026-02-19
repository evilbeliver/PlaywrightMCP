import { test, expect } from '@playwright/test';

test.describe('Google Analytics DOM Presence - Active&Fit Direct Search', () => {
  test('GA4 script is present in the DOM on search page', async ({ page }) => {
    await page.goto('https://www.activeandfitdirect.com/search', { waitUntil: 'domcontentloaded' });

    // Accept cookies or close popups if present (optional)
    const acceptCookies = page.locator('button', { hasText: /accept|agree|close/i });
    if (await acceptCookies.first().isVisible().catch(() => false)) {
      await acceptCookies.first().click();
    }

    // Check for GA4 script tag in the DOM
    const ga4Script = page.locator('script[src*="googletagmanager.com/gtag"], script[src*="google-analytics.com"]');
    const count = await ga4Script.count();
    expect(count).toBeGreaterThan(0);

    // Log all GA script src URLs found
    const srcs = [];
    for (let i = 0; i < count; i++) {
      srcs.push(await ga4Script.nth(i).getAttribute('src'));
    }
    console.log('GA script tags found:', srcs);
  });
});
