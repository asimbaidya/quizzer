import { test as base, expect, type Page } from "@playwright/test"

// Seeded demo accounts (see repo-root .test-credentials.md). These are local,
// throwaway credentials; override via env for a different dataset.
export const USERS = {
  admin: {
    email: process.env.E2E_ADMIN_EMAIL ?? "admin@example.com",
    password: process.env.E2E_ADMIN_PASSWORD ?? "ChangeMe_Admin123",
  },
  teacher: {
    email: process.env.E2E_TEACHER_EMAIL ?? "alice@example.com",
    password: process.env.E2E_TEACHER_PASSWORD ?? "Teacher123!",
  },
  student: {
    email: process.env.E2E_STUDENT_EMAIL ?? "sam@example.com",
    password: process.env.E2E_STUDENT_PASSWORD ?? "Student123!",
  },
} as const

export type Role = keyof typeof USERS

/**
 * Log in through the real login form and wait until the app home is reached.
 * Kept as a plain helper so specs can log in as different roles mid-test.
 */
export async function login(page: Page, role: Role = "student") {
  const { email, password } = USERS[role]
  await page.goto("/login")
  await page.getByTestId("email-input").fill(email)
  await page.getByTestId("password-input").fill(password)
  await page.getByRole("button", { name: /log in/i }).click()
  // The layout guard sends authenticated users to "/".
  await expect(page).toHaveURL(/\/$/)
}

/**
 * `test` extended with a `loginAs` fixture. Prefer this in specs:
 *   test("...", async ({ page, loginAs }) => { await loginAs("teacher") })
 */
export const test = base.extend<{ loginAs: (role?: Role) => Promise<void> }>({
  loginAs: async ({ page }, use) => {
    await use((role?: Role) => login(page, role))
  },
})

export { expect }
