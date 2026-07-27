import { describe, expect, it } from "vitest"

import {
  type QuestionType,
  type QuestionWithSubmission,
  type StudentSubmission,
  seedAnswers,
  toBatchAnswers,
} from "./quiz"

// ---- Fixtures ---------------------------------------------------------------

function makeItem(
  id: string,
  question_type: QuestionType,
  responseValue?: string | string[] | boolean,
): QuestionWithSubmission {
  const submission: StudentSubmission | null =
    responseValue === undefined
      ? null
      : {
          question_type,
          user_response: { user_response: responseValue },
          made_attempt: true,
          is_correct: null,
          score: null,
          feedback: null,
          attempt_count: 1,
          status: "submitted",
        }
  return {
    question: {
      id,
      question_type,
      question_data: { question_type, question_text: `Q ${id}`, choices: null },
      tag: null,
      total_marks: 1,
      image: null,
      image_url: null,
      submit_url: null,
    },
    submission,
  }
}

describe("seedAnswers", () => {
  it("seeds an empty array for multiple_choice and null for other types", () => {
    const items = [
      makeItem("a", "multiple_choice"),
      makeItem("b", "single_choice"),
      makeItem("c", "true_false"),
      makeItem("d", "user_input"),
    ]
    expect(seedAnswers(items)).toEqual({ a: [], b: null, c: null, d: null })
  })

  it("restores previous responses of every value shape", () => {
    const items = [
      makeItem("a", "single_choice", "Paris"),
      makeItem("b", "multiple_choice", ["x", "y"]),
      makeItem("c", "user_input", "hello"),
    ]
    expect(seedAnswers(items)).toEqual({
      a: "Paris",
      b: ["x", "y"],
      c: "hello",
    })
  })

  it("preserves a stored `false` boolean instead of falling back to null", () => {
    const items = [makeItem("a", "true_false", false)]
    // Regression guard: `false ?? null` must stay false.
    expect(seedAnswers(items).a).toBe(false)
  })

  it("returns an empty map for no items", () => {
    expect(seedAnswers([])).toEqual({})
  })
})

describe("toBatchAnswers", () => {
  it("drops blank answers: null, empty string, whitespace, empty array", () => {
    const items = [
      makeItem("a", "single_choice"),
      makeItem("b", "user_input"),
      makeItem("c", "user_input"),
      makeItem("d", "multiple_choice"),
    ]
    const answers = { a: null, b: "", c: "   ", d: [] }
    expect(toBatchAnswers(items, answers)).toEqual([])
  })

  it("keeps a `false` boolean answer (valid true/false response)", () => {
    const items = [makeItem("a", "true_false")]
    const result = toBatchAnswers(items, { a: false })
    expect(result).toHaveLength(1)
    expect(result[0].user_response.user_response).toBe(false)
  })

  it("keeps non-empty strings and arrays and drops the blanks in one pass", () => {
    const items = [
      makeItem("a", "user_input"),
      makeItem("b", "multiple_choice"),
      makeItem("c", "single_choice"),
    ]
    const answers = { a: "42", b: ["x"], c: null }
    expect(toBatchAnswers(items, answers)).toEqual([
      {
        question_id: "a",
        question_type: "user_input",
        user_response: { question_type: "user_input", user_response: "42" },
      },
      {
        question_id: "b",
        question_type: "multiple_choice",
        user_response: {
          question_type: "multiple_choice",
          user_response: ["x"],
        },
      },
    ])
  })

  it("emits the doubly-nested payload shape the backend expects", () => {
    const items = [makeItem("a", "single_choice")]
    const [entry] = toBatchAnswers(items, { a: "Paris" })
    expect(entry).toStrictEqual({
      question_id: "a",
      question_type: "single_choice",
      user_response: { question_type: "single_choice", user_response: "Paris" },
    })
  })
})
