
import { test, expect } from '@playwright/test';

// Extend Window type for custom properties used in GA4 test
declare global {
  interface Window {
    __gaEvents?: any[];
    gtag?: (...args: any[]) => void;
    dataLayer?: { push: (...args: any[]) => void } & any[];
  }
}

// BDD: Validate GA4 tags on search page
// Scenario: As a user, when I search for a new club, GA4 events are fired off

test.describe('GA4 Tag Validation - Blog Home', () => {
  test('Given I am a user, when I visit the blog home page, then GA4 tags are present and events are fired', async ({ page }) => {
    // Go to the blog home page
    await page.goto('https://blog.silverandfit.com', { waitUntil: 'domcontentloaded' });

    // Accept cookies or close popups if present (optional, adjust selector as needed)
    const acceptCookies = page.locator('button', { hasText: /accept|agree|close/i });
    if (await acceptCookies.first().isVisible().catch(() => false)) {
      await acceptCookies.first().click();
    }

    // Listen for GA4 network requests
    const gaRequests: any[] = [];
    page.on('request', request => {
      const url = request.url();
      if (/google-analytics\.com\/collect|google-analytics\.com\/g\/collect|google-analytics\.com\/measurement|googletagmanager\.com\/gtag/.test(url)) {
        gaRequests.push({ url, method: request.method(), postData: request.postData() });
      }
    });

    // Wait for possible analytics events
    await page.waitForTimeout(3000);

    // Check for GA4 script tags
    const ga4ScriptPresent = await page.evaluate(() => {
      return Array.from(document.scripts).some(script =>
        script.src.includes('googletagmanager.com/gtag') ||
        script.src.includes('google-analytics.com')
      );
    });

    // Log GA4 network requests
    console.log('GA4 Network Requests:', gaRequests);
    console.log('GA4 Script Present:', ga4ScriptPresent);

    // Assert that GA4 script is present
    expect(ga4ScriptPresent).toBeTruthy();
    // Assert that at least one GA4 request was fired
    expect(gaRequests.length).toBeGreaterThan(0);
  });
});
