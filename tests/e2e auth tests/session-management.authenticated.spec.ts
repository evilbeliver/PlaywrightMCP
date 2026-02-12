import { test, expect } from '@playwright/test';

test.describe('Logout Flow - Authenticated', () => {
  test.use({ storageState: '.auth/user.json' });

  test('should display logout link in user navigation', async ({ page }) => {
    await page.goto('/dashboard');
    
    const logoutLink = page.getByRole('link', { name: /log out/i });
    await expect(logoutLink).toBeVisible();
    await expect(logoutLink).toHaveAttribute('href', /\/logout/);
  });

  test('should successfully logout when navigating to logout URL', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Navigate directly to logout URL
    await page.goto('/logout');
    
    // After logout, user should be redirected to login page or homepage
    await expect(page).toHaveURL(/\/(identity\/login|$)/);
  });

  test('should not access dashboard after logout', async ({ page, context }) => {
    await page.goto('/dashboard');
    
    // Navigate directly to logout URL
    await page.goto('/logout');
    
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
    
    // Navigate to workouts
    await page.goto('/ResourceLibrary/workouts/all');
    await expect(page).toHaveURL(/\/ResourceLibrary\/workouts/);
    
    // Navigate to fitness center search
    await page.goto('/search/results');
    
    // Navigate back to dashboard
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Should still be logged in - verify Fitness ID is visible
    const fitnessId = page.getByText(/Fitness ID:/i);
    await expect(fitnessId).toBeVisible();
  });

  test('should maintain session across My Account pages', async ({ page }) => {
    await page.goto('/MyAccount/program-info');
    await expect(page).toHaveURL(/\/MyAccount\/program-info/);
    
    // Verify user is still logged in
    await expect(page.getByText(/Fitness ID:/i)).toBeVisible();
    
    // Navigate to another account page via sidebar navigation (not dropdown)
    const secondaryNav = page.getByRole('navigation', { name: 'Secondary', exact: true });
    await secondaryNav.getByRole('link', { name: 'Personal Info' }).click();
    await expect(page).toHaveURL(/\/MyAccount\/personal-info/);
    
    // Should still be logged in
    await expect(page.getByText(/Fitness ID:/i)).toBeVisible();
  });
});
