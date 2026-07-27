import { expect, test } from "./fixtures"

// Cheapest possible signal that the stack is wired up: the login page renders
// and an unauthenticated visit to a protected route is redirected to it.
test.describe("smoke", () => {
  test("login page renders", async ({ page }) => {
    await page.goto("/login")
    await expect(
      page.getByRole("heading", { name: /login to your account/i }),
    ).toBeVisible()
  })

  test("protected route redirects to login when logged out", async ({
    page,
  }) => {
    await page.goto("/")
    await expect(page).toHaveURL(/\/login/)
  })
})
