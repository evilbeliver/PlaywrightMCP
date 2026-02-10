import { test, expect, devices } from '@playwright/test';

/**
 * Silver&Fit Homepage Responsive Design Tests
 * 
 * Tests for viewport sizes and responsive behavior across different devices.
 */
test.describe('Homepage Responsive Design', () => {

  test.describe('Desktop Viewport (1280x720)', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('should display full navigation menu on desktop', async ({ page }) => {
      await page.goto('/');
      
      // Desktop navigation should be visible
      const navigation = page.getByRole('navigation');
      await expect(navigation).toBeVisible();
      
      // All main nav links should be visible on desktop
      await expect(page.getByRole('navigation').getByRole('link', { name: 'HOMEPAGE' })).toBeVisible();
      await expect(page.getByRole('navigation').getByRole('link', { name: 'WELL-BEING CLUB' })).toBeVisible();
      await expect(page.getByRole('navigation').getByRole('link', { name: 'FITNESS CENTERS' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'FIT AT HOME' })).toBeVisible();
      await expect(page.getByRole('navigation').getByRole('link', { name: 'PARTICIPATING HEALTH PLANS' })).toBeVisible();
      await expect(page.getByRole('navigation').getByRole('link', { name: 'HOW IT WORKS' })).toBeVisible();
      await expect(page.getByRole('navigation').getByRole('link', { name: 'FAQ' })).toBeVisible();
      await expect(page.getByRole('navigation').getByRole('link', { name: 'BLOG' })).toBeVisible();
    });

    test('should display CHECK ELIGIBILITY header link on desktop', async ({ page }) => {
      await page.goto('/');
      
      const checkEligibilityLink = page.getByRole('banner').getByRole('link', { name: 'CHECK ELIGIBILITY' });
      await expect(checkEligibilityLink).toBeVisible();
    });

    test('should display main heading on desktop', async ({ page }) => {
      await page.goto('/');
      
      const mainHeading = page.getByRole('heading', { name: 'Empowering You in Living Boldly™', level: 1 });
      await expect(mainHeading).toBeVisible();
    });

    test('should display all section headings on desktop', async ({ page }) => {
      await page.goto('/');
      
      await expect(page.getByRole('heading', { name: 'Well-Being Club' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Find Your Fitness Center' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Get Fit at Home™', level: 1 })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Ready to Begin?' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'What Members Are Saying' })).toBeVisible();
    });
  });

  test.describe('Tablet Viewport (768x1024)', () => {
    test.use({ viewport: { width: 768, height: 1024 } });

    test('should render properly on tablet viewport', async ({ page }) => {
      await page.goto('/');
      
      // Main content should still be visible
      const mainHeading = page.getByRole('heading', { name: 'Empowering You in Living Boldly™', level: 1 });
      await expect(mainHeading).toBeVisible();
      
      // Logo should be visible
      const logo = page.getByRole('link', { name: 'Silver&Fit' }).first();
      await expect(logo).toBeVisible();
    });

    test('should display footer on tablet', async ({ page }) => {
      await page.goto('/');
      
      const footer = page.getByRole('contentinfo');
      await expect(footer).toBeVisible();
    });
  });

  test.describe('Mobile Viewport (375x667 - iPhone SE)', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('should display mobile menu button instead of full navigation', async ({ page }) => {
      await page.goto('/');
      
      // Mobile menu button should be visible
      const mobileMenuButton = page.getByRole('button', { name: 'Mobile menu' });
      await expect(mobileMenuButton).toBeVisible();
      
      // Desktop nav links should NOT be visible (replaced by hamburger menu)
      const desktopNav = page.getByRole('navigation').getByRole('link', { name: 'HOMEPAGE' });
      await expect(desktopNav).not.toBeVisible();
    });

    test('should open mobile menu when hamburger button is clicked', async ({ page }) => {
      await page.goto('/');
      
      // Click mobile menu button
      const mobileMenuButton = page.getByRole('button', { name: 'Mobile menu' });
      await mobileMenuButton.click();
      
      // Mobile navigation links should now be visible
      await expect(page.getByRole('navigation').getByRole('link', { name: 'Homepage' })).toBeVisible();
      await expect(page.getByRole('navigation').getByRole('link', { name: 'Well-Being Club' })).toBeVisible();
      await expect(page.getByRole('navigation').getByRole('link', { name: 'Fitness Centers' })).toBeVisible();
      await expect(page.getByRole('navigation').getByRole('button', { name: 'Fit at Home' })).toBeVisible();
      await expect(page.getByRole('navigation').getByRole('link', { name: 'Participating Health Plans' })).toBeVisible();
      await expect(page.getByRole('navigation').getByRole('link', { name: 'How it Works' })).toBeVisible();
      await expect(page.getByRole('navigation').getByRole('link', { name: 'FAQ' })).toBeVisible();
      await expect(page.getByRole('navigation').getByRole('link', { name: 'Blog' })).toBeVisible();
    });

    test('should display LOGIN link on mobile header', async ({ page }) => {
      await page.goto('/');
      
      const loginLink = page.getByRole('banner').getByRole('link', { name: 'LOGIN' });
      await expect(loginLink).toBeVisible();
    });

    test('should display main heading on mobile', async ({ page }) => {
      await page.goto('/');
      
      const mainHeading = page.getByRole('heading', { name: 'Empowering You in Living Boldly™', level: 1 });
      await expect(mainHeading).toBeVisible();
    });

    test('should display CHECK ELIGIBILITY button on mobile', async ({ page }) => {
      await page.goto('/');
      
      const checkEligibilityButton = page.getByRole('button', { name: 'CHECK ELIGIBILITY' }).first();
      await expect(checkEligibilityButton).toBeVisible();
    });

    test('should display footer content on mobile', async ({ page }) => {
      await page.goto('/');
      
      const footer = page.getByRole('contentinfo');
      await expect(footer).toBeVisible();
      
      // Social media links should be visible
      await expect(page.getByRole('link', { name: 'Facebook Logo' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'YouTube Logo' })).toBeVisible();
    });

    test('should navigate via mobile menu', async ({ page }) => {
      await page.goto('/');
      
      // Open mobile menu
      await page.getByRole('button', { name: 'Mobile menu' }).click();
      
      // Click on Fitness Centers
      await page.getByRole('navigation').getByRole('link', { name: 'Fitness Centers' }).click();
      
      // Verify navigation
      await expect(page).toHaveURL(/\/search/);
    });
  });

  test.describe('Small Mobile Viewport (320x568 - iPhone 5)', () => {
    test.use({ viewport: { width: 320, height: 568 } });

    test('should render properly on small mobile viewport', async ({ page }) => {
      await page.goto('/');
      
      // Logo should be visible
      const logo = page.getByRole('link', { name: 'Silver&Fit' }).first();
      await expect(logo).toBeVisible();
      
      // Mobile menu button should be visible
      const mobileMenuButton = page.getByRole('button', { name: 'Mobile menu' });
      await expect(mobileMenuButton).toBeVisible();
      
      // Main heading should be visible
      const mainHeading = page.getByRole('heading', { name: 'Empowering You in Living Boldly™', level: 1 });
      await expect(mainHeading).toBeVisible();
    });
  });

  test.describe('Large Desktop Viewport (1920x1080)', () => {
    test.use({ viewport: { width: 1920, height: 1080 } });

    test('should render properly on large desktop viewport', async ({ page }) => {
      await page.goto('/');
      
      // Full navigation should be visible
      await expect(page.getByRole('navigation').getByRole('link', { name: 'HOMEPAGE' })).toBeVisible();
      await expect(page.getByRole('navigation').getByRole('link', { name: 'BLOG' })).toBeVisible();
      
      // All header elements should be visible
      const loginLink = page.getByRole('link', { name: 'LOGIN' });
      await expect(loginLink).toBeVisible();
      
      const checkEligibilityLink = page.getByRole('banner').getByRole('link', { name: 'CHECK ELIGIBILITY' });
      await expect(checkEligibilityLink).toBeVisible();
    });
  });
});
