import { defineConfig, devices } from "@playwright/test"

// E2E runs against the REAL running stack (frontend + backend + seeded db).
// Bring it up first with the repo dev orchestrator:
//
//   ./scripts/dev.sh up && ./scripts/dev.sh seed
//
// then `bun run test:e2e`. See tests/e2e/README.md for the full workflow.
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:5173"

export default defineConfig({
  testDir: "./tests/e2e",
  // Playwright specs end in .spec.ts; Vitest owns *.test.ts(x). No overlap.
  testMatch: /.*\.spec\.ts/,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["html"], ["github"]] : "html",

  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    // Enable in CI for cross-browser coverage:
    // { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    // { name: "webkit",  use: { ...devices["Desktop Safari"]  } },
  ],

  // Reuse an already-running frontend. We only (re)start the Vite dev server;
  // the backend + seeded db must already be up via dev.sh — Playwright can't
  // boot those. `reuseExistingServer` means a running `dev.sh up` is used as-is.
  webServer: {
    command: "bun run dev",
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
