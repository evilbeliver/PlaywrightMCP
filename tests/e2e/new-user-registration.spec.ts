import { test, expect } from '@playwright/test';

test.describe('New User Registration Journey', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate from homepage to registration via CHECK ELIGIBILITY button', async ({ page }) => {
    // Click on CHECK ELIGIBILITY button (hero section)
    await page.getByRole('link', { name: 'CHECK ELIGIBILITY' }).first().click();
    
    // Verify we're on the registration page
    await expect(page).toHaveURL(/.*identity\/registration/);
    await expect(page.getByRole('heading', { name: 'Create an Account' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Step 1 of 2' })).toBeVisible();
  });

  test('registration page should display all required fields in Step 1', async ({ page }) => {
    await page.goto('/identity/registration');
    
    // Verify all Step 1 fields are present
    await expect(page.getByLabel('First Name')).toBeVisible();
    await expect(page.getByLabel('Last Name')).toBeVisible();
    await expect(page.getByLabel('Suffix (optional)')).toBeVisible();
    await expect(page.getByText('Date of birth')).toBeVisible();
    await expect(page.getByLabel('Zip Code')).toBeVisible();
    await expect(page.getByLabel('Phone Number (optional)')).toBeVisible();
    
    // Verify terms checkbox
    await expect(page.getByText('I have read and agree to the')).toBeVisible();
    
    // Verify NEXT button
    await expect(page.getByRole('button', { name: 'NEXT' })).toBeVisible();
  });

  test('registration should validate required fields', async ({ page }) => {
    await page.goto('/identity/registration');
    
    // Try to proceed without filling required fields
    await page.getByRole('button', { name: 'NEXT' }).click();
    
    // Should show validation errors (stay on same page)
    await expect(page).toHaveURL(/.*identity\/registration/);
  });

  test('registration should allow filling in personal information', async ({ page }) => {
    await page.goto('/identity/registration');
    
    // Fill in registration form fields
    await page.getByLabel('First Name').fill('Test');
    await page.getByLabel('Last Name').fill('User');
    await page.getByLabel('Zip Code').fill('90210');
    
    // Verify fields retain their values
    await expect(page.getByLabel('First Name')).toHaveValue('Test');
    await expect(page.getByLabel('Last Name')).toHaveValue('User');
    await expect(page.getByLabel('Zip Code')).toHaveValue('90210');
  });

  test('registration page should have link to login for existing members', async ({ page }) => {
    await page.goto('/identity/registration');
    
    // Should have a link to login page
    await expect(page.getByRole('link', { name: 'LOGIN' })).toBeVisible();
  });

  test('registration page should display privacy notice', async ({ page }) => {
    await page.goto('/identity/registration');
    
    // Check for terms and conditions link
    await expect(page.getByText('Terms and Conditions')).toBeVisible();
  });

  test('should navigate back to homepage from registration via logo', async ({ page }) => {
    await page.goto('/identity/registration');
    
    // Click on Silver&Fit logo
    await page.getByRole('link', { name: /Silver&Fit/i }).first().click();
    
    // Should return to homepage
    await expect(page).toHaveURL(/.*silverandfit\.com\/?$/);
  });
});
