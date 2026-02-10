import { test, expect } from '@playwright/test';

/**
 * Silver&Fit Homepage Content Links Tests
 * 
 * Tests for all internal and external links in the main content area
 * and footer of the Silver&Fit homepage.
 */
test.describe('Homepage Content Links', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Main Content Links', () => {
    
    test('should display Well-Being Club LEARN MORE link with correct href', async ({ page }) => {
      const learnMoreLinks = page.getByRole('link', { name: 'LEARN MORE' });
      const wellBeingLearnMore = learnMoreLinks.first();
      await expect(wellBeingLearnMore).toBeVisible();
      await expect(wellBeingLearnMore).toHaveAttribute('href', /\/well-being-club/);
    });

    test('should display Log in link in fitness center section', async ({ page }) => {
      const loginLink = page.getByRole('main').getByRole('link', { name: 'Log in' });
      await expect(loginLink).toBeVisible();
      await expect(loginLink).toHaveAttribute('href', /\/identity\/login/);
    });

    test('should display check your eligibility link', async ({ page }) => {
      const eligibilityLink = page.getByRole('link', { name: /check your eligibility/i });
      await expect(eligibilityLink).toBeVisible();
      await expect(eligibilityLink).toHaveAttribute('href', /\/identity\/registration/);
    });

    test('should display View Kits link with correct href', async ({ page }) => {
      const viewKitsLink = page.getByRole('link', { name: 'View Kits.' });
      await expect(viewKitsLink).toBeVisible();
      await expect(viewKitsLink).toHaveAttribute('href', /\/home-kits/);
    });

    test('should display Facebook Live external link', async ({ page }) => {
      const facebookLink = page.getByRole('link', { name: 'Facebook Live' });
      await expect(facebookLink).toBeVisible();
      await expect(facebookLink).toHaveAttribute('href', /facebook\.com\/SilverandFit/);
    });

    test('should display YouTube external link', async ({ page }) => {
      const youtubeLink = page.getByRole('main').getByRole('link', { name: 'YouTube' });
      await expect(youtubeLink).toBeVisible();
      await expect(youtubeLink).toHaveAttribute('href', /youtube\.com\/user\/silverandfit/);
    });

    test('should display View class schedule link', async ({ page }) => {
      const scheduleLink = page.getByRole('link', { name: 'View class schedule.' });
      await expect(scheduleLink).toBeVisible();
      await expect(scheduleLink).toHaveAttribute('href', /\/workouts/);
    });

    test('should display health plans LEARN MORE link', async ({ page }) => {
      const learnMoreLink = page.getByRole('link', { name: 'LEARN MORE' }).nth(2);
      await expect(learnMoreLink).toBeVisible();
      await expect(learnMoreLink).toHaveAttribute('href', /\/health-plans/);
    });

    test('should display See health plans offering link', async ({ page }) => {
      const healthPlansLink = page.getByRole('link', { name: 'See health plans offering the Silver&Fit program.' });
      await expect(healthPlansLink).toBeVisible();
      await expect(healthPlansLink).toHaveAttribute('href', /\/health-plans/);
    });

    test('should display Fitness Centers Learn more external link', async ({ page }) => {
      const fitnessCentersLink = page.locator('a[href*="ashlink"]', { hasText: /learn more/i });
      await expect(fitnessCentersLink).toBeVisible();
      await expect(fitnessCentersLink).toHaveAttribute('href', /ashlink\.com/);
    });

    test('should display READ OUR FAQ link', async ({ page }) => {
      const faqLink = page.getByRole('link', { name: 'READ OUR FAQ' });
      await expect(faqLink).toBeVisible();
      await expect(faqLink).toHaveAttribute('href', /\/faq/);
    });
  });

  test.describe('Footer Links', () => {
    
    test('should display ASH Logo link in footer', async ({ page }) => {
      const ashLink = page.getByRole('link', { name: 'ASH Logo' });
      await expect(ashLink).toBeVisible();
      await expect(ashLink).toHaveAttribute('href', /ashcompanies\.com/);
    });

    test('should display Facebook social media link in footer', async ({ page }) => {
      const facebookLink = page.getByRole('link', { name: 'Facebook Logo' });
      await expect(facebookLink).toBeVisible();
      await expect(facebookLink).toHaveAttribute('href', /facebook\.com\/SilverandFit/);
    });

    test('should display Twitter social media link in footer', async ({ page }) => {
      const twitterLink = page.getByRole('link', { name: 'Twitter Logo' });
      await expect(twitterLink).toBeVisible();
      await expect(twitterLink).toHaveAttribute('href', /twitter\.com\/SilverandFit/);
    });

    test('should display LinkedIn social media link in footer', async ({ page }) => {
      const linkedinLink = page.getByRole('link', { name: 'LinkedIn Logo' });
      await expect(linkedinLink).toBeVisible();
      await expect(linkedinLink).toHaveAttribute('href', /linkedin\.com/);
    });

    test('should display YouTube social media link in footer', async ({ page }) => {
      const youtubeLink = page.getByRole('link', { name: 'YouTube Logo' });
      await expect(youtubeLink).toBeVisible();
      await expect(youtubeLink).toHaveAttribute('href', /youtube\.com/);
    });

    test('should display Pinterest social media link in footer', async ({ page }) => {
      const pinterestLink = page.getByRole('link', { name: 'Pinterest' });
      await expect(pinterestLink).toBeVisible();
      await expect(pinterestLink).toHaveAttribute('href', /pinterest\.com\/silverandfit/);
    });

    test('should display About Us footer link', async ({ page }) => {
      const aboutLink = page.getByRole('link', { name: 'About Us' });
      await expect(aboutLink).toBeVisible();
      await expect(aboutLink).toHaveAttribute('href', /\/About/);
    });

    test('should display FAQ footer link', async ({ page }) => {
      const faqLink = page.getByRole('contentinfo').getByRole('link', { name: 'FAQ' });
      await expect(faqLink).toBeVisible();
      await expect(faqLink).toHaveAttribute('href', /\/faq/);
    });

    test('should display Privacy Statement footer link', async ({ page }) => {
      const privacyLink = page.getByRole('link', { name: 'Privacy Statement' });
      await expect(privacyLink).toBeVisible();
      await expect(privacyLink).toHaveAttribute('href', /\/privacy/);
    });

    test('should display Site Map footer link', async ({ page }) => {
      const sitemapLink = page.getByRole('link', { name: 'Site Map' });
      await expect(sitemapLink).toBeVisible();
      await expect(sitemapLink).toHaveAttribute('href', /\/sitemap/);
    });

    test('should display Contact Us footer link', async ({ page }) => {
      const contactLink = page.getByRole('link', { name: 'Contact Us' });
      await expect(contactLink).toBeVisible();
      await expect(contactLink).toHaveAttribute('href', /\/contactus/);
    });

    test('should display Terms & Conditions footer link', async ({ page }) => {
      const termsLink = page.getByRole('link', { name: 'Terms & Conditions' });
      await expect(termsLink).toBeVisible();
      await expect(termsLink).toHaveAttribute('href', /\/TermsAndConditions/);
    });
  });

  test.describe('Footer Navigation Functionality', () => {
    
    test('should navigate to About Us page', async ({ page }) => {
      await page.getByRole('link', { name: 'About Us' }).click();
      await expect(page).toHaveURL(/\/About/);
    });

    test('should navigate to Privacy Statement page', async ({ page }) => {
      await page.getByRole('link', { name: 'Privacy Statement' }).click();
      await expect(page).toHaveURL(/\/privacy/);
    });

    test('should navigate to Site Map page', async ({ page }) => {
      await page.getByRole('link', { name: 'Site Map' }).click();
      await expect(page).toHaveURL(/\/sitemap/);
    });

    test('should navigate to Contact Us page', async ({ page }) => {
      await page.getByRole('link', { name: 'Contact Us' }).click();
      await expect(page).toHaveURL(/\/contactus/);
    });

    test('should navigate to Terms & Conditions page', async ({ page }) => {
      await page.getByRole('link', { name: 'Terms & Conditions' }).click();
      await expect(page).toHaveURL(/\/TermsAndConditions/);
    });
  });

  test.describe('Language Support Links', () => {
    
    test('should display English language support link', async ({ page }) => {
      const englishLink = page.getByRole('contentinfo').getByRole('link', { name: 'English' });
      await expect(englishLink).toBeVisible();
      await expect(englishLink).toHaveAttribute('href', /Language%20Support.*\.pdf/);
    });

    test('should display Spanish language support link', async ({ page }) => {
      const spanishLink = page.getByRole('link', { name: /Español/ });
      await expect(spanishLink).toBeVisible();
    });

    test('should display Chinese language support link', async ({ page }) => {
      const chineseLink = page.getByRole('link', { name: /繁體中文/ });
      await expect(chineseLink).toBeVisible();
    });
  });
});
