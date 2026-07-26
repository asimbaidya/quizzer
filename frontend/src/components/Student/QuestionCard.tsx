import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

import { StudentService } from "@/client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { LoadingButton } from "@/components/ui/loading-button"
import useCustomToast from "@/hooks/useCustomToast"
import type { QuestionWithSubmission } from "@/lib/quiz"
import { cn } from "@/lib/utils"
import { handleError } from "@/utils"

interface Props {
  item: QuestionWithSubmission
  courseTitle: string
  questionSetId: string
  invalidateKey: unknown[]
}

export default function QuestionCard({
  item,
  courseTitle,
  questionSetId,
  invalidateKey,
}: Props) {
  const { question, submission } = item
  const qtype = question.question_type
  const queryClient = useQueryClient()
  const { showSuccessToast, showErrorToast } = useCustomToast()

  const [single, setSingle] = useState<string>("")
  const [multi, setMulti] = useState<string[]>([])
  const [text, setText] = useState<string>("")
  const [bool, setBool] = useState<boolean | null>(null)

  const canSubmit = question.submit_url != null

  const mutation = useMutation({
    mutationFn: (value: string | string[] | boolean) =>
      StudentService.submitAnswer({
        courseTitle,
        questionId: question.id,
        questionSetId,
        requestBody: {
          question_type: qtype,
          user_response: { question_type: qtype, user_response: value },
        },
      }),
    onSuccess: () => {
      showSuccessToast("Answer submitted")
      queryClient.invalidateQueries({ queryKey: invalidateKey })
    },
    onError: handleError.bind(showErrorToast),
  })

  const submit = () => {
    if (qtype === "single_choice") mutation.mutate(single)
    else if (qtype === "multiple_choice") mutation.mutate(multi)
    else if (qtype === "user_input") mutation.mutate(text)
    else if (qtype === "true_false" && bool !== null) mutation.mutate(bool)
  }

  const answered = submission?.made_attempt
  const choices = question.question_data.choices ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-start justify-between gap-4 text-base">
          <span>{question.question_data.question_text}</span>
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
                variant={single === c.text ? "default" : "outline"}
                className="justify-start"
                onClick={() => setSingle(c.text)}
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
                  className="flex items-center gap-3 rounded-md border p-3 text-left"
                  onClick={() =>
                    setMulti((prev) =>
                      checked
                        ? prev.filter((t) => t !== c.text)
                        : [...prev, c.text],
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
                variant={bool === v ? "default" : "outline"}
                onClick={() => setBool(v)}
              >
                {v ? "True" : "False"}
              </Button>
            ))}
          </div>
        )}

        {qtype === "user_input" && (
          <Input
            value={text}
            placeholder="Type your answer"
            onChange={(e) => setText(e.target.value)}
          />
        )}

        {answered && submission?.feedback && (
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

        {canSubmit && (
          <div>
            <LoadingButton loading={mutation.isPending} onClick={submit}>
              Submit answer
            </LoadingButton>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
