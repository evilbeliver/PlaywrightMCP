import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'https://www.silverandfit.com',
    trace: 'on-first-retry',
  },
  projects: [
    // Authentication setup project - runs before authenticated tests
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // Tests that don't require authentication
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: /.*authenticated.*\.spec\.ts/,
    },

    // Tests that require authentication - depends on setup
    {
      name: 'chromium-authenticated',
      use: {
        ...devices['Desktop Chrome'],
        // Use the saved authentication state
        storageState: '.auth/user.json',
      },
      dependencies: ['setup'],
      testMatch: /.*authenticated.*\.spec\.ts/,
    },
  ],
});
