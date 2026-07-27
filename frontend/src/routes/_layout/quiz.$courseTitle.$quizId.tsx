import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { useEffect, useState } from "react"

import { StudentService } from "@/client"
import QuestionCard from "@/components/Student/QuestionCard"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { LoadingButton } from "@/components/ui/loading-button"
import { Skeleton } from "@/components/ui/skeleton"
import useCustomToast from "@/hooks/useCustomToast"
import type { AnswerValue, QuizView } from "@/lib/quiz"
import { seedAnswers, toBatchAnswers } from "@/lib/quiz"
import { handleError } from "@/utils"

export const Route = createFileRoute("/_layout/quiz/$courseTitle/$quizId")({
  component: TakeQuiz,
  head: () => ({ meta: [{ title: "Quiz - Quizzer" }] }),
})

function TakeQuiz() {
  const { courseTitle, quizId } = Route.useParams()
  const queryClient = useQueryClient()
  const { showSuccessToast, showErrorToast } = useCustomToast()
  const queryKey = ["quiz", courseTitle, quizId]

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: async () =>
      (await StudentService.getQuizQuestions({
        courseTitle,
        quizId,
      })) as unknown as QuizView,
  })

  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({})

  // Seed answers whenever fresh data arrives (initial load and after submit).
  useEffect(() => {
    if (data) setAnswers(seedAnswers(data.question_submissions))
  }, [data])

  const submitMutation = useMutation({
    mutationFn: () =>
      StudentService.submitQuiz({
        courseTitle,
        quizId,
        requestBody: {
          answers: toBatchAnswers(data!.question_submissions, answers),
        },
      }),
    onSuccess: () => {
      showSuccessToast("Quiz submitted")
      queryClient.invalidateQueries({ queryKey })
    },
    onError: handleError.bind(showErrorToast),
  })

  if (isLoading) return <Skeleton className="h-96 w-full" />
  if (!data) return <p className="text-muted-foreground">Quiz not found.</p>

  const items = data.question_submissions
  const attemptsUsed = Math.max(
    0,
    ...items.map((i) => i.submission?.attempt_count ?? 0),
  )
  const submitted = attemptsUsed > 0
  const attemptsLeft = data.is_unlimited_attempt
    ? Number.POSITIVE_INFINITY
    : data.allowed_attempt - attemptsUsed
  const canSubmit = attemptsLeft > 0

  const score = items.reduce((sum, i) => sum + (i.submission?.score ?? 0), 0)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          to="/courses/$courseTitle"
          params={{ courseTitle }}
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Back to {courseTitle}
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold">Quiz</h1>
          <Badge variant="secondary">{data.total_mark} marks</Badge>
          <Badge variant="outline">
            {data.is_unlimited_attempt
              ? "Unlimited attempts"
              : `${attemptsUsed}/${data.allowed_attempt} attempts used`}
          </Badge>
        </div>
      </div>

      {submitted && (
        <Alert>
          <AlertTitle>
            Last submission: {score}/{data.total_mark} marks
          </AlertTitle>
          <AlertDescription>
            {canSubmit
              ? "You can adjust your answers and submit again."
              : "You have used all your attempts. Your answers are locked."}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-4">
        {items.map((item, idx) => (
          <QuestionCard
            key={item.question.id}
            item={item}
            index={idx + 1}
            value={answers[item.question.id] ?? null}
            onChange={(v) =>
              setAnswers((prev) => ({ ...prev, [item.question.id]: v }))
            }
            disabled={!canSubmit}
          />
        ))}
        {items.length === 0 && (
          <p className="text-muted-foreground">
            This quiz has no questions yet.
          </p>
        )}
      </div>

      {items.length > 0 && canSubmit && (
        <div className="sticky bottom-4 flex items-center gap-3 rounded-lg border bg-background/80 p-3 backdrop-blur">
          <LoadingButton
            loading={submitMutation.isPending}
            onClick={() => submitMutation.mutate()}
          >
            {submitted ? "Resubmit quiz" : "Submit quiz"}
          </LoadingButton>
          <span className="text-sm text-muted-foreground">
            Submits all your answers at once.
          </span>
        </div>
      )}
    </div>
  )
}
