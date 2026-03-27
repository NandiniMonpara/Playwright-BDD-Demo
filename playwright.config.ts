/**
 * playwright.config.ts
 *
 * The key BDD addition here is `defineBddConfig()`.
 * It tells playwright-bdd:
 *   - WHERE to find your .feature files
 *   - WHERE to find your step definitions
 *
 * It returns a `testDir` that Playwright uses to find the generated test files.
 * (playwright-bdd auto-generates .spec.ts files from your .feature files under the hood)
 */
import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import * as dotenv from 'dotenv';
dotenv.config();

const testDir = defineBddConfig({
  features: 'features/*.feature',   // path to your .feature files
  steps: 'features/steps/*.ts',     // path to your step definition files
});

export default defineConfig({
  testDir,
  reporter: [
    ['@testdino/playwright', { token: process.env.TESTDINO_TOKEN }],
    ['html', { open: 'never' }],
  ],
  use: {
    headless: true,                 // run browser in background (no visible window)
    screenshot: 'only-on-failure',  // take screenshot if test fails
    trace: 'on-first-retry',        // record trace on retry
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
