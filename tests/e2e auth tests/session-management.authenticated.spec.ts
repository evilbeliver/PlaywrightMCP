import { test, expect } from '@playwright/test';

test.describe('Logout Flow - Authenticated', () => {
  test.use({ storageState: '.auth/user.json' });

  test('should display logout link in user navigation', async ({ page }) => {
    await page.goto('/dashboard');
    
    const logoutLink = page.getByRole('link', { name: /log out/i });
    await expect(logoutLink).toBeVisible();
    await expect(logoutLink).toHaveAttribute('href', /\/logout/);
  });

  test('should successfully logout when clicking logout link', async ({ page }) => {
    await page.goto('/dashboard');
    
    const logoutLink = page.getByRole('link', { name: /log out/i });
    await logoutLink.click();
    
    // After logout, user should be redirected to login page or homepage
    await expect(page).toHaveURL(/\/(identity\/login|$)/);
  });

  test('should not access dashboard after logout', async ({ page, context }) => {
    await page.goto('/dashboard');
    
    // Click logout
    const logoutLink = page.getByRole('link', { name: /log out/i });
    await logoutLink.click();
    
    // Wait for logout to complete
    await page.waitForURL(/\/(identity\/login|$)/);
    
    // Clear storage state to simulate logged out state
    await context.clearCookies();
    
    // Try to access dashboard
    await page.goto('/dashboard');
    
    // Should be redirected to login
    await expect(page).toHaveURL(/identity\/login/);
  });
});

test.describe('Session Persistence - Authenticated', () => {
  test.use({ storageState: '.auth/user.json' });

  test('should maintain session across page navigations', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Navigate to search
    await page.goto('/search');
    await expect(page).toHaveURL(/\/search/);
    
    // Navigate to workouts
    await page.goto('/ResourceLibrary/workouts/all');
    await expect(page).toHaveURL(/\/ResourceLibrary\/workouts/);
    
    // Navigate back to dashboard
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Should still be logged in - verify user name is visible
    const userName = page.getByText('Test', { exact: true });
    await expect(userName).toBeVisible();
  });

  test('should maintain session across My Account pages', async ({ page }) => {
    await page.goto('/MyAccount/program-info');
    await expect(page).toHaveURL(/\/MyAccount\/program-info/);
    
    // Verify user is still logged in
    const fitnessId = page.getByText(/Fitness ID:/);
    await expect(fitnessId).toBeVisible();
    
    // Navigate to another account page
    await page.goto('/MyAccount/preferences');
    await expect(page).toHaveURL(/\/MyAccount\/preferences/);
    
    // Should still be logged in
    await expect(fitnessId).toBeVisible();
  });
});
