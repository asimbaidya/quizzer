import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import type { AnswerValue, QuestionWithSubmission } from "@/lib/quiz"
import { cn } from "@/lib/utils"

interface Props {
  item: QuestionWithSubmission
  /** The student's current (unsubmitted) answer for this question. */
  value: AnswerValue
  onChange: (value: AnswerValue) => void
  /** When true, inputs are read-only (locked test / after submission). */
  disabled?: boolean
  index?: number
}

export default function QuestionCard({
  item,
  value,
  onChange,
  disabled = false,
  index,
}: Props) {
  const { question, submission } = item
  const qtype = question.question_type
  const choices = question.question_data.choices ?? []

  // Results are shown only once the backend reveals them (is_correct set).
  const graded = submission != null && submission.is_correct !== null
  const single = typeof value === "string" ? value : ""
  const multi = Array.isArray(value) ? value : []
  const text = typeof value === "string" ? value : ""
  const bool = typeof value === "boolean" ? value : null

  return (
    <Card className={cn(disabled && "opacity-95")}>
      <CardHeader>
        <CardTitle className="flex items-start justify-between gap-4 text-base">
          <span>
            {index != null && (
              <span className="mr-2 text-muted-foreground">Q{index}.</span>
            )}
            {question.question_data.question_text}
          </span>
          <Badge variant="secondary" className="shrink-0">
            {question.total_marks} marks
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {question.image_url && (
          <img
            src={`${import.meta.env.VITE_API_URL}${question.image_url}`}
            alt="question"
            className="max-h-64 rounded-md border object-contain"
          />
        )}

        {qtype === "single_choice" && (
          <div className="flex flex-col gap-2">
            {choices.map((c) => (
              <Button
                key={c.text}
                type="button"
                disabled={disabled}
                variant={single === c.text ? "default" : "outline"}
                className="justify-start"
                onClick={() => onChange(c.text)}
              >
                {c.text}
              </Button>
            ))}
          </div>
        )}

        {qtype === "multiple_choice" && (
          <div className="flex flex-col gap-2">
            {choices.map((c) => {
              const checked = multi.includes(c.text)
              return (
                <button
                  key={c.text}
                  type="button"
                  disabled={disabled}
                  className="flex items-center gap-3 rounded-md border p-3 text-left disabled:opacity-60"
                  onClick={() =>
                    onChange(
                      checked
                        ? multi.filter((t) => t !== c.text)
                        : [...multi, c.text],
                    )
                  }
                >
                  <Checkbox checked={checked} className="pointer-events-none" />
                  <span>{c.text}</span>
                </button>
              )
            })}
          </div>
        )}

        {qtype === "true_false" && (
          <div className="flex gap-2">
            {[true, false].map((v) => (
              <Button
                key={String(v)}
                type="button"
                disabled={disabled}
                variant={bool === v ? "default" : "outline"}
                onClick={() => onChange(v)}
              >
                {v ? "True" : "False"}
              </Button>
            ))}
          </div>
        )}

        {qtype === "user_input" && (
          <Input
            value={text}
            disabled={disabled}
            placeholder="Type your answer"
            onChange={(e) => onChange(e.target.value)}
          />
        )}

        {graded && submission?.feedback && (
          <p
            className={cn(
              "rounded-md border p-3 text-sm",
              submission.is_correct
                ? "border-green-500/40 text-green-600 dark:text-green-400"
                : "border-red-500/40 text-red-600 dark:text-red-400",
            )}
          >
            {submission.feedback}
            {submission.score != null && ` (score: ${submission.score})`}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
