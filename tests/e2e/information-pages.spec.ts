import { test, expect } from '@playwright/test';

test.describe('Information Pages Journey', () => {
  
  test.describe('About Us Page', () => {
    test('should navigate to About Us page from footer', async ({ page }) => {
      await page.goto('/');
      
      // Click About Us link in footer (use contentinfo to target footer)
      await page.getByRole('contentinfo').getByRole('link', { name: 'About Us' }).click();
      
      // Verify we're on the About Us page
      await expect(page).toHaveURL(/.*About/i);
      await expect(page.getByRole('heading', { name: 'About Us' })).toBeVisible();
    });

    test('About Us page should display program information', async ({ page }) => {
      await page.goto('/About');
      
      // Verify key content sections
      await expect(page.getByRole('heading', { name: 'Fitness is Timeless' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Fitness Center Membership' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Home Fitness Kits' })).toBeVisible();
    });

    test('About Us page should have social media links', async ({ page }) => {
      await page.goto('/About');
      
      // Verify social media links in main content
      await expect(page.locator('main').getByRole('link', { name: 'Facebook' })).toBeVisible();
      await expect(page.locator('main').getByRole('link', { name: 'YouTube' })).toBeVisible();
      await expect(page.locator('main').getByRole('link', { name: 'Pinterest' })).toBeVisible();
      await expect(page.locator('main').getByRole('link', { name: 'Twitter' })).toBeVisible();
      await expect(page.locator('main').getByRole('link', { name: 'Instagram' })).toBeVisible();
    });

    test('About Us page should have link to health plans page', async ({ page }) => {
      await page.goto('/About');
      
      // Verify health plans link
      await expect(page.getByRole('link', { name: /See if your health plan/i })).toBeVisible();
    });
  });

  test.describe('FAQ Page', () => {
    test('should navigate to FAQ page from footer', async ({ page }) => {
      await page.goto('/');
      
      // Click FAQ link in footer (use contentinfo to target footer)
      await page.getByRole('contentinfo').getByRole('link', { name: 'FAQ' }).click();
      
      // Verify we're on the FAQ page
      await expect(page).toHaveURL(/.*faq/i);
      await expect(page.getByRole('heading', { name: 'Frequently Asked Questions' })).toBeVisible();
    });

    test('FAQ page should display accordion sections', async ({ page }) => {
      await page.goto('/faq');
      
      // Verify FAQ sections (use exact: true to avoid matching nested headings)
      await expect(page.getByRole('heading', { name: 'PROGRAM DESCRIPTION', exact: true })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'FITNESS CENTER MEMBERSHIP', exact: true })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'HOME FITNESS KITS', exact: true })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'WEBSITE FEATURES', exact: true })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'SECURE TWO-STEP SIGN-IN', exact: true })).toBeVisible();
    });

    test('FAQ accordions should expand on click', async ({ page }) => {
      await page.goto('/faq');
      
      // Wait for page to fully load
      await expect(page.getByRole('heading', { name: 'Frequently Asked Questions' })).toBeVisible();
      
      // Find and click the first FAQ item - may take time to render
      const firstFaqItem = page.getByRole('button', { name: /What is included in the Silver&Fit/i });
      await expect(firstFaqItem).toBeVisible({ timeout: 10000 });
      
      // Click to expand
      await firstFaqItem.click();
      
      // Content should be visible
      await expect(page.getByText(/The Silver&Fit program provides its members/i)).toBeVisible();
    });

    test('FAQ accordions should collapse when clicked again', async ({ page }) => {
      await page.goto('/faq');
      
      // Click first FAQ item to expand
      const firstFaqItem = page.getByRole('button', { name: /What is included in the Silver&Fit/i });
      await firstFaqItem.click();
      
      // Verify expanded
      await expect(page.getByText(/The Silver&Fit program provides its members/i)).toBeVisible();
      
      // Click again to collapse
      await firstFaqItem.click();
      
      // Content should be hidden
      await expect(page.getByText(/The Silver&Fit program provides its members/i)).not.toBeVisible();
    });

    test('FAQ page should display disclaimers', async ({ page }) => {
      await page.goto('/faq');
      
      // Wait for page to load
      await expect(page.getByRole('heading', { name: 'Frequently Asked Questions' })).toBeVisible();
      
      // Scroll to bottom to find disclaimers and verify it exists
      const disclaimers = page.getByRole('heading', { name: 'Disclaimers' });
      await disclaimers.scrollIntoViewIfNeeded();
      await expect(disclaimers).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Contact Us Page', () => {
    test('should navigate to Contact Us page from footer', async ({ page }) => {
      await page.goto('/');
      
      // Click Contact Us link in footer (use contentinfo to target footer)
      await page.getByRole('contentinfo').getByRole('link', { name: 'Contact Us' }).click();
      
      // Verify we're on the Contact Us page
      await expect(page).toHaveURL(/.*contactus/i);
      // Wait for heading to load with longer timeout
      await expect(page.getByRole('heading', { name: 'Contact Us' })).toBeVisible({ timeout: 10000 });
    });

    test('Contact Us page should display contact form', async ({ page }) => {
      await page.goto('/contactus');
      
      // Wait for page to load with longer timeout
      await expect(page.getByRole('heading', { name: 'Contact Us' })).toBeVisible({ timeout: 10000 });
      
      // Verify form fields
      await expect(page.getByRole('textbox', { name: 'First Name' })).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'Last Name' })).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'Phone Number' })).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'Message' })).toBeVisible();
      
      // Verify submit button
      await expect(page.getByRole('button', { name: 'SUBMIT' })).toBeVisible();
    });

    test('Contact Us page should display contact information', async ({ page }) => {
      await page.goto('/contactus');
      
      // Wait for page to load
      await expect(page.getByRole('heading', { name: 'Contact Us' })).toBeVisible({ timeout: 10000 });
      
      // Verify phone number
      await expect(page.getByRole('link', { name: /1-877-427-4788/i })).toBeVisible();
      
      // Verify email
      await expect(page.getByRole('link', { name: /FitnessService@ashn.com/i })).toBeVisible();
      
      // Verify business hours
      await expect(page.getByText('Monday - Friday')).toBeVisible();
    });

    test('Contact Us form should allow filling in information', async ({ page }) => {
      await page.goto('/contactus');
      
      // Fill in contact form
      await page.getByLabel('First Name').fill('John');
      await page.getByLabel('Last Name').fill('Doe');
      await page.getByLabel('Email').fill('john.doe@example.com');
      await page.getByLabel('Phone Number').fill('555-123-4567');
      await page.getByLabel('Message').fill('This is a test message.');
      
      // Verify fields retain values
      await expect(page.getByLabel('First Name')).toHaveValue('John');
      await expect(page.getByLabel('Last Name')).toHaveValue('Doe');
      await expect(page.getByLabel('Email')).toHaveValue('john.doe@example.com');
    });

    test('Contact Us form should show character count for message', async ({ page }) => {
      await page.goto('/contactus');
      
      // Wait for page to load
      await expect(page.getByRole('heading', { name: 'Contact Us' })).toBeVisible({ timeout: 10000 });
      
      // Verify message field and character counter exists
      await expect(page.getByRole('textbox', { name: 'Message' })).toBeVisible();
      await expect(page.getByText(/characters left/i)).toBeVisible();
    });
  });

  test.describe('Privacy Statement Page', () => {
    test('should navigate to Privacy Statement from footer', async ({ page }) => {
      await page.goto('/');
      
      // Click Privacy Statement link (use contentinfo to target footer)
      await page.getByRole('contentinfo').getByRole('link', { name: 'Privacy Statement' }).click();
      
      // Verify we're on the Privacy page
      await expect(page).toHaveURL(/.*privacy/i);
    });
  });

  test.describe('Terms & Conditions Page', () => {
    test('should navigate to Terms & Conditions from footer', async ({ page }) => {
      await page.goto('/');
      
      // Click Terms & Conditions link (use contentinfo to target footer)
      await page.getByRole('contentinfo').getByRole('link', { name: 'Terms & Conditions' }).click();
      
      // Verify we're on the Terms page
      await expect(page).toHaveURL(/.*TermsAndConditions/i);
    });
  });

  test.describe('Site Map Page', () => {
    test('should navigate to Site Map from footer', async ({ page }) => {
      await page.goto('/');
      
      // Click Site Map link (use contentinfo to target footer)
      await page.getByRole('contentinfo').getByRole('link', { name: 'Site Map' }).click();
      
      // Verify we're on the Sitemap page
      await expect(page).toHaveURL(/.*sitemap/i);
    });
  });

  test.describe('Page Not Found (404)', () => {
    test('should display 404 page for invalid URLs', async ({ page }) => {
      await page.goto('/invalid-page-that-does-not-exist');
      
      // Verify 404 page content
      await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
      await expect(page.getByText("We're sorry, the page you are looking for doesn't exist")).toBeVisible();
      
      // Verify back to home link
      await expect(page.getByRole('link', { name: 'BACK TO HOME' })).toBeVisible();
    });

    test('404 page should allow navigation back to homepage', async ({ page }) => {
      await page.goto('/invalid-page-url');
      
      // Click BACK TO HOME
      await page.getByRole('link', { name: 'BACK TO HOME' }).click();
      
      // Should be back on homepage
      await expect(page).toHaveURL(/.*silverandfit\.com\/?$/);
    });
  });
});
