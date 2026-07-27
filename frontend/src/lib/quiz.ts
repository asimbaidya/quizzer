// View types for the quiz/test endpoints, which the backend returns as plain
// JSON (no strict response_model), so the generated client types them loosely.

export type QuestionType =
  | "single_choice"
  | "multiple_choice"
  | "true_false"
  | "user_input"

export type TestStatus =
  | "not_opened"
  | "not_started"
  | "in_progress"
  | "in_waiting_for_result"
  | "completed"
  | "not_participated"

// The value a student has entered for a question, before it is submitted.
export type AnswerValue = string | string[] | boolean | null

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
  status: TestStatus
  start_time: string | null
  submitted_at: string | null
  window_start: string
  window_end: string
  duration: number
}

export interface QuizzesAndTests {
  quizzes: Array<{
    id: string
    title: string
    total_mark: number
    allowed_attempt: number
    is_unlimited_attempt: boolean
    attempts_used: number
  }>
  tests: Array<{
    id: string
    title: string
    total_mark: number
    duration: number
    window_start: string
    window_end: string
    status: TestStatus
  }>
}

// Pre-fill the answer map from any previously stored responses so a student
// sees their earlier answers (e.g. a prior quiz attempt).
export function seedAnswers(
  items: QuestionWithSubmission[],
): Record<string, AnswerValue> {
  const seed: Record<string, AnswerValue> = {}
  for (const item of items) {
    const prev = item.submission?.user_response?.user_response
    seed[item.question.id] =
      prev ?? (item.question.question_type === "multiple_choice" ? [] : null)
  }
  return seed
}

// Build the batch-submit payload from the student's in-progress answers,
// dropping questions left blank.
type FilledAnswer = Exclude<AnswerValue, null>

export function toBatchAnswers(
  items: QuestionWithSubmission[],
  answers: Record<string, AnswerValue>,
): Array<{
  question_id: string
  question_type: QuestionType
  user_response: { question_type: QuestionType; user_response: FilledAnswer }
}> {
  const isFilled = (v: AnswerValue): v is FilledAnswer => {
    if (v == null) return false
    if (typeof v === "string") return v.trim() !== ""
    if (Array.isArray(v)) return v.length > 0
    return true // boolean
  }
  return items
    .filter((item) => isFilled(answers[item.question.id]))
    .map((item) => {
      const qtype = item.question.question_type
      return {
        question_id: item.question.id,
        question_type: qtype,
        user_response: {
          question_type: qtype,
          user_response: answers[item.question.id] as FilledAnswer,
        },
      }
    })
}
