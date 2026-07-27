import { expect, test } from "./fixtures"

// Exercises the student quiz journey against the seeded dataset:
//   sam is enrolled in "Mathematics 101", which has the "Algebra Basics" quiz.
// See repo-root .test-credentials.md. If seed data changes, update these names.
const COURSE = "Mathematics 101"
const QUIZ = "Algebra Basics"

test.describe("student quiz flow", () => {
  test.beforeEach(async ({ loginAs }) => {
    await loginAs("student")
  })

  test("navigates from courses to a quiz and can submit", async ({ page }) => {
    // Sidebar → My Courses → course → quiz.
    await page.getByRole("link", { name: /my courses/i }).click()
    await expect(page).toHaveURL(/\/courses/)

    await page.getByText(COURSE, { exact: false }).first().click()
    await expect(page.getByRole("heading", { name: COURSE })).toBeVisible()

    await page.getByText(QUIZ, { exact: false }).first().click()
    await expect(page).toHaveURL(/\/quiz\//)

    // The quiz screen shows its heading and a submit/resubmit control.
    await expect(page.getByRole("heading", { name: "Quiz" })).toBeVisible()
    await expect(
      page.getByRole("button", { name: /submit quiz|resubmit quiz/i }),
    ).toBeVisible()
  })
})
