import { test, expect } from '@playwright/test';

/**
 * Silver&Fit Homepage Navigation Tests
 * 
 * Tests for the main navigation menu, header links, and navigation functionality
 * on the Silver&Fit homepage.
 */
test.describe('Homepage Navigation', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Header Navigation Links', () => {
    
    test('should display the Silver&Fit logo that links to homepage', async ({ page }) => {
      const logo = page.getByRole('link', { name: 'Silver&Fit' }).first();
      await expect(logo).toBeVisible();
      await expect(logo).toHaveAttribute('href', '/');
    });

    test('should display LOGIN link with correct href', async ({ page }) => {
      const loginLink = page.getByRole('link', { name: 'LOGIN' });
      await expect(loginLink).toBeVisible();
      await expect(loginLink).toHaveAttribute('href', /\/identity\/login/);
    });

    test('should display CHECK ELIGIBILITY link with correct href', async ({ page }) => {
      const checkEligibilityLink = page.getByRole('link', { name: 'CHECK ELIGIBILITY' });
      await expect(checkEligibilityLink).toBeVisible();
      await expect(checkEligibilityLink).toHaveAttribute('href', /\/identity\/registration/);
    });
  });

  test.describe('Main Navigation Menu', () => {
    
    test('should display HOMEPAGE navigation link', async ({ page }) => {
      const homepageLink = page.getByRole('navigation').getByRole('link', { name: 'HOMEPAGE' });
      await expect(homepageLink).toBeVisible();
      await expect(homepageLink).toHaveAttribute('href', '/');
    });

    test('should display WELL-BEING CLUB navigation link', async ({ page }) => {
      const wellBeingLink = page.getByRole('navigation').getByRole('link', { name: 'WELL-BEING CLUB' });
      await expect(wellBeingLink).toBeVisible();
      await expect(wellBeingLink).toHaveAttribute('href', /\/well-being-club/);
    });

    test('should display FITNESS CENTERS navigation link', async ({ page }) => {
      const fitnessCentersLink = page.getByRole('navigation').getByRole('link', { name: 'FITNESS CENTERS' });
      await expect(fitnessCentersLink).toBeVisible();
      await expect(fitnessCentersLink).toHaveAttribute('href', /\/search/);
    });

    test('should display FIT AT HOME dropdown button', async ({ page }) => {
      const fitAtHomeButton = page.getByRole('button', { name: 'FIT AT HOME' });
      await expect(fitAtHomeButton).toBeVisible();
    });

    test('should open FIT AT HOME dropdown menu with correct options', async ({ page }) => {
      const fitAtHomeButton = page.getByRole('button', { name: 'FIT AT HOME' });
      await fitAtHomeButton.click();
      
      // Verify dropdown menu appears with correct items
      const menu = page.getByRole('menu', { name: 'FIT AT HOME' });
      await expect(menu).toBeVisible();
      
      await expect(page.getByRole('menuitem', { name: 'Workouts' })).toBeVisible();
      await expect(page.getByRole('menuitem', { name: 'Home Kits' })).toBeVisible();
    });

    test('should display PARTICIPATING HEALTH PLANS navigation link', async ({ page }) => {
      const healthPlansLink = page.getByRole('navigation').getByRole('link', { name: 'PARTICIPATING HEALTH PLANS' });
      await expect(healthPlansLink).toBeVisible();
      await expect(healthPlansLink).toHaveAttribute('href', /\/health-plans/);
    });

    test('should display HOW IT WORKS navigation link', async ({ page }) => {
      const howItWorksLink = page.getByRole('navigation').getByRole('link', { name: 'HOW IT WORKS' });
      await expect(howItWorksLink).toBeVisible();
      await expect(howItWorksLink).toHaveAttribute('href', /\/how-it-works/);
    });

    test('should display FAQ navigation link', async ({ page }) => {
      const faqLink = page.getByRole('navigation').getByRole('link', { name: 'FAQ' });
      await expect(faqLink).toBeVisible();
      await expect(faqLink).toHaveAttribute('href', /\/faq/);
    });

    test('should display BLOG navigation link', async ({ page }) => {
      const blogLink = page.getByRole('navigation').getByRole('link', { name: 'BLOG' });
      await expect(blogLink).toBeVisible();
      await expect(blogLink).toHaveAttribute('href', /blog\.silverandfit\.com/);
    });
  });

  test.describe('Navigation Link Functionality', () => {
    
    test('should navigate to Well-Being Club page', async ({ page }) => {
      await page.getByRole('navigation').getByRole('link', { name: 'WELL-BEING CLUB' }).click();
      await expect(page).toHaveURL(/\/well-being-club/);
    });

    test('should navigate to Fitness Centers search page', async ({ page }) => {
      await page.getByRole('navigation').getByRole('link', { name: 'FITNESS CENTERS' }).click();
      await expect(page).toHaveURL(/\/search/);
    });

    test('should navigate to Participating Health Plans page', async ({ page }) => {
      await page.getByRole('navigation').getByRole('link', { name: 'PARTICIPATING HEALTH PLANS' }).click();
      await expect(page).toHaveURL(/\/health-plans/);
    });

    test('should navigate to How It Works page', async ({ page }) => {
      await page.getByRole('navigation').getByRole('link', { name: 'HOW IT WORKS' }).click();
      await expect(page).toHaveURL(/\/how-it-works/);
    });

    test('should navigate to FAQ page', async ({ page }) => {
      await page.getByRole('navigation').getByRole('link', { name: 'FAQ' }).click();
      await expect(page).toHaveURL(/\/faq/);
    });

    test('should navigate to Login page', async ({ page }) => {
      await page.getByRole('link', { name: 'LOGIN' }).click();
      await expect(page).toHaveURL(/\/identity\/login/);
    });

    test('should navigate to Registration/Eligibility page', async ({ page }) => {
      await page.getByRole('link', { name: 'CHECK ELIGIBILITY' }).click();
      await expect(page).toHaveURL(/\/identity\/registration/);
    });
  });

  test.describe('Skip to Main Content Link', () => {
    
    test('should have skip to main content link for accessibility', async ({ page }) => {
      const skipLink = page.getByRole('link', { name: 'Skip to Main Content' });
      await expect(skipLink).toBeAttached();
    });
  });
});
