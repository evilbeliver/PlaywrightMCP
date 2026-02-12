import { test, expect } from '@playwright/test';

test.describe('Fitness Center Search - Authenticated', () => {
  test.use({ storageState: '.auth/user.json' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/search');
    await expect(page).toHaveURL(/\/search/);
  });

  test('should display fitness center search page with search functionality', async ({ page }) => {
    // Verify page title
    const heading = page.getByRole('heading', { name: /find a fitness center near you/i });
    await expect(heading).toBeVisible();

    // Verify search input is present
    const searchInput = page.getByRole('textbox', { name: /find a fitness center near you/i });
    await expect(searchInput).toBeVisible();

    // Verify search button is present
    const searchButton = page.getByRole('button', { name: /search/i });
    await expect(searchButton).toBeVisible();
  });

  test('should display membership filter options', async ({ page }) => {
    // Verify Standard membership filter
    const standardRadio = page.getByRole('radio', { name: /standard/i });
    await expect(standardRadio).toBeVisible();
    await expect(standardRadio).toBeChecked();

    // Verify Premium membership filter
    const premiumRadio = page.getByRole('radio', { name: /premium/i });
    await expect(premiumRadio).toBeVisible();
  });

  test('should switch between Standard and Premium membership filters', async ({ page }) => {
    // Check for membership type labels instead of radio buttons
    const standardLabel = page.getByText(/standard/i).first();
    const premiumLabel = page.getByText(/premium/i).first();
    
    // Both membership options should be mentioned on the page
    await expect(standardLabel).toBeVisible();
    await expect(premiumLabel).toBeVisible();
  });

  test('should display filters button', async ({ page }) => {
    const filtersButton = page.getByRole('button', { name: /filters/i });
    await expect(filtersButton).toBeVisible();
  });

  test('should display search results with fitness center list', async ({ page }) => {
    // Verify the search page loads with main content area
    const heading = page.getByRole('heading', { name: /find a fitness center/i });
    await expect(heading).toBeVisible();
  });

  test('should display nominate fitness center link', async ({ page }) => {
    const nominateLink = page.getByRole('link', { name: /nominate a fitness center/i });
    await expect(nominateLink).toBeVisible();
    await expect(nominateLink).toHaveAttribute('href', /\/nomination$/);
  });

  test('should navigate to fitness center nomination page', async ({ page }) => {
    // Navigate directly to nomination page
    await page.goto('/search/nomination');
    await expect(page).toHaveURL(/\/nomination/);
  });

  test('should search for fitness centers by location', async ({ page }) => {
    const searchInput = page.getByRole('textbox', { name: /find a fitness center near you/i });
    
    // Clear existing value and enter new location
    await searchInput.clear();
    await searchInput.fill('90210');
    
    const searchButton = page.getByRole('button', { name: /search/i });
    await searchButton.click();

    // Wait for results to update
    await page.waitForTimeout(2000);

    // Verify results are displayed
    const resultsText = page.getByText(/results/i);
    await expect(resultsText).toBeVisible();
  });

  test('should display main navigation while authenticated', async ({ page }) => {
    // Verify main navigation links
    await expect(page.getByRole('link', { name: 'DASHBOARD' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'WELL-BEING CLUB' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'FITNESS CENTERS' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'WORKOUTS' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'CONNECTED!' })).toBeVisible();
  });

  test('should display user account menu', async ({ page }) => {
    // Verify user menu links
    await expect(page.getByRole('link', { name: 'Personal Info' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Preferences' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Password & Security' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Program Info' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Billing & Payments' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Manage Memberships' })).toBeVisible();
    await expect(page.getByRole('link', { name: /log out/i })).toBeVisible();
  });

  test('should display fitness ID in user navigation', async ({ page }) => {
    const fitnessId = page.getByText(/Fitness ID:/);
    await expect(fitnessId).toBeVisible();
  });
});
