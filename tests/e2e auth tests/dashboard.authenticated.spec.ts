import { test, expect } from '@playwright/test';

test.describe('Dashboard - Authenticated', () => {
  test.use({ storageState: '.auth/user.json' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should display personalized greeting', async ({ page }) => {
    // Greeting format: "Good Morning/Afternoon/Evening, [Name]!"
    const greeting = page.getByText(/good (morning|afternoon|evening),/i);
    await expect(greeting).toBeVisible();
  });

  test('should display Fitness ID', async ({ page }) => {
    const fitnessId = page.getByText(/fitness id:/i);
    await expect(fitnessId).toBeVisible();
  });

  test('should display Well-Being Club promotional section', async ({ page }) => {
    const wellBeingClub = page.getByText(/well-being club/i);
    await expect(wellBeingClub.first()).toBeVisible();
  });

  test('should display Tell Us Your Interests link', async ({ page }) => {
    const interestsLink = page.getByRole('link', { name: /tell us your interests/i });
    await expect(interestsLink).toBeVisible();
  });

  test('should display dashboard content sections', async ({ page }) => {
    // Verify dashboard has main content area
    const mainContent = page.locator('main, .dashboard-content, [role="main"]');
    await expect(mainContent.first()).toBeVisible();
  });

  test('should display View Events and My Tickets links', async ({ page }) => {
    const viewEventsLink = page.getByRole('link', { name: /view events/i });
    await expect(viewEventsLink).toBeVisible();

    const myTicketsLink = page.getByRole('link', { name: /my tickets/i });
    await expect(myTicketsLink).toBeVisible();
  });

  test('should display Build Your Fitness Network section', async ({ page }) => {
    const networkHeading = page.getByRole('heading', { name: /build your fitness network/i });
    await expect(networkHeading).toBeVisible();
  });

  test('should display Start Strong with a Plan section', async ({ page }) => {
    const planHeading = page.getByRole('heading', { name: /start strong with a plan/i });
    await expect(planHeading).toBeVisible();

    const getStartedButton = page.getByRole('button', { name: /get started/i });
    await expect(getStartedButton).toBeVisible();
  });

  test('should display main navigation links', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'DASHBOARD' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'WELL-BEING CLUB' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'FITNESS CENTERS' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'WORKOUTS' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'CONNECTED!' })).toBeVisible();
  });

  test('should display user account dropdown navigation', async ({ page }) => {
    // User account navigation links
    await expect(page.getByRole('link', { name: 'Personal Info' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Preferences' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Password & Security' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Program Info' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Billing & Payments' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Manage Memberships' })).toBeVisible();
  });

  test('should display Well-Being Coaching in Other Programs section', async ({ page }) => {
    const coachingText = page.getByText(/well-being coaching/i);
    await expect(coachingText).toBeVisible();
  });

  test('should display ChooseHealthy program', async ({ page }) => {
    const chooseHealthy = page.getByRole('heading', { name: /choosehealthy/i });
    await expect(chooseHealthy).toBeVisible();
  });

  test('should display Explore Store link for ChooseHealthy', async ({ page }) => {
    const exploreStoreLink = page.getByRole('link', { name: /explore store/i });
    await expect(exploreStoreLink).toBeVisible();
  });

  test('should navigate to FITNESS CENTERS', async ({ page }) => {
    const fitnessCentersLink = page.getByRole('link', { name: 'FITNESS CENTERS' });
    await fitnessCentersLink.click();
    await expect(page).toHaveURL(/\/search/);
  });

  test('should navigate to WORKOUTS', async ({ page }) => {
    const workoutsLink = page.getByRole('link', { name: 'WORKOUTS' });
    await workoutsLink.click();
    await expect(page).toHaveURL(/\/ResourceLibrary\/workouts/);
  });

  test('should display shopping cart button', async ({ page }) => {
    const cartButton = page.getByRole('button', { name: /view your shopping cart/i });
    await expect(cartButton).toBeVisible();
  });

  test('should display Silver&Fit home link', async ({ page }) => {
    const homeLink = page.getByRole('link', { name: /silver&fit home/i });
    await expect(homeLink).toBeVisible();
    await expect(homeLink).toHaveAttribute('href', /\/dashboard/);
  });

  test('should display logout link', async ({ page }) => {
    const logoutLink = page.getByRole('link', { name: /log out/i });
    await expect(logoutLink).toBeVisible();
    await expect(logoutLink).toHaveAttribute('href', /\/logout/);
  });

  test('should have Well-Being Club submenu toggle', async ({ page }) => {
    const toggleButton = page.getByRole('button', { name: /toggle well-being club sub-menu/i });
    await expect(toggleButton).toBeVisible();
  });

  test('should have Connected! submenu toggle', async ({ page }) => {
    const toggleButton = page.getByRole('button', { name: /toggle connected! sub-menu/i });
    await expect(toggleButton).toBeVisible();
  });

  test('should display health plan logo', async ({ page }) => {
    // The health plan logo is displayed (in this case "Regence BlueShield")
    const healthPlanLogo = page.getByRole('img', { name: /regence|blueshield/i });
    await expect(healthPlanLogo).toBeVisible();
  });

  test('should display footer with social media links', async ({ page }) => {
    await expect(page.getByRole('link', { name: /facebook/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /linkedin/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /twitter/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /youtube/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /pinterest/i })).toBeVisible();
  });

  test('should display footer navigation links', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'About Us' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'FAQ' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Privacy Statement' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Site Map' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Contact Us' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Terms & Conditions' })).toBeVisible();
  });
});
