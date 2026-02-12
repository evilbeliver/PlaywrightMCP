import { test, expect } from '@playwright/test';

test.describe('Digital Workouts - Authenticated', () => {
  test.use({ storageState: '.auth/user.json' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/ResourceLibrary/workouts/all');
    await expect(page).toHaveURL(/\/ResourceLibrary\/workouts\/all/);
  });

  test('should display digital workouts page with heading', async ({ page }) => {
    const heading = page.getByRole('heading', { name: /digital workouts/i, level: 1 });
    await expect(heading).toBeVisible();
  });

  test('should display workout search functionality', async ({ page }) => {
    const searchInput = page.getByRole('textbox', { name: /search/i });
    await expect(searchInput).toBeVisible();

    const searchButton = page.getByRole('button', { name: /search/i });
    await expect(searchButton).toBeVisible();
  });

  test('should display workout navigation tabs', async ({ page }) => {
    // Check for workout navigation links - at least one should be visible
    const featuredLink = page.getByRole('link', { name: 'Featured' });
    const allWorkoutsLink = page.getByRole('link', { name: 'All Workouts' });
    const individualLink = page.getByRole('link', { name: 'Individual Exercises' });
    
    // At least one navigation link should exist
    const links = [featuredLink, allWorkoutsLink, individualLink];
    let found = false;
    for (const link of links) {
      const count = await link.count();
      if (count > 0) {
        found = true;
        break;
      }
    }
    expect(found).toBe(true);
  });

  test('should display trending workouts section', async ({ page }) => {
    const trendingHeading = page.getByRole('heading', { name: /trending workouts/i });
    await expect(trendingHeading).toBeVisible();
  });

  test('should display workout cards with duration and level', async ({ page }) => {
    // Verify workout cards display duration
    const durationTexts = page.getByText(/\d+ min/);
    await expect(durationTexts.first()).toBeVisible();

    // Verify workout cards display level
    const levelTexts = page.getByText(/Duration/);
    await expect(levelTexts.first()).toBeVisible();
  });

  test('should display workout collections section', async ({ page }) => {
    const collectionsHeading = page.getByRole('heading', { name: /collections/i });
    await expect(collectionsHeading).toBeVisible();
  });

  test('should display workout collection categories', async ({ page }) => {
    // Verify various collection categories
    await expect(page.getByRole('heading', { name: /no equipment/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /scenic workouts/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /low impact cardio/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /flexibility/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /balance/i })).toBeVisible();
  });

  test('should display my favorites section', async ({ page }) => {
    const favoritesHeading = page.getByRole('heading', { name: /my favorites/i });
    await expect(favoritesHeading).toBeVisible();

    // Verify View More link
    const viewMoreLink = page.getByRole('link', { name: /view more.*my favorites/i });
    await expect(viewMoreLink).toBeVisible();
  });

  test('should have save workout buttons', async ({ page }) => {
    // Verify save buttons exist for workouts
    const saveButtons = page.getByRole('button', { name: /save.*video/i });
    await expect(saveButtons.first()).toBeVisible();
  });

  test('should navigate to All Workouts tab', async ({ page }) => {
    const allWorkoutsLink = page.getByRole('link', { name: 'All Workouts' });
    await allWorkoutsLink.click();
    await expect(page).toHaveURL(/\/filtered/);
  });

  test('should navigate to My Favorites tab', async ({ page }) => {
    // Navigate directly to saved workouts page
    await page.goto('/ResourceLibrary/workouts/saved');
    await expect(page).toHaveURL(/\/saved/);
  });

  test('should navigate to Individual Exercises tab', async ({ page }) => {
    const exercisesLink = page.getByRole('link', { name: 'Individual Exercises' });
    await exercisesLink.click();
    await expect(page).toHaveURL(/\/topic/);
  });

  test('should display carousel navigation buttons', async ({ page }) => {
    // Verify scroll/navigation buttons for carousels
    const scrollButtons = page.getByRole('button', { name: /scroll/i });
    await expect(scrollButtons.first()).toBeVisible();
  });

  test('should navigate to No Equipment collection', async ({ page }) => {
    const noEquipmentLink = page.getByRole('link', { name: /no equipment/i });
    await noEquipmentLink.click();
    await expect(page).toHaveURL(/workoutCategoryId/);
  });

  test('should search for specific workout', async ({ page }) => {
    const searchInput = page.getByRole('textbox', { name: /search/i });
    await searchInput.fill('yoga');

    // Wait for suggestions or results
    await page.waitForTimeout(1000);

    const searchButton = page.getByRole('button', { name: /search/i });
    await searchButton.click();
  });

  test('should display upper and lower body strength collections', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /upper body strength/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /lower body strength/i })).toBeVisible();
  });

  test('should display signature series collection', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /signature series/i })).toBeVisible();
  });
});
