import { expect, login, test, USERS } from "./fixtures"

test.describe("authentication journey", () => {
  test("student can log in and reach the app", async ({ page }) => {
    await login(page, "student")
    // Role-based sidebar nav is present once authenticated as a student.
    await expect(page.getByRole("link", { name: /my courses/i })).toBeVisible()
  })

  test("rejects a wrong password without navigating away", async ({ page }) => {
    await page.goto("/login")
    await page.getByTestId("email-input").fill(USERS.student.email)
    await page.getByTestId("password-input").fill("definitely-wrong")
    await page.getByRole("button", { name: /log in/i }).click()

    // An error toast shows and we stay on /login.
    await expect(page.getByText(/something went wrong/i)).toBeVisible()
    await expect(page).toHaveURL(/\/login/)
  })

  test("session survives a reload", async ({ page }) => {
    await login(page, "student")
    await page.reload()
    await expect(page).toHaveURL(/\/$/)
  })
})
