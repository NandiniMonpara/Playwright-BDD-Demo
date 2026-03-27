/**
 * fixtures.ts
 *
 * This is where you extend Playwright's base `test` with your own custom
 * fixtures (shared setup like logged-in user, API client, database connection, etc.)
 *
 * For now it's empty — we just re-export the BDD helpers (Given/When/Then).
 */
import { test as base, createBdd } from 'playwright-bdd';

// You can add your own fixtures here later, e.g.:
// type Fixtures = { loggedInPage: Page };
type Fixtures = Record<string, never>;

export const test = base.extend<Fixtures>({
  // add your fixtures here when needed
});

// Export Given/When/Then bound to our custom test object
export const { Given, When, Then } = createBdd(test);
