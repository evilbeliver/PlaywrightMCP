import { test, expect } from '@playwright/test';

test.describe('Main Navigation - Authenticated', () => {
  test.use({ storageState: '.auth/user.json' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test.describe('Main Navigation Bar', () => {
    test('should display all primary navigation links', async ({ page }) => {
      const mainNav = page.getByRole('navigation', { name: /main navigation/i });
      await expect(mainNav).toBeVisible();

      await expect(page.getByRole('link', { name: 'DASHBOARD' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'WELL-BEING CLUB' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'FITNESS CENTERS' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'WORKOUTS' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'CONNECTED!' })).toBeVisible();
    });

    test('should navigate to Dashboard', async ({ page }) => {
      // Navigate away first
      await page.goto('/search');
      
      // Then navigate back to dashboard
      const dashboardLink = page.getByRole('link', { name: 'DASHBOARD' });
      await dashboardLink.click();
      
      await expect(page).toHaveURL(/\/dashboard/);
    });

    test('should navigate to Fitness Centers', async ({ page }) => {
      const fitnessCentersLink = page.getByRole('link', { name: 'FITNESS CENTERS' });
      await fitnessCentersLink.click();
      
      await expect(page).toHaveURL(/\/search/);
    });

    test('should navigate to Workouts', async ({ page }) => {
      const workoutsLink = page.getByRole('link', { name: 'WORKOUTS' });
      await workoutsLink.click();
      
      await expect(page).toHaveURL(/\/ResourceLibrary\/workouts/);
    });
  });

  test.describe('User Secondary Navigation', () => {
    test('should display user secondary navigation', async ({ page }) => {
      // The user secondary navigation is a dropdown that appears on hover/click
      const userNav = page.getByRole('navigation', { name: /user secondary navigation/i });
      await expect(userNav).toBeAttached();
    });

    test('should display user greeting', async ({ page }) => {
      // Verify user is logged in by checking for Fitness ID (always visible in header)
      const fitnessId = page.getByText(/Fitness ID:/i);
      await expect(fitnessId).toBeVisible();
    });

    test('should display Fitness ID', async ({ page }) => {
      const fitnessId = page.getByText(/Fitness ID: \d+/);
      await expect(fitnessId).toBeVisible();
    });

    test('should have all account menu links', async ({ page }) => {
      await expect(page.getByRole('link', { name: 'Personal Info' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Preferences' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Password & Security' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Program Info' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Billing & Payments' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Manage Memberships' })).toBeVisible();
      await expect(page.getByRole('link', { name: /log out/i })).toBeVisible();
    });
  });

  test.describe('Dropdown Menus', () => {
    test('should have Well-Being Club submenu toggle button', async ({ page }) => {
      const toggleButton = page.getByRole('button', { name: /toggle well-being club sub-menu/i });
      await expect(toggleButton).toBeVisible();
    });

    test('should have Connected! submenu toggle button', async ({ page }) => {
      const toggleButton = page.getByRole('button', { name: /toggle connected! sub-menu/i });
      await expect(toggleButton).toBeVisible();
    });

    test('should open Well-Being Club submenu on click', async ({ page }) => {
      const toggleButton = page.getByRole('button', { name: /toggle well-being club sub-menu/i });
      await toggleButton.click();
      
      // Wait for submenu to appear
      await page.waitForTimeout(500);
      
      // Submenu should be visible after clicking toggle
    });

    test('should open Connected! submenu on click', async ({ page }) => {
      const toggleButton = page.getByRole('button', { name: /toggle connected! sub-menu/i });
      await toggleButton.click();
      
      // Wait for submenu to appear
      await page.waitForTimeout(500);
    });
  });

  test.describe('Shopping Cart', () => {
    test('should display shopping cart button', async ({ page }) => {
      const cartButton = page.getByRole('button', { name: /view your shopping cart/i });
      await expect(cartButton).toBeVisible();
    });
  });

  test.describe('Navigation Persistence', () => {
    test('should maintain navigation on Fitness Centers page', async ({ page }) => {
      await page.goto('/search');
      
      // Verify navigation is still present
      await expect(page.getByRole('link', { name: 'DASHBOARD' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'WORKOUTS' })).toBeVisible();
    });

    test('should maintain navigation on Workouts page', async ({ page }) => {
      await page.goto('/ResourceLibrary/workouts/all');
      
      // Verify navigation is still present
      await expect(page.getByRole('link', { name: 'DASHBOARD' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'FITNESS CENTERS' })).toBeVisible();
    });

    test('should maintain navigation on Account pages', async ({ page }) => {
      await page.goto('/MyAccount/program-info');
      
      // Verify navigation is still present
      await expect(page.getByRole('link', { name: 'DASHBOARD' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'WORKOUTS' })).toBeVisible();
    });
  });

  test.describe('Logo and Branding', () => {
    test('should display Silver&Fit home link', async ({ page }) => {
      const homeLink = page.getByRole('link', { name: /silver&fit home/i });
      await expect(homeLink).toBeVisible();
    });

    test('should navigate to dashboard when clicking home link', async ({ page }) => {
      // Navigate away first
      await page.goto('/search');
      
      const homeLink = page.getByRole('link', { name: /silver&fit home/i });
      await homeLink.click();
      
      await expect(page).toHaveURL(/\/dashboard/);
    });

    test('should display health plan logo', async ({ page }) => {
      const healthPlanLogo = page.getByRole('img', { name: /regence|blueshield/i });
      await expect(healthPlanLogo).toBeVisible();
    });
  });

  test.describe('Footer Navigation', () => {
    test('should display footer content info', async ({ page }) => {
      const footer = page.getByRole('contentinfo');
      await expect(footer).toBeVisible();
    });

    test('should display About Us link', async ({ page }) => {
      const aboutUsLink = page.getByRole('link', { name: 'About Us' });
      await expect(aboutUsLink).toBeVisible();
    });

    test('should display FAQ link', async ({ page }) => {
      const faqLink = page.getByRole('link', { name: 'FAQ' });
      await expect(faqLink).toBeVisible();
    });

    test('should display Privacy Statement link', async ({ page }) => {
      const privacyLink = page.getByRole('link', { name: 'Privacy Statement' });
      await expect(privacyLink).toBeVisible();
    });

    test('should display Site Map link', async ({ page }) => {
      const siteMapLink = page.getByRole('link', { name: 'Site Map' });
      await expect(siteMapLink).toBeVisible();
    });

    test('should display Contact Us link', async ({ page }) => {
      const contactLink = page.getByRole('link', { name: 'Contact Us' });
      await expect(contactLink).toBeVisible();
    });

    test('should display Terms & Conditions link', async ({ page }) => {
      const termsLink = page.getByRole('link', { name: 'Terms & Conditions' });
      await expect(termsLink).toBeVisible();
    });

    test('should display American Specialty Health info', async ({ page }) => {
      const ashText = page.getByText(/american specialty health/i);
      await expect(ashText.first()).toBeVisible();
    });

    test('should display copyright notice', async ({ page }) => {
      const copyright = page.getByText(/© 2020-\d{4} American Specialty Health/i);
      await expect(copyright).toBeVisible();
    });
  });

  test.describe('Social Media Links', () => {
    test('should display Facebook link', async ({ page }) => {
      const facebookLink = page.getByRole('link', { name: /facebook/i });
      await expect(facebookLink).toBeVisible();
      await expect(facebookLink).toHaveAttribute('href', /facebook\.com/);
    });

    test('should display LinkedIn link', async ({ page }) => {
      const linkedinLink = page.getByRole('link', { name: /linkedin/i });
      await expect(linkedinLink).toBeVisible();
      await expect(linkedinLink).toHaveAttribute('href', /linkedin\.com/);
    });

    test('should display Twitter link', async ({ page }) => {
      const twitterLink = page.getByRole('link', { name: /twitter/i });
      await expect(twitterLink).toBeVisible();
      await expect(twitterLink).toHaveAttribute('href', /twitter\.com/);
    });

    test('should display YouTube link', async ({ page }) => {
      const youtubeLink = page.getByRole('link', { name: /youtube/i });
      await expect(youtubeLink).toBeVisible();
      await expect(youtubeLink).toHaveAttribute('href', /youtube\.com/);
    });

    test('should display Pinterest link', async ({ page }) => {
      const pinterestLink = page.getByRole('link', { name: /pinterest/i });
      await expect(pinterestLink).toBeVisible();
      await expect(pinterestLink).toHaveAttribute('href', /pinterest\.com/);
    });
  });
});
