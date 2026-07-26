// View types for the quiz/test endpoints, which the backend returns as plain
// JSON (no strict response_model), so the generated client types them loosely.

export type QuestionType =
  | "single_choice"
  | "multiple_choice"
  | "true_false"
  | "user_input"

export interface StudentChoice {
  text: string
}

export interface StudentQuestion {
  id: string
  question_type: QuestionType
  question_data: {
    question_type: QuestionType
    question_text: string
    choices: StudentChoice[] | null
  }
  tag: string | null
  total_marks: number
  image: string | null
  image_url: string | null
  submit_url: string | null
}

export interface StudentSubmission {
  question_type: QuestionType
  user_response: { user_response: string | string[] | boolean } | null
  made_attempt: boolean
  is_correct: boolean | null
  score: number | null
  feedback: string | null
  attempt_count: number
  status: string
}

export interface QuestionWithSubmission {
  question: StudentQuestion
  submission: StudentSubmission | null
}

export interface QuizView {
  question_submissions: QuestionWithSubmission[]
  question_set_id: string
  total_mark: number
  allowed_attempt: number
  is_unlimited_attempt: boolean
}

export interface TestView {
  question_submissions: QuestionWithSubmission[]
  question_set_id: string
  total_mark: number
  status: string
  start_time: string | null
  window_end: string
  duration: number
}

export interface QuizzesAndTests {
  quizzes: Array<{ id: string; title: string; total_mark: number }>
  tests: Array<{
    id: string
    title: string
    total_mark: number
    duration: number
    window_start: string
    window_end: string
  }>
}
