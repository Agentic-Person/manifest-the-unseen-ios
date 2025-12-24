import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Manifest the Unseen
 *
 * Run Expo web first: npm run web
 * Then run tests: npx playwright test
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* Maximum time one test can run */
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Reporter to use */
  reporter: 'html',
  /* Shared settings for all the projects below */
  use: {
    /* Base URL for Expo web */
    baseURL: 'http://localhost:8081',
    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 14'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  // Uncomment if you want Playwright to start the server
  // webServer: {
  //   command: 'npm run web',
  //   url: 'http://localhost:8081',
  //   reuseExistingServer: !process.env.CI,
  // },
});
