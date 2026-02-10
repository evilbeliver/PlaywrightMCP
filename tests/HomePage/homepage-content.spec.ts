import { test, expect } from '@playwright/test';

/**
 * Silver&Fit Homepage Content Tests
 * 
 * Tests for the main content sections, headings, text content,
 * and interactive elements on the Silver&Fit homepage.
 */
test.describe('Homepage Content', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Page Title and Meta', () => {
    
    test('should have correct page title', async ({ page }) => {
      await expect(page).toHaveTitle(/Homepage.*Silver&Fit/);
    });
  });

  test.describe('Hero Section', () => {
    
    test('should display main hero heading', async ({ page }) => {
      const mainHeading = page.getByRole('heading', { name: 'Empowering You in Living Boldly™', level: 1 });
      await expect(mainHeading).toBeVisible();
    });

    test('should display hero description text', async ({ page }) => {
      const heroText = page.getByText(/Embrace a bolder, more active lifestyle with the Silver&Fit® program/);
      await expect(heroText).toBeVisible();
    });

    test('should display CHECK ELIGIBILITY button in hero section', async ({ page }) => {
      const checkEligibilityButton = page.getByRole('button', { name: 'CHECK ELIGIBILITY' }).first();
      await expect(checkEligibilityButton).toBeVisible();
    });
  });

  test.describe('Well-Being Club Section', () => {
    
    test('should display Well-Being Club heading', async ({ page }) => {
      const heading = page.getByRole('heading', { name: 'Well-Being Club' });
      await expect(heading).toBeVisible();
    });

    test('should display Well-Being Club description', async ({ page }) => {
      const description = page.getByText(/A virtual space for member enrichment, connection, and community building/);
      await expect(description).toBeVisible();
    });

    test('should display Well-Being Club LEARN MORE link', async ({ page }) => {
      const learnMoreLink = page.getByRole('link', { name: 'LEARN MORE' }).first();
      await expect(learnMoreLink).toBeVisible();
    });
  });

  test.describe('Find Your Fitness Center Section', () => {
    
    test('should display Find Your Fitness Center heading', async ({ page }) => {
      const heading = page.getByRole('heading', { name: 'Find Your Fitness Center' });
      await expect(heading).toBeVisible();
    });

    test('should display fitness center count', async ({ page }) => {
      const countText = page.getByText('20,900');
      await expect(countText).toBeVisible();
    });

    test('should display City, State, or ZIP Code search input', async ({ page }) => {
      const searchInput = page.getByRole('textbox', { name: 'City, State, or ZIP Code' });
      await expect(searchInput).toBeVisible();
    });
  });

  test.describe('Get Fit at Home Section', () => {
    
    test('should display Get Fit at Home heading', async ({ page }) => {
      const heading = page.getByRole('heading', { name: 'Get Fit at Home™', level: 1 });
      await expect(heading).toBeVisible();
    });

    test('should display Workout Plans heading and description', async ({ page }) => {
      const heading = page.getByRole('heading', { name: 'Workout Plans' });
      await expect(heading).toBeVisible();
      
      const description = page.getByText(/Members can receive a tailored 14-day Workout Plan/);
      await expect(description).toBeVisible();
    });

    test('should display On-Demand Workout Videos heading and description', async ({ page }) => {
      const heading = page.getByRole('heading', { name: 'On-Demand Workout Videos' });
      await expect(heading).toBeVisible();
      
      const description = page.getByText(/Members can access workout videos including Cardio, Strength, Dance/);
      await expect(description).toBeVisible();
    });

    test('should display Home Fitness Kits heading and description', async ({ page }) => {
      const heading = page.getByRole('heading', { name: 'Home Fitness Kits' }).first();
      await expect(heading).toBeVisible();
      
      const description = page.getByText(/Members can exercise in the comfort and safety of home/);
      await expect(description).toBeVisible();
    });

    test('should display Community Engagement heading and description', async ({ page }) => {
      const heading = page.getByRole('heading', { name: 'Community Engagement' });
      await expect(heading).toBeVisible();
      
      const description = page.getByText(/Members and non-members are invited to join us on/);
      await expect(description).toBeVisible();
    });
  });

  test.describe('FitnessCoach Section', () => {
    
    test('should display FitnessCoach Virtual Training heading', async ({ page }) => {
      const heading = page.getByRole('heading', { name: 'FitnessCoach® Virtual Training' });
      await expect(heading).toBeVisible();
    });

    test('should display FitnessCoach description', async ({ page }) => {
      const description = page.getByText(/Members can meet with a certified personal fitness trainer via live video sessions/);
      await expect(description).toBeVisible();
    });
  });

  test.describe('Well-Being Coaching Section', () => {
    
    test('should display Well-Being Coaching heading', async ({ page }) => {
      const heading = page.getByRole('heading', { name: 'Well-Being Coaching' });
      await expect(heading).toBeVisible();
    });

    test('should display Well-Being Coaching description', async ({ page }) => {
      const description = page.getByText(/Members can get paired up with a Well-Being Coach/);
      await expect(description).toBeVisible();
    });
  });

  test.describe('Program Features Section', () => {
    
    test('should display A Complete Program heading', async ({ page }) => {
      const heading = page.getByRole('heading', { name: "A Complete Program That's Safe and Convenient for Members" });
      await expect(heading).toBeVisible();
    });

    test('should display disclaimer about health plan features', async ({ page }) => {
      const disclaimer = page.getByText('Not all health plans offer each feature.');
      await expect(disclaimer).toBeVisible();
    });
  });

  test.describe('Health Plan Section', () => {
    
    test('should display health plan question heading', async ({ page }) => {
      const heading = page.getByRole('heading', { name: 'Does your health plan offer the Silver&Fit program?' });
      await expect(heading).toBeVisible();
    });

    test('should display health plan description', async ({ page }) => {
      const description = page.getByText(/Silver&Fit program is offered by a variety of Medicare plans/);
      await expect(description).toBeVisible();
    });
  });

  test.describe('Ready to Begin Section', () => {
    
    test('should display Ready to Begin heading', async ({ page }) => {
      const heading = page.getByRole('heading', { name: 'Ready to Begin?' });
      await expect(heading).toBeVisible();
    });

    test('should display Try It Out step', async ({ page }) => {
      const heading = page.getByRole('heading', { name: 'Try It Out' });
      await expect(heading).toBeVisible();
    });

    test('should display Check Eligibility step', async ({ page }) => {
      const heading = page.getByRole('heading', { name: 'Check Eligibility' });
      await expect(heading).toBeVisible();
    });

    test('should display Get Moving, Together step', async ({ page }) => {
      const heading = page.getByRole('heading', { name: 'Get Moving, Together' });
      await expect(heading).toBeVisible();
    });

    test('should display Play Video button', async ({ page }) => {
      const playButton = page.getByRole('button', { name: 'Play Video' });
      await expect(playButton).toBeVisible();
    });
  });

  test.describe('Member Testimonials Section', () => {
    
    test('should display What Members Are Saying heading', async ({ page }) => {
      const heading = page.getByRole('heading', { name: 'What Members Are Saying' });
      await expect(heading).toBeVisible();
    });

    test('should display member testimonials', async ({ page }) => {
      const testimonial1 = page.getByText(/We joined the Silver&Fit program because there are so many things offered/);
      await expect(testimonial1).toBeVisible();
      
      const testimonial2 = page.getByText(/I'm so happy because everything that I'm learning here/);
      await expect(testimonial2).toBeVisible();
      
      const testimonial3 = page.getByText(/At our age, this is quality of life/);
      await expect(testimonial3).toBeVisible();
    });
  });

  test.describe('Health Plan and Fitness Center Section', () => {
    
    test('should display Are you a health plan or a fitness center heading', async ({ page }) => {
      const heading = page.getByRole('heading', { name: 'Are you a health plan or a fitness center?' });
      await expect(heading).toBeVisible();
    });

    test('should display Health Plans information', async ({ page }) => {
      const healthPlansText = page.getByText(/We offer health plans flexible program designs to fit any budget/);
      await expect(healthPlansText).toBeVisible();
    });

    test('should display Fitness Centers information', async ({ page }) => {
      const fitnessCentersText = page.getByText(/Interested in becoming part of our network/);
      await expect(fitnessCentersText).toBeVisible();
    });
  });

  test.describe('FAQ Section', () => {
    
    test('should display Have More Questions heading', async ({ page }) => {
      const heading = page.getByRole('heading', { name: 'Have More Questions?' });
      await expect(heading).toBeVisible();
    });

    test('should display READ OUR FAQ link', async ({ page }) => {
      const faqLink = page.getByRole('link', { name: 'READ OUR FAQ' });
      await expect(faqLink).toBeVisible();
    });
  });

  test.describe('Footer Content', () => {
    
    test('should display A PRODUCT OF text', async ({ page }) => {
      const productOfText = page.getByText('A PRODUCT OF').first();
      await expect(productOfText).toBeVisible();
    });

    test('should display copyright notice', async ({ page }) => {
      const copyright = page.getByText(/© 2020-2026 American Specialty Health Incorporated/);
      await expect(copyright).toBeVisible();
    });

    test('should display external links disclaimer', async ({ page }) => {
      const disclaimer = page.getByText(/Clicking on these links will take you away from Silverandfit.com/);
      await expect(disclaimer).toBeVisible();
    });

    test('should display language services text', async ({ page }) => {
      const languageText = page.getByText(/For language services, please call the number on your member ID card/);
      await expect(languageText).toBeVisible();
    });
  });

  test.describe('Interactive Elements', () => {
    
    test('should have multiple Check Eligibility buttons', async ({ page }) => {
      // These elements are rendered by JavaScript after page load - wait for them
      const checkEligibilityButtons = page.locator('a[role="button"]', { hasText: 'Check Eligibility' });
      await expect(checkEligibilityButtons.first()).toBeVisible({ timeout: 10000 });
      const count = await checkEligibilityButtons.count();
      expect(count).toBeGreaterThanOrEqual(4);
    });

    test('should have Intercom Messenger button', async ({ page }) => {
      const intercomButton = page.getByRole('button', { name: 'Open Intercom Messenger' });
      await expect(intercomButton).toBeVisible({ timeout: 15000 });
    });
  });
});
