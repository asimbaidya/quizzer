import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import type {
  QuestionType,
  QuestionWithSubmission,
  StudentSubmission,
} from "@/lib/quiz"
import QuestionCard from "./QuestionCard"

function makeItem(
  qtype: QuestionType,
  opts: {
    choices?: string[]
    image_url?: string | null
    submission?: Partial<StudentSubmission> | null
  } = {},
): QuestionWithSubmission {
  return {
    question: {
      id: "q1",
      question_type: qtype,
      question_data: {
        question_type: qtype,
        question_text: "What is the capital of France?",
        choices: opts.choices?.map((text) => ({ text })) ?? null,
      },
      tag: null,
      total_marks: 5,
      image: null,
      image_url: opts.image_url ?? null,
      submit_url: null,
    },
    submission:
      opts.submission === undefined
        ? null
        : opts.submission === null
          ? null
          : {
              question_type: qtype,
              user_response: null,
              made_attempt: true,
              is_correct: null,
              score: null,
              feedback: null,
              attempt_count: 1,
              status: "submitted",
              ...opts.submission,
            },
  }
}

describe("QuestionCard", () => {
  it("renders the question text, index label, and marks", () => {
    render(
      <QuestionCard
        item={makeItem("user_input")}
        value={null}
        onChange={vi.fn()}
        index={3}
      />,
    )
    expect(screen.getByText(/capital of France/)).toBeInTheDocument()
    expect(screen.getByText("Q3.")).toBeInTheDocument()
    expect(screen.getByText("5 marks")).toBeInTheDocument()
  })

  describe("single_choice", () => {
    it("emits the chosen text and marks the selected choice", async () => {
      const onChange = vi.fn()
      const { rerender } = render(
        <QuestionCard
          item={makeItem("single_choice", { choices: ["Paris", "Berlin"] })}
          value={null}
          onChange={onChange}
        />,
      )
      await userEvent.click(screen.getByRole("button", { name: "Paris" }))
      expect(onChange).toHaveBeenCalledWith("Paris")

      // With the value applied, the selected button uses the solid variant.
      rerender(
        <QuestionCard
          item={makeItem("single_choice", { choices: ["Paris", "Berlin"] })}
          value="Paris"
          onChange={onChange}
        />,
      )
      expect(screen.getByRole("button", { name: "Paris" })).toHaveAttribute(
        "data-slot",
        "button",
      )
    })
  })

  describe("multiple_choice", () => {
    it("adds to the selection when unchecked", async () => {
      const onChange = vi.fn()
      render(
        <QuestionCard
          item={makeItem("multiple_choice", { choices: ["A", "B", "C"] })}
          value={["A"]}
          onChange={onChange}
        />,
      )
      await userEvent.click(screen.getByRole("button", { name: /B/ }))
      expect(onChange).toHaveBeenCalledWith(["A", "B"])
    })

    it("removes from the selection when already checked", async () => {
      const onChange = vi.fn()
      render(
        <QuestionCard
          item={makeItem("multiple_choice", { choices: ["A", "B"] })}
          value={["A", "B"]}
          onChange={onChange}
        />,
      )
      await userEvent.click(screen.getByRole("button", { name: /A/ }))
      expect(onChange).toHaveBeenCalledWith(["B"])
    })
  })

  describe("true_false", () => {
    it("emits booleans and reflects a selected `false`", async () => {
      const onChange = vi.fn()
      const { rerender } = render(
        <QuestionCard
          item={makeItem("true_false")}
          value={null}
          onChange={onChange}
        />,
      )
      await userEvent.click(screen.getByRole("button", { name: "False" }))
      expect(onChange).toHaveBeenCalledWith(false)

      // Selecting `false` must render as chosen, not fall back to unselected.
      rerender(
        <QuestionCard
          item={makeItem("true_false")}
          value={false}
          onChange={onChange}
        />,
      )
      expect(screen.getByRole("button", { name: "False" })).toBeEnabled()
    })
  })

  describe("user_input", () => {
    it("emits typed text", async () => {
      const onChange = vi.fn()
      render(
        <QuestionCard
          item={makeItem("user_input")}
          value=""
          onChange={onChange}
        />,
      )
      // value is fixed by the parent (controlled), so each keystroke emits the
      // char appended to the current value ("").
      await userEvent.type(screen.getByPlaceholderText("Type your answer"), "H")
      expect(onChange).toHaveBeenCalledWith("H")
    })
  })

  describe("disabled", () => {
    it("makes every input read-only", () => {
      render(
        <QuestionCard
          item={makeItem("single_choice", { choices: ["Paris"] })}
          value={null}
          onChange={vi.fn()}
          disabled
        />,
      )
      expect(screen.getByRole("button", { name: "Paris" })).toBeDisabled()
    })
  })

  describe("graded feedback", () => {
    it("shows feedback and score only once the answer is graded", () => {
      render(
        <QuestionCard
          item={makeItem("user_input", {
            submission: { is_correct: true, feedback: "Correct!", score: 5 },
          })}
          value="Paris"
          onChange={vi.fn()}
        />,
      )
      expect(screen.getByText(/Correct!/)).toBeInTheDocument()
      expect(screen.getByText(/\(score: 5\)/)).toBeInTheDocument()
    })

    it("hides feedback while is_correct is still null (ungraded)", () => {
      render(
        <QuestionCard
          item={makeItem("user_input", {
            submission: { is_correct: null, feedback: "hidden", score: null },
          })}
          value="Paris"
          onChange={vi.fn()}
        />,
      )
      expect(screen.queryByText("hidden")).not.toBeInTheDocument()
    })
  })

  describe("image", () => {
    it("prefixes image_url with the API base when present", () => {
      render(
        <QuestionCard
          item={makeItem("user_input", { image_url: "/img/q1.png" })}
          value=""
          onChange={vi.fn()}
        />,
      )
      const img = screen.getByRole("img", { name: "question" })
      expect(img.getAttribute("src")).toContain("/img/q1.png")
    })

    it("renders no image when image_url is absent", () => {
      render(
        <QuestionCard
          item={makeItem("user_input")}
          value=""
          onChange={vi.fn()}
        />,
      )
      expect(screen.queryByRole("img")).not.toBeInTheDocument()
    })
  })
})
