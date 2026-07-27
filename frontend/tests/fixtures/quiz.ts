import type {
  QuestionWithSubmission,
  QuizView,
  TestStatus,
  TestView,
} from "@/lib/quiz"

export function questionItem(
  id: string,
  overrides: Partial<QuestionWithSubmission["question"]> = {},
  submission: QuestionWithSubmission["submission"] = null,
): QuestionWithSubmission {
  return {
    question: {
      id,
      question_type: "single_choice",
      question_data: {
        question_type: "single_choice",
        question_text: `Question ${id}`,
        choices: [{ text: "A" }, { text: "B" }],
      },
      tag: null,
      total_marks: 5,
      image: null,
      image_url: null,
      submit_url: null,
      ...overrides,
    },
    submission,
  }
}

export function quizView(overrides: Partial<QuizView> = {}): QuizView {
  return {
    question_submissions: [questionItem("q1")],
    question_set_id: "qs1",
    total_mark: 5,
    allowed_attempt: 3,
    is_unlimited_attempt: false,
    ...overrides,
  }
}

export function testView(
  status: TestStatus,
  overrides: Partial<TestView> = {},
): TestView {
  return {
    question_submissions: [questionItem("q1")],
    question_set_id: "qs1",
    total_mark: 5,
    status,
    start_time: null,
    submitted_at: null,
    window_start: "2026-01-01T00:00:00Z",
    window_end: "2026-12-31T00:00:00Z",
    duration: 30,
    ...overrides,
  }
}
