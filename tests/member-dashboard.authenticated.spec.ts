import { test, expect } from '@playwright/test';

/**
 * Authenticated Member Dashboard Tests for Silver&Fit
 * 
 * These tests run with the authenticated state saved by auth.setup.ts.
 * The user is already logged in when these tests start.
 * 
 * File naming convention: Tests requiring authentication should include
 * "authenticated" in the filename (e.g., member-dashboard.authenticated.spec.ts)
 */

test.describe('Authenticated Member Dashboard', () => {

  test('should display member dashboard with personalized greeting', async ({ page }) => {
    // Navigate to the dashboard
    await page.goto('/dashboard');

    // Verify the personalized greeting is displayed (Good Morning/Afternoon/Evening, [Name])
    await expect(page.getByText(/Good (Morning|Afternoon|Evening)/)).toBeVisible();

    // Verify the Silver&Fit Fitness ID is displayed
    await expect(page.getByText(/Silver&Fit Fitness ID:/)).toBeVisible();

    // Verify main navigation links are visible for authenticated members
    await expect(page.getByRole('link', { name: 'DASHBOARD' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'FITNESS CENTERS' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'WORKOUTS' })).toBeVisible();
  });

  test('should display Well-Being Club section', async ({ page }) => {
    await page.goto('/dashboard');

    // Verify the Well-Being Club promotion section
    await expect(page.getByText('Tell us your interests and discover a Well-Being Club built for you')).toBeVisible();
    await expect(page.getByRole('link', { name: 'TELL US YOUR INTERESTS' })).toBeVisible();
  });

  test('should display Virtual Events section', async ({ page }) => {
    await page.goto('/dashboard');

    // Verify virtual events section
    await expect(page.getByText('Join a Virtual Event through Zoom')).toBeVisible();
    await expect(page.getByRole('link', { name: 'VIEW EVENTS' })).toBeVisible();

    // Verify My Tickets section
    await expect(page.getByText('Already Registered for an Event?')).toBeVisible();
    await expect(page.getByRole('link', { name: 'MY TICKETS' })).toBeVisible();
  });

  test('should display Build Your Fitness Network section', async ({ page }) => {
    await page.goto('/dashboard');

    // Verify fitness network section
    await expect(page.getByRole('heading', { name: 'Build Your Fitness Network' })).toBeVisible();
    await expect(page.getByText('Choose one or multiple memberships from our network')).toBeVisible();
    
    // Verify fitness center search input
    await expect(page.getByPlaceholder(/City, Zip code or Full Address/i)).toBeVisible();
  });

  test('should display Start Strong with a Plan section', async ({ page }) => {
    await page.goto('/dashboard');

    // Verify workout plan section
    await expect(page.getByRole('heading', { name: 'Start Strong with a Plan' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'GET STARTED' })).toBeVisible();
  });

  test('should display other available programs and features', async ({ page }) => {
    await page.goto('/dashboard');

    // Verify additional programs section
    await expect(page.getByRole('heading', { name: 'Other available programs and features' })).toBeVisible();
    
    // Verify Well-Being Coaching section
    await expect(page.getByText('Silver&Fit Well-Being Coaching')).toBeVisible();
    
    // Verify ChooseHealthy section
    await expect(page.getByRole('heading', { name: 'ChooseHealthy' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'EXPLORE STORE' })).toBeVisible();
  });

});
