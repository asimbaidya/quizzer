import { screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { HttpResponse, http } from "msw"
import { describe, expect, it } from "vitest"
import { questionItem, quizView } from "../fixtures/quiz"
import { api } from "../mocks/handlers"
import { server } from "../mocks/server"
import { renderRoute } from "../utils/renderRoute"

const QUIZ_URL = api("/student/enrolled_courses/quiz/:courseTitle/:quizId")
const SUBMIT_URL = api(
  "/student/enrolled_courses/quiz/:courseTitle/:quizId/submit",
)

describe("Quiz taking flow", () => {
  it("renders questions once the quiz loads", async () => {
    server.use(
      http.get(QUIZ_URL, () => HttpResponse.json(quizView({ total_mark: 10 }))),
    )
    renderRoute({ initialPath: "/quiz/math/q1" })

    expect(await screen.findByText("Question q1")).toBeInTheDocument()
    expect(screen.getByText("10 marks")).toBeInTheDocument()
    expect(screen.getByText("0/3 attempts used")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /submit quiz/i }),
    ).toBeInTheDocument()
  })

  it("shows the last-submission alert and locks after attempts run out", async () => {
    server.use(
      http.get(QUIZ_URL, () =>
        HttpResponse.json(
          quizView({
            allowed_attempt: 1,
            question_submissions: [
              questionItem(
                "q1",
                {},
                {
                  question_type: "single_choice",
                  user_response: { user_response: "A" },
                  made_attempt: true,
                  is_correct: true,
                  score: 5,
                  feedback: "Nice",
                  attempt_count: 1,
                  status: "graded",
                },
              ),
            ],
          }),
        ),
      ),
    )
    renderRoute({ initialPath: "/quiz/math/q1" })

    expect(
      await screen.findByText(/Last submission: 5\/5 marks/),
    ).toBeInTheDocument()
    expect(screen.getByText(/used all your attempts/i)).toBeInTheDocument()
    // Locked: the submit bar is gone.
    expect(
      screen.queryByRole("button", { name: /submit quiz/i }),
    ).not.toBeInTheDocument()
  })

  it("submits the selected answers as a batch payload", async () => {
    let received: unknown
    server.use(
      http.get(QUIZ_URL, () => HttpResponse.json(quizView())),
      http.post(SUBMIT_URL, async ({ request }) => {
        received = await request.json()
        return HttpResponse.json({ ok: true })
      }),
    )
    renderRoute({ initialPath: "/quiz/math/q1" })

    await screen.findByText("Question q1")
    // Answer the single-choice question, then submit.
    const card = screen
      .getByText("Question q1")
      .closest("div[data-slot='card']")
    await userEvent.click(
      within(card as HTMLElement).getByRole("button", { name: "A" }),
    )
    await userEvent.click(screen.getByRole("button", { name: /submit quiz/i }))

    await waitFor(() => expect(received).toBeDefined())
    expect(received).toEqual({
      answers: [
        {
          question_id: "q1",
          question_type: "single_choice",
          user_response: {
            question_type: "single_choice",
            user_response: "A",
          },
        },
      ],
    })
  })

  it("shows the empty state when the quiz has no questions", async () => {
    server.use(
      http.get(QUIZ_URL, () =>
        HttpResponse.json(quizView({ question_submissions: [] })),
      ),
    )
    renderRoute({ initialPath: "/quiz/math/q1" })
    expect(await screen.findByText(/no questions yet/i)).toBeInTheDocument()
  })
})
