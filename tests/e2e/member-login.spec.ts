import { test, expect } from '@playwright/test';

test.describe('Member Login Journey', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate from homepage to login page', async ({ page }) => {
    // Click on LOGIN link in header
    await page.getByRole('link', { name: 'LOGIN' }).click();
    
    // Verify we're on the login page
    await expect(page).toHaveURL(/.*identity\/login/);
    await expect(page.getByRole('heading', { name: 'Member Login' })).toBeVisible();
  });

  test('login page should display all required elements', async ({ page }) => {
    await page.goto('/identity/login');
    
    // Verify login form fields
    await expect(page.getByLabel('Username')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    
    // Verify LOG IN button
    await expect(page.getByRole('button', { name: 'LOG IN' })).toBeVisible();
    
    // Verify forgot credentials links (Username and Password are separate links)
    await expect(page.locator('main').getByRole('link', { name: 'Username' })).toBeVisible();
    await expect(page.locator('main').getByRole('link', { name: 'Password' })).toBeVisible();
    
    // Verify registration link
    await expect(page.getByRole('link', { name: 'Click here' })).toBeVisible();
  });

  test('should navigate to Forgot Username page', async ({ page }) => {
    await page.goto('/identity/login');
    
    // Click Username link in "Forgot your Username or Password?"
    await page.locator('main').getByRole('link', { name: 'Username' }).click();
    
    // Verify we're on the forgot username page
    await expect(page).toHaveURL(/.*identity\/forgotUsername/i);
  });

  test('Forgot Username page should display all required fields', async ({ page }) => {
    await page.goto('/identity/forgotUsername');
    
    // Verify all fields are present
    await expect(page.getByLabel('First Name')).toBeVisible();
    await expect(page.getByLabel('Last Name')).toBeVisible();
    await expect(page.getByText('Date of birth')).toBeVisible();
    await expect(page.getByLabel('Zip Code')).toBeVisible();
    
    // Verify action buttons
    await expect(page.getByRole('button', { name: 'SEND USERNAME' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'CANCEL' })).toBeVisible();
  });

  test('Forgot Username cancel should return to login page', async ({ page }) => {
    await page.goto('/identity/forgotUsername');
    
    // Wait for page to load
    await expect(page.getByRole('heading', { name: /Forgot Your Username/i })).toBeVisible();
    
    // Click CANCEL button
    await page.getByRole('button', { name: 'CANCEL' }).click();
    
    // Wait for navigation - may go to login or home page depending on state
    await page.waitForURL(/.*identity\/login|.*silverandfit\.com\/?$/, { timeout: 10000 });
    
    // Should be on login page or home page (behavior may vary)
    const url = page.url();
    expect(url.includes('identity/login') || url.endsWith('silverandfit.com/')).toBeTruthy();
  });

  test('should navigate to Forgot Password page', async ({ page }) => {
    await page.goto('/identity/login');
    
    // Click Password link in "Forgot your Username or Password?"
    await page.locator('main').getByRole('link', { name: 'Password' }).click();
    
    // Verify we're on the forgot password page
    await expect(page).toHaveURL(/.*identity\/forgotPassword/i);
  });

  test('login page should allow entering credentials', async ({ page }) => {
    await page.goto('/identity/login');
    
    // Fill in login form
    await page.getByLabel('Username').fill('testuser');
    await page.getByLabel('Password').fill('testpassword');
    
    // Verify fields retain values
    await expect(page.getByLabel('Username')).toHaveValue('testuser');
    await expect(page.getByLabel('Password')).toHaveValue('testpassword');
  });

  test('login page should have link to registration for new users', async ({ page }) => {
    await page.goto('/identity/login');
    
    // Find and click registration link
    const registerLink = page.getByRole('link', { name: 'Click here' });
    await expect(registerLink).toBeVisible();
    await registerLink.click();
    
    // Should navigate to registration page
    await expect(page).toHaveURL(/.*identity\/registration/);
  });

  test('should return to homepage via logo from login page', async ({ page }) => {
    await page.goto('/identity/login');
    
    // Click Silver&Fit logo
    await page.getByRole('link', { name: /Silver&Fit/i }).first().click();
    
    // Should return to homepage
    await expect(page).toHaveURL(/.*silverandfit\.com\/?$/);
  });
});
