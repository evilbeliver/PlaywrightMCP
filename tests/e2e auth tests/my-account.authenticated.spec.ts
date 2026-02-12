import { test, expect } from '@playwright/test';

test.describe('My Account Pages - Authenticated', () => {
  test.use({ storageState: '.auth/user.json' });

  test.describe('Program Info Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/MyAccount/program-info');
    });

    test('should display program info page', async ({ page }) => {
      const heading = page.getByRole('heading', { name: /program info/i });
      await expect(heading).toBeVisible();
    });

    test('should display My Account heading', async ({ page }) => {
      const accountHeading = page.getByRole('heading', { name: /my account/i });
      await expect(accountHeading).toBeVisible();
    });

    test('should display secondary navigation tabs', async ({ page }) => {
      // Use exact name match to avoid matching user dropdown navigation
      const secondaryNav = page.getByRole('navigation', { name: 'Secondary', exact: true });
      await expect(secondaryNav).toBeVisible();

      await expect(secondaryNav.getByRole('link', { name: 'Personal Info' })).toBeVisible();
      await expect(secondaryNav.getByRole('link', { name: 'Preferences' })).toBeVisible();
      await expect(secondaryNav.getByRole('link', { name: 'Password & Security' })).toBeVisible();
      await expect(secondaryNav.getByRole('link', { name: 'Program Info' })).toBeVisible();
      await expect(secondaryNav.getByRole('link', { name: 'Billing & Payments' })).toBeVisible();
      await expect(secondaryNav.getByRole('link', { name: 'Manage Memberships' })).toBeVisible();
    });

    test('should display program flier download link', async ({ page }) => {
      const flierLink = page.getByRole('link', { name: /program flier/i });
      await expect(flierLink).toBeVisible();
      await expect(flierLink).toHaveAttribute('href', /previewmymaterial/);
    });

    test('should display Adobe Reader information', async ({ page }) => {
      const adobeText = page.getByText(/adobe reader/i);
      await expect(adobeText).toBeVisible();

      const adobeLink = page.getByRole('link', { name: /adobe reader/i });
      await expect(adobeLink).toHaveAttribute('href', /get\.adobe\.com\/reader/);
    });
  });

  test.describe('Navigation Between Account Pages', () => {
    test('should load personal info page from dashboard', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Navigate directly to Personal Info page
      await page.goto('/MyAccount/personal-info');
      await expect(page).toHaveURL(/\/MyAccount\/personal-info/);
      await expect(page.getByRole('heading', { name: /personal info/i })).toBeVisible();
    });

    test('should load preferences page from dashboard', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Navigate directly to Preferences page
      await page.goto('/MyAccount/preferences');
      await expect(page).toHaveURL(/\/MyAccount\/preferences/);
      await expect(page.getByRole('heading', { name: /preferences/i })).toBeVisible();
    });

    test('should load password & security page from dashboard', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Navigate directly to Password & Security page
      await page.goto('/MyAccount/identity/password-and-settings');
      await expect(page).toHaveURL(/\/MyAccount\/identity\/password-and-settings/);
      await expect(page.getByRole('heading', { name: /password.*security/i })).toBeVisible();
    });

    test('should load program info page from dashboard', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Navigate directly to Program Info page
      await page.goto('/MyAccount/program-info');
      await expect(page).toHaveURL(/\/MyAccount\/program-info/);
      await expect(page.getByRole('heading', { name: /program info/i })).toBeVisible();
    });

    test('should load billing & payments page from dashboard', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Navigate directly to Billing & Payments page
      await page.goto('/MyAccount/billing');
      await expect(page).toHaveURL(/\/MyAccount\/billing/);
      await expect(page.getByRole('heading', { name: /billing.*payments/i })).toBeVisible();
    });

    test('should load manage memberships page from dashboard', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Navigate directly to Manage Memberships page
      await page.goto('/MyAccount/manage-memberships');
      await expect(page).toHaveURL(/\/MyAccount\/manage-memberships/);
      await expect(page.getByRole('heading', { name: /manage memberships/i })).toBeVisible();
    });
  });

  test.describe('User Information Display', () => {
    test('should display user info in navigation', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Verify user is logged in by checking for Fitness ID
      const fitnessId = page.getByText(/Fitness ID:/i);
      await expect(fitnessId).toBeVisible();
    });

    test('should display Fitness ID', async ({ page }) => {
      await page.goto('/dashboard');
      
      const fitnessId = page.getByText(/Fitness ID: \d+/);
      await expect(fitnessId).toBeVisible();
    });

    test('should display logout option', async ({ page }) => {
      await page.goto('/dashboard');
      
      const logoutLink = page.getByRole('link', { name: /log out/i });
      await expect(logoutLink).toBeVisible();
      await expect(logoutLink).toHaveAttribute('href', /\/logout/);
    });
  });

  test.describe('Account Page URLs', () => {
    test('personal info page should load', async ({ page }) => {
      await page.goto('/MyAccount/personal-info');
      await expect(page).toHaveURL(/\/MyAccount\/personal-info/);
    });

    test('preferences page should load', async ({ page }) => {
      await page.goto('/MyAccount/preferences');
      await expect(page).toHaveURL(/\/MyAccount\/preferences/);
    });

    test('password & security page should load', async ({ page }) => {
      await page.goto('/MyAccount/identity/password-and-settings');
      await expect(page).toHaveURL(/\/MyAccount\/identity\/password-and-settings/);
    });

    test('billing & payments page should load', async ({ page }) => {
      await page.goto('/MyAccount/billing');
      await expect(page).toHaveURL(/\/MyAccount\/billing/);
    });

    test('manage memberships page should load', async ({ page }) => {
      await page.goto('/MyAccount/manage-memberships');
      await expect(page).toHaveURL(/\/MyAccount\/manage-memberships/);
    });
  });
});
