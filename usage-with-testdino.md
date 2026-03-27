# Usage with TestDino

You can integrate Playwright-BDD tests with [TestDino](https://testdino.com/) — a Playwright-focused test reporting and analytics platform with real-time streaming, AI failure classification, flaky test detection, and CI integration.

---

#### 1. Sign up to TestDino and create a new project

[Sign up](https://app.testdino.com/auth/signup) to TestDino and create an organization and project from your dashboard.

After creating the project, generate an **API key** from your project settings.

> **Important:** Treat the API key as a secret. Never commit it to source control. Store it in your CI's secret store if you plan to run from CI.

---

#### 2. Install the TestDino reporter

```sh
npm install @testdino/playwright
npm install dotenv
```

---

#### 3. Store your token in a `.env` file

Create a `.env` file in the root of your project:

```
TESTDINO_TOKEN=your_api_key_here
```

> **Important:** Add `.env` to your `.gitignore` — never commit your token to source control.

---

#### 4. Configure the reporter in `playwright.config.ts`

```ts
import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import * as dotenv from 'dotenv';
dotenv.config();

const testDir = defineBddConfig({
  features: 'features/*.feature',
  steps: 'features/steps/*.ts',
});

export default defineConfig({
  testDir,
  reporter: [
    ['@testdino/playwright', { token: process.env.TESTDINO_TOKEN }],
    ['html', { open: 'never' }],
  ],
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

---

#### 5. Run your BDD tests

**Recommended — using `.env` file (works on all platforms):**

```sh
npx bddgen && npx playwright test
```

The token is read automatically from your `.env` file (via `dotenv`). No extra setup needed each time you run.

---

**Alternative — set the token manually in your terminal (no `.env` file needed):**

> Use this if you don't have a `.env` file, or want to quickly override the token for one run.

On **Linux / Mac**:
```sh
export TESTDINO_TOKEN=your_api_key_here
npx bddgen && npx playwright test
```

On **Windows CMD**:
```cmd
set TESTDINO_TOKEN=your_api_key_here && npx bddgen && npx playwright test
```

On **Windows PowerShell**:
```powershell
$env:TESTDINO_TOKEN="your_api_key_here"
npx bddgen && npx playwright test
```

---

#### 4. View results on the TestDino dashboard

Log in to [TestDino](https://app.testdino.com) and open **Test Runs**. You will see:

- Pass/fail counts, duration, branch, and commit info
- Gherkin scenario names mapped to each test result
- Screenshots and traces attached to failed tests
- **AI Insights** — each failure labelled as *Actual Bug*, *UI Change*, *Unstable Test*, or *Miscellaneous*
- Flaky test detection across multiple runs

> Explore sample reports in the [TestDino Sandbox](https://sandbox.testdino.com/) before your first run.

---

### Running in CI (GitHub Actions)

In CI, the token comes from a repository secret — no `.env` file needed. Add `TESTDINO_TOKEN` as a secret in your GitHub repository settings and use this workflow:

```yaml
name: Playwright BDD Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Generate BDD specs and run tests
        run: npx bddgen && npx playwright test
        env:
          TESTDINO_TOKEN: ${{ secrets.TESTDINO_TOKEN }}
```

---

### Troubleshooting

**Results not appearing on the dashboard**
- Confirm your `TESTDINO_TOKEN` in `.env` is correct and belongs to the right project
- Make sure `dotenv.config()` is at the top of `playwright.config.ts`
- On Windows CMD, use `set TESTDINO_TOKEN=...` before running tests if not using `.env`

**`@testdino/playwright` not found**
- Run `npm install @testdino/playwright --save-dev` and retry

**Feature files not executing**
- Always run `npx bddgen` before `npx playwright test` — this step generates spec files from your `.feature` files

**WebSocket shows Offline or Disconnected**
- The reporter will continue sending results and catch up once reconnected
- Toggle streaming off and back on from the Test Runs page to reconnect
