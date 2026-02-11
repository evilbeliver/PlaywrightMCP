import { test as setup, expect } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Authentication Setup Script for Silver&Fit
 * 
 * This script handles the login flow and saves the authenticated state
 * to be reused by other tests, avoiding repeated logins.
 * 
 * Prerequisites:
 * - Create a .env file in the project root with:
 *   SILVERANDFIT_USERNAME=your-username
 *   SILVERANDFIT_PASSWORD=your-password
 * 
 * IMPORTANT: Never commit the .env file to version control!
 */

// Path to store the authenticated state
const authFile = path.join(__dirname, '../.auth/user.json');

setup('authenticate', async ({ page }) => {
  // Get credentials from environment variables (required)
  const username = process.env.SILVERANDFIT_USERNAME;
  const password = process.env.SILVERANDFIT_PASSWORD;

  // Validate that credentials are provided
  if (!username || !password) {
    throw new Error(
      'Missing credentials. Please set SILVERANDFIT_USERNAME and SILVERANDFIT_PASSWORD in your .env file.'
    );
  }

  // Navigate to the login page
  await page.goto('/identity/login');

  // Verify we're on the login page
  await expect(page.getByRole('heading', { name: 'Member Login' })).toBeVisible();

  // Fill in the login form
  await page.getByRole('textbox', { name: 'Username' }).fill(username);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);

  // Click the login button
  await page.getByRole('button', { name: 'LOG IN' }).click();

  // Wait for successful login - verify we reach the dashboard
  await page.waitForURL(/.*dashboard.*/, { timeout: 30000 });

  // Verify the dashboard loaded with authenticated content
  await expect(page.getByText(/Good (Morning|Afternoon|Evening)/)).toBeVisible();
  await expect(page.getByRole('link', { name: 'DASHBOARD' })).toBeVisible();

  // Save the authenticated state to the storage file
  await page.context().storageState({ path: authFile });
});
