import { test, expect } from '@playwright/test';

test.describe('Full User Journey - Homepage to Information Discovery', () => {
  
  test('Complete journey: Homepage → About Us → FAQ → Contact Us', async ({ page }) => {
    // Start at homepage
    await page.goto('/');
    await expect(page.getByText('Empowering You in Living Boldly')).toBeVisible();
    
    // Navigate to About Us via footer
    await page.getByRole('contentinfo').getByRole('link', { name: 'About Us' }).click();
    await expect(page).toHaveURL(/.*About/i);
    await expect(page.getByRole('heading', { name: 'About Us' })).toBeVisible();
    
    // Navigate to FAQ via footer
    await page.getByRole('contentinfo').getByRole('link', { name: 'FAQ' }).click();
    await expect(page).toHaveURL(/.*faq/i);
    await expect(page.getByRole('heading', { name: 'Frequently Asked Questions' })).toBeVisible();
    
    // Navigate to Contact Us via footer
    await page.getByRole('contentinfo').getByRole('link', { name: 'Contact Us' }).click();
    await expect(page).toHaveURL(/.*contactus/i);
    await expect(page.getByRole('heading', { name: 'Contact Us' })).toBeVisible();
    
    // Return to homepage via logo
    await page.getByRole('link', { name: /Silver&Fit/i }).first().click();
    await expect(page).toHaveURL(/.*silverandfit\.com\/?$/);
  });

  test('Complete journey: New user exploring eligibility options', async ({ page }) => {
    // Start at homepage
    await page.goto('/');
    
    // User clicks CHECK ELIGIBILITY
    await page.getByRole('link', { name: 'CHECK ELIGIBILITY' }).first().click();
    await expect(page).toHaveURL(/.*identity\/registration/);
    
    // User decides to check FAQ first via footer
    await page.getByRole('contentinfo').getByRole('link', { name: 'FAQ' }).click();
    await expect(page).toHaveURL(/.*faq/i);
    
    // User expands program description FAQ
    const programFaq = page.getByRole('button', { name: /What is included in the Silver&Fit/i });
    await programFaq.click();
    await expect(page.getByText(/The Silver&Fit program provides/i)).toBeVisible();
    
    // User satisfied, goes back to registration
    await page.goto('/identity/registration');
    await expect(page.getByRole('heading', { name: 'Create an Account' })).toBeVisible();
  });

  test('Complete journey: User searching for fitness centers', async ({ page }) => {
    // Start at homepage
    await page.goto('/');
    
    // Navigate to search page
    await page.goto('/search');
    await expect(page.getByRole('heading', { name: /Find a fitness center near you/i })).toBeVisible();
    
    // Search for location
    await page.getByRole('textbox', { name: /Find a fitness center near you/i }).fill('San Diego, CA');
    await page.getByRole('button', { name: 'search' }).click();
    await page.waitForTimeout(2000);
    
    // Page should stay on search
    await expect(page).toHaveURL(/.*search/);
    
    // User decides to check eligibility
    await page.goto('/identity/registration');
    await expect(page.getByRole('heading', { name: 'Create an Account' })).toBeVisible();
  });

  test('Complete journey: Existing member login flow', async ({ page }) => {
    // Start at homepage
    await page.goto('/');
    
    // Click LOGIN
    await page.getByRole('link', { name: 'LOGIN' }).click();
    await expect(page).toHaveURL(/.*identity\/login/);
    
    // User forgot username - click Username link
    await page.locator('main').getByRole('link', { name: 'Username' }).click();
    await expect(page).toHaveURL(/.*identity\/forgotUsername/i);
    
    // User cancels and returns to login
    await page.getByRole('button', { name: 'CANCEL' }).click();
    await expect(page).toHaveURL(/.*identity\/login/);
    
    // User enters credentials (but doesn't submit - just testing form)
    await page.getByLabel('Username').fill('testuser');
    await page.getByLabel('Password').fill('testpass');
    
    // Verify form is filled
    await expect(page.getByLabel('Username')).toHaveValue('testuser');
    await expect(page.getByLabel('Password')).toHaveValue('testpass');
  });

  test('Complete journey: Contact inquiry flow', async ({ page }) => {
    // Start at homepage
    await page.goto('/');
    
    // Navigate to Contact Us
    await page.getByRole('link', { name: 'Contact Us' }).click();
    await expect(page).toHaveURL(/.*contactus/i);
    
    // Fill out contact form
    await page.getByLabel('First Name').fill('Jane');
    await page.getByLabel('Last Name').fill('Smith');
    await page.getByLabel('Email').fill('jane.smith@example.com');
    await page.getByLabel('Phone Number').fill('555-987-6543');
    await page.getByLabel('Message').fill('I would like more information about the Silver&Fit program in my area.');
    
    // Verify form is filled (don't submit to avoid actual server request)
    await expect(page.getByLabel('First Name')).toHaveValue('Jane');
    await expect(page.getByLabel('Email')).toHaveValue('jane.smith@example.com');
    await expect(page.getByLabel('Message')).toHaveValue('I would like more information about the Silver&Fit program in my area.');
  });

  test('Complete journey: Mobile navigation flow', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Start at homepage
    await page.goto('/');
    await expect(page.getByText('Empowering You in Living Boldly')).toBeVisible();
    
    // Navigate to login
    await page.getByRole('link', { name: 'LOGIN' }).click();
    await expect(page).toHaveURL(/.*identity\/login/);
    
    // Navigate to FAQ via footer
    await page.getByRole('contentinfo').getByRole('link', { name: 'FAQ' }).click();
    await expect(page).toHaveURL(/.*faq/i);
    
    // Verify FAQ is responsive
    await expect(page.getByRole('heading', { name: 'Frequently Asked Questions' })).toBeVisible();
    
    // Navigate to Contact Us via footer
    await page.getByRole('contentinfo').getByRole('link', { name: 'Contact Us' }).click();
    await expect(page).toHaveURL(/.*contactus/i);
    
    // Verify contact form is usable on mobile
    await expect(page.getByLabel('First Name')).toBeVisible();
    await expect(page.getByRole('button', { name: 'SUBMIT' })).toBeVisible();
  });

  test('Complete journey: Error recovery - 404 and back', async ({ page }) => {
    // Start at homepage
    await page.goto('/');
    
    // Navigate to a non-existent page
    await page.goto('/this-page-does-not-exist');
    
    // Verify 404 page
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
    
    // Use provided link to go back home
    await page.getByRole('link', { name: 'BACK TO HOME' }).click();
    await expect(page).toHaveURL(/.*silverandfit\.com\/?$/);
    await expect(page.getByText('Empowering You in Living Boldly')).toBeVisible();
  });

  test('Complete journey: Footer navigation to key pages', async ({ page }) => {
    // Go to homepage first
    await page.goto('/');
    
    // Test About Us navigation
    await page.getByRole('contentinfo').getByRole('link', { name: 'About Us' }).click();
    await expect(page).toHaveURL(/About/i);
    
    // Go back and test FAQ navigation
    await page.goto('/');
    await page.getByRole('contentinfo').getByRole('link', { name: 'FAQ' }).click();
    await expect(page).toHaveURL(/faq/i);
    
    // Go back and test Contact Us navigation  
    await page.goto('/');
    await page.getByRole('contentinfo').getByRole('link', { name: 'Contact Us' }).click();
    await expect(page).toHaveURL(/contactus/i);
    
    // Go back and test Privacy Statement navigation
    await page.goto('/');
    await page.getByRole('contentinfo').getByRole('link', { name: 'Privacy Statement' }).click();
    await expect(page).toHaveURL(/privacy/i);
    
    // Go back and test Terms & Conditions navigation
    await page.goto('/');
    await page.getByRole('contentinfo').getByRole('link', { name: 'Terms & Conditions' }).click();
    await expect(page).toHaveURL(/TermsAndConditions/i);
  });
});
