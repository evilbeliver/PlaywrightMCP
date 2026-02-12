import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : 2,
  reporter: 'html',
  timeout: 60000, // 60 second timeout for slow network
  expect: {
    timeout: 10000, // 10 second timeout for assertions
  },
  use: {
    baseURL: 'https://www.silverandfit.com',
    trace: 'on-first-retry',
    navigationTimeout: 45000, // 45 second navigation timeout
    actionTimeout: 15000, // 15 second action timeout
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
