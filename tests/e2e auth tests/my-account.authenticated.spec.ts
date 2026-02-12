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
      const secondaryNav = page.getByRole('navigation', { name: /secondary/i });
      await expect(secondaryNav).toBeVisible();

      await expect(page.getByRole('link', { name: 'Personal Info' }).first()).toBeVisible();
      await expect(page.getByRole('link', { name: 'Preferences' }).first()).toBeVisible();
      await expect(page.getByRole('link', { name: 'Password & Security' }).first()).toBeVisible();
      await expect(page.getByRole('link', { name: 'Program Info' }).first()).toBeVisible();
      await expect(page.getByRole('link', { name: 'Billing & Payments' }).first()).toBeVisible();
      await expect(page.getByRole('link', { name: 'Manage Memberships' }).first()).toBeVisible();
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
    test('should navigate from dashboard to personal info', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Navigate to Personal Info via menu
      await page.getByRole('link', { name: 'Personal Info' }).click();
      await expect(page).toHaveURL(/\/MyAccount\/personal-info/);
    });

    test('should navigate from dashboard to preferences', async ({ page }) => {
      await page.goto('/dashboard');
      
      await page.getByRole('link', { name: 'Preferences' }).click();
      await expect(page).toHaveURL(/\/MyAccount\/preferences/);
    });

    test('should navigate from dashboard to password & security', async ({ page }) => {
      await page.goto('/dashboard');
      
      await page.getByRole('link', { name: 'Password & Security' }).click();
      await expect(page).toHaveURL(/\/MyAccount\/identity\/password-and-settings/);
    });

    test('should navigate from dashboard to program info', async ({ page }) => {
      await page.goto('/dashboard');
      
      await page.getByRole('link', { name: 'Program Info' }).click();
      await expect(page).toHaveURL(/\/MyAccount\/program-info/);
    });

    test('should navigate from dashboard to billing & payments', async ({ page }) => {
      await page.goto('/dashboard');
      
      await page.getByRole('link', { name: 'Billing & Payments' }).click();
      await expect(page).toHaveURL(/\/MyAccount\/billing/);
    });

    test('should navigate from dashboard to manage memberships', async ({ page }) => {
      await page.goto('/dashboard');
      
      await page.getByRole('link', { name: 'Manage Memberships' }).click();
      await expect(page).toHaveURL(/\/MyAccount\/manage-memberships/);
    });
  });

  test.describe('User Information Display', () => {
    test('should display username in navigation', async ({ page }) => {
      await page.goto('/dashboard');
      
      // The username "Test" should be displayed
      const username = page.getByText('Test', { exact: true });
      await expect(username).toBeVisible();
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
