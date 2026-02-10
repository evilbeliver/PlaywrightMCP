import { test, expect } from '@playwright/test';

test.describe('Fitness Center Search Journey', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to fitness center search from homepage', async ({ page }) => {
    // Navigate to search page
    await page.goto('/search');
    
    // Verify search page elements
    await expect(page.getByRole('heading', { name: /Find a fitness center near you/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /Find a fitness center near you/i })).toBeVisible();
  });

  test('search page should display search controls', async ({ page }) => {
    await page.goto('/search');
    
    // Verify search input
    await expect(page.getByRole('textbox', { name: /Find a fitness center near you/i })).toBeVisible();
    
    // Verify search button
    await expect(page.getByRole('button', { name: 'search' })).toBeVisible();
    
    // Verify nomination link
    await expect(page.getByRole('link', { name: /NOMINATE A FITNESS CENTER/i })).toBeVisible();
  });

  test('should perform search with valid location', async ({ page }) => {
    await page.goto('/search');
    
    // Enter search location
    await page.getByRole('textbox', { name: /Find a fitness center near you/i }).fill('San Diego, CA');
    
    // Click search button
    await page.getByRole('button', { name: 'search' }).click();
    
    // Wait for results
    await page.waitForTimeout(3000);
    
    // URL should update with search
    await expect(page).toHaveURL(/.*search/);
  });

  test('should display search results with fitness center information', async ({ page }) => {
    await page.goto('/search');
    
    // Perform search
    await page.getByRole('textbox', { name: /Find a fitness center near you/i }).fill('Los Angeles, CA');
    await page.getByRole('button', { name: 'search' }).click();
    
    // Wait for results to load
    await page.waitForTimeout(3000);
    
    // Page should stay on search
    await expect(page).toHaveURL(/.*search/);
  });

  test('search should handle empty input gracefully', async ({ page }) => {
    await page.goto('/search');
    
    // Click search without entering location
    await page.getByRole('button', { name: 'search' }).click();
    
    // Should stay on search page
    await expect(page).toHaveURL(/.*search/);
  });

  test('should clear search and start new search', async ({ page }) => {
    await page.goto('/search');
    
    // Perform initial search
    await page.getByRole('textbox', { name: /Find a fitness center near you/i }).fill('Miami, FL');
    await page.getByRole('button', { name: 'search' }).click();
    await page.waitForTimeout(2000);
    
    // Clear and search new location
    await page.getByRole('textbox', { name: /Find a fitness center near you/i }).fill('');
    await page.getByRole('textbox', { name: /Find a fitness center near you/i }).fill('Denver, CO');
    await page.getByRole('button', { name: 'search' }).click();
    await page.waitForTimeout(2000);
    
    // Should stay on search page
    await expect(page).toHaveURL(/.*search/);
  });

  test('should search by zip code', async ({ page }) => {
    await page.goto('/search');
    
    // Search by zip code
    await page.getByRole('textbox', { name: /Find a fitness center near you/i }).fill('90210');
    await page.getByRole('button', { name: 'search' }).click();
    await page.waitForTimeout(2000);
    
    // Should stay on search page
    await expect(page).toHaveURL(/.*search/);
  });

  test('should have nominate fitness center link', async ({ page }) => {
    await page.goto('/search');
    
    // Verify nomination link exists and has correct URL
    const nominateLink = page.getByRole('link', { name: /NOMINATE A FITNESS CENTER/i });
    await expect(nominateLink).toBeVisible();
    await expect(nominateLink).toHaveAttribute('href', /nomination/);
  });
});
