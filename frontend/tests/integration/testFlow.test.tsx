import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { HttpResponse, http } from "msw"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import type { TestView } from "@/lib/quiz"
import { testView } from "../fixtures/quiz"
import { api } from "../mocks/handlers"
import { server } from "../mocks/server"
import { renderRoute } from "../utils/renderRoute"

const TEST_URL = api("/student/enrolled_courses/test/:courseTitle/:testId")
const START_URL = api("/student/enrolled_courses/test/:courseTitle/:testId")
const SUBMIT_URL = api(
  "/student/enrolled_courses/test/:courseTitle/:testId/submit",
)

function serveTest(view: TestView) {
  server.use(http.get(TEST_URL, () => HttpResponse.json(view)))
}

describe("Test state machine", () => {
  it("shows the not-open state before the window starts", async () => {
    serveTest(testView("not_opened"))
    renderRoute({ initialPath: "/test/math/t1" })
    expect(await screen.findByText("Not open yet")).toBeInTheDocument()
  })

  it("shows the missed state when the window has closed", async () => {
    serveTest(testView("not_participated"))
    renderRoute({ initialPath: "/test/math/t1" })
    expect(await screen.findByText("Test missed")).toBeInTheDocument()
  })

  it("lets the student start a not-started test", async () => {
    let started = false
    serveTest(testView("not_started"))
    server.use(
      http.post(START_URL, () => {
        started = true
        return HttpResponse.json({ ok: true })
      }),
    )
    renderRoute({ initialPath: "/test/math/t1" })

    const startBtn = await screen.findByRole("button", { name: /start test/i })
    await userEvent.click(startBtn)
    await waitFor(() => expect(started).toBe(true))
  })

  it("renders an editable in-progress test with a countdown and submit bar", async () => {
    serveTest(
      testView("in_progress", {
        start_time: new Date().toISOString(),
        duration: 30,
      }),
    )
    renderRoute({ initialPath: "/test/math/t1" })

    expect(await screen.findByText("Question q1")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /submit test/i }),
    ).toBeInTheDocument()
    // Countdown badge shows a MM:SS timer.
    expect(screen.getByText(/\d?\d:\d\d/)).toBeInTheDocument()
  })

  it("locks a waiting-for-result test (no submit bar)", async () => {
    serveTest(testView("in_waiting_for_result"))
    renderRoute({ initialPath: "/test/math/t1" })
    expect(await screen.findByText(/awaiting results/i)).toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: /submit test/i }),
    ).not.toBeInTheDocument()
  })

  it("shows the score on a completed test", async () => {
    serveTest(
      testView("completed", {
        question_submissions: [
          {
            question: testView("completed").question_submissions[0].question,
            submission: {
              question_type: "single_choice",
              user_response: { user_response: "A" },
              made_attempt: true,
              is_correct: true,
              score: 5,
              feedback: "Good",
              attempt_count: 1,
              status: "graded",
            },
          },
        ],
      }),
    )
    renderRoute({ initialPath: "/test/math/t1" })
    expect(
      await screen.findByText(/Your score: 5\/5 marks/),
    ).toBeInTheDocument()
  })
})

describe("Test auto-submit on expiry", () => {
  beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }))
  afterEach(() => vi.useRealTimers())

  it("auto-submits exactly once when the timer reaches zero", async () => {
    let submitCount = 0
    // start_time just over `duration` ago -> deadline is already in the past,
    // so the countdown fires onExpire on its first tick.
    const start = new Date(Date.now() - 31 * 60_000).toISOString()
    serveTest(testView("in_progress", { start_time: start, duration: 30 }))
    server.use(
      http.post(SUBMIT_URL, () => {
        submitCount += 1
        return HttpResponse.json({ ok: true })
      }),
    )

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    void user
    renderRoute({ initialPath: "/test/math/t1" })

    await vi.waitFor(() => expect(screen.getByText("Question q1")).toBeTruthy())
    // Advance past the first countdown tick.
    await vi.advanceTimersByTimeAsync(1500)
    await vi.waitFor(() => expect(submitCount).toBe(1))

    // Keep ticking — the autoSubmittedRef guard must prevent a second submit.
    await vi.advanceTimersByTimeAsync(3000)
    expect(submitCount).toBe(1)
  })
})
