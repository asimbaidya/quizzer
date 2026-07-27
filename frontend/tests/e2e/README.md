# End-to-end tests (Playwright)

E2E specs drive a real browser against the **full running stack** — Vite frontend,
FastAPI backend, and a seeded Postgres. They complement the fast Vitest suite
(`src/**/*.test.tsx`, mocked network); see `../../docs/TESTING.md` for the overall
strategy.

## Prerequisites

E2E needs the whole stack up **with demo data seeded**. From the repo root:

```bash
./scripts/dev.sh up      # Postgres (Docker) + backend :8001 + frontend :5173
./scripts/dev.sh seed    # load demo users/courses/quizzes (run once)
./scripts/dev.sh status  # verify everything is running
```

Chromium is already installed in this environment. On a fresh machine:

```bash
cd frontend && bunx playwright install --with-deps chromium
```

## Running

```bash
cd frontend
bun run test:e2e            # headless, all specs
bun run test:e2e:ui         # Playwright UI mode (watch/debug)
bunx playwright test smoke.spec.ts          # a single file
bunx playwright test -g "wrong password"    # by title
bunx playwright show-report                 # open the last HTML report
```

`playwright.config.ts` reuses an already-running frontend (`reuseExistingServer`).
It only (re)starts the **Vite dev server** — it cannot boot the backend or db, so
those must already be up via `dev.sh`. Override the base URL with
`PLAYWRIGHT_BASE_URL` if you run the app elsewhere.

## Layout

```
tests/e2e/
  README.md          # this file
  fixtures.ts        # seeded credentials (USERS), login() helper, extended `test`
  smoke.spec.ts      # stack-is-wired sanity: login renders, guard redirects
  auth.spec.ts       # login success / wrong password / session persistence
  quiz.spec.ts       # student → course → quiz journey (uses seeded data)
```

## Conventions

- **File suffix is `.spec.ts`** for E2E. Vitest owns `*.test.ts(x)`; the two never
  overlap (`playwright.config.ts` `testMatch` + `vitest.config.ts` `exclude`).
- **Log in via the fixture**, not by hand:
  ```ts
  import { test, expect } from "./fixtures"
  test("...", async ({ page, loginAs }) => {
    await loginAs("teacher")   // "admin" | "teacher" | "student"
    // ...
  })
  ```
  Or `login(page, "student")` for mid-test role switches.
- **Credentials** come from `fixtures.ts` (`USERS`), defaulting to the seeded demo
  accounts in the repo-root `.test-credentials.md`. Override per-env with
  `E2E_STUDENT_EMAIL` / `E2E_STUDENT_PASSWORD`, etc.
- **Prefer role/label selectors** (`getByRole`, `getByText`) over CSS. `data-testid`
  exists on the login inputs (`email-input`, `password-input`).
- **Seeded-data coupling:** `quiz.spec.ts` hard-codes `Mathematics 101` / `Algebra
  Basics` and the `sam` student. If the seed script changes those names, update the
  spec. Keep data-coupled specs few and obvious.

## Adding a spec — checklist

1. Create `tests/e2e/<feature>.spec.ts`, `import { test, expect } from "./fixtures"`.
2. Authenticate with `loginAs(role)` in a `beforeEach` (skip for logged-out flows).
3. Drive the UI with role/text locators; assert on visible outcomes and URL.
4. If it depends on seeded data, name that dependency in a comment at the top.
5. Run it: `bunx playwright test <feature>.spec.ts`.

## Planned journeys (not yet written)

See `../../docs/TESTING.md` §4.12. Next up:
- Student takes the **timed test** (start → answer → submit; and let the timer
  expire → auto-submit) — needs a short-duration seeded test.
- Teacher authoring: create course → quiz → question, verify visible to a student.
- Admin: create a user, edit role, delete.

## Troubleshooting

- **All specs fail at the login page / connection refused** → the stack isn't up.
  Run `./scripts/dev.sh status`, then `./scripts/dev.sh up`.
- **Login works but data is missing** (quiz spec fails to find the course) → run
  `./scripts/dev.sh seed`.
- **Flaky waits** → assert on a concrete post-condition (`toHaveURL`, a heading
  becoming visible), never a fixed `waitForTimeout`.
- Inspect a failure with `bunx playwright show-report` (screenshots on failure,
  traces on first retry are captured automatically).
```
