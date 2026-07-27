import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { StudentService } from "@/client"
import Countdown from "@/components/Student/Countdown"
import QuestionCard from "@/components/Student/QuestionCard"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingButton } from "@/components/ui/loading-button"
import { Skeleton } from "@/components/ui/skeleton"
import useCustomToast from "@/hooks/useCustomToast"
import type { AnswerValue, TestView } from "@/lib/quiz"
import { seedAnswers, toBatchAnswers } from "@/lib/quiz"
import { handleError } from "@/utils"

export const Route = createFileRoute("/_layout/test/$courseTitle/$testId")({
  component: TakeTest,
  head: () => ({ meta: [{ title: "Test - Quizzer" }] }),
})

function TakeTest() {
  const { courseTitle, testId } = Route.useParams()
  const queryClient = useQueryClient()
  const { showSuccessToast, showErrorToast } = useCustomToast()
  const queryKey = ["test", courseTitle, testId]

  const { data, isLoading } = useQuery({
    queryKey,
    retry: false,
    queryFn: async () =>
      (await StudentService.getTestQuestions({
        courseTitle,
        testId,
      })) as unknown as TestView,
  })

  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({})
  const autoSubmittedRef = useRef(false)

  useEffect(() => {
    if (data) setAnswers(seedAnswers(data.question_submissions))
  }, [data])

  const startMutation = useMutation({
    mutationFn: () => StudentService.startTest({ courseTitle, testId }),
    onSuccess: () => {
      showSuccessToast("Test started — good luck!")
      queryClient.invalidateQueries({ queryKey })
    },
    onError: handleError.bind(showErrorToast),
  })

  const submitMutation = useMutation({
    mutationFn: () =>
      StudentService.submitTest({
        courseTitle,
        testId,
        requestBody: {
          answers: toBatchAnswers(data!.question_submissions, answers),
        },
      }),
    onSuccess: () => {
      showSuccessToast("Test submitted")
      queryClient.invalidateQueries({ queryKey })
    },
    onError: handleError.bind(showErrorToast),
  })

  const submit = submitMutation.mutate
  const handleExpire = useCallback(() => {
    if (autoSubmittedRef.current) return
    autoSubmittedRef.current = true
    showErrorToast("Time is up — submitting your answers.")
    submit()
  }, [submit, showErrorToast])

  // The test ends at whichever comes first: the student's personal duration
  // limit, or the test window closing.
  const deadline = useMemo(() => {
    if (!data?.start_time) return null
    const byDuration =
      new Date(data.start_time).getTime() + data.duration * 60_000
    const byWindow = new Date(data.window_end).getTime()
    return new Date(Math.min(byDuration, byWindow))
  }, [data?.start_time, data?.duration, data?.window_end])

  const back = (
    <Link
      to="/courses/$courseTitle"
      params={{ courseTitle }}
      className="text-sm text-muted-foreground hover:underline"
    >
      ← Back to {courseTitle}
    </Link>
  )

  if (isLoading) return <Skeleton className="h-96 w-full" />
  if (!data) return <p className="text-muted-foreground">Test not found.</p>

  const { status } = data
  const items = data.question_submissions

  // ---- Pre-start states -------------------------------------------------------
  if (status === "not_opened") {
    return (
      <Shell back={back} title="Test" badges={<TotalMark data={data} />}>
        <Card>
          <CardHeader>
            <CardTitle>Not open yet</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            This test opens at{" "}
            <strong>{new Date(data.window_start).toLocaleString()}</strong>.
          </CardContent>
        </Card>
      </Shell>
    )
  }

  if (status === "not_participated") {
    return (
      <Shell back={back} title="Test" badges={<TotalMark data={data} />}>
        <Alert variant="destructive">
          <AlertTitle>Test missed</AlertTitle>
          <AlertDescription>
            The window for this test closed on{" "}
            {new Date(data.window_end).toLocaleString()} and you did not take
            it.
          </AlertDescription>
        </Alert>
      </Shell>
    )
  }

  if (status === "not_started") {
    return (
      <Shell back={back} title="Test" badges={<TotalMark data={data} />}>
        <Card>
          <CardHeader>
            <CardTitle>Ready to start?</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-muted-foreground">
              This is a timed test. Once you start, a{" "}
              <strong>{data.duration}-minute</strong> countdown begins and you
              may take it <strong>only once</strong>. Submit before the timer or
              window ({new Date(data.window_end).toLocaleString()}) runs out —
              otherwise your answers are submitted automatically.
            </p>
            <div>
              <LoadingButton
                loading={startMutation.isPending}
                onClick={() => startMutation.mutate()}
              >
                Start test
              </LoadingButton>
            </div>
          </CardContent>
        </Card>
      </Shell>
    )
  }

  // ---- In-progress / submitted / completed -----------------------------------
  const inProgress = status === "in_progress"
  const completed = status === "completed"
  const waiting = status === "in_waiting_for_result"
  const score = items.reduce((sum, i) => sum + (i.submission?.score ?? 0), 0)

  return (
    <Shell
      back={back}
      title="Test"
      badges={
        <>
          <TotalMark data={data} />
          <StatusBadge status={status} />
          {inProgress && deadline && (
            <Countdown deadline={deadline} onExpire={handleExpire} />
          )}
        </>
      }
    >
      {waiting && (
        <Alert>
          <AlertTitle>Submitted — awaiting results</AlertTitle>
          <AlertDescription>
            Your answers are locked. Results become visible once the test window
            closes on {new Date(data.window_end).toLocaleString()}.
          </AlertDescription>
        </Alert>
      )}
      {completed && (
        <Alert>
          <AlertTitle>
            Your score: {score}/{data.total_mark} marks
          </AlertTitle>
          <AlertDescription>This test is complete.</AlertDescription>
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
            disabled={!inProgress}
          />
        ))}
      </div>

      {inProgress && (
        <div className="sticky bottom-4 flex items-center gap-3 rounded-lg border bg-background/80 p-3 backdrop-blur">
          <LoadingButton
            loading={submitMutation.isPending}
            onClick={() => submitMutation.mutate()}
          >
            Submit test
          </LoadingButton>
          <span className="text-sm text-muted-foreground">
            Submits all answers and ends the test. You cannot retake it.
          </span>
        </div>
      )}
    </Shell>
  )
}

// ---- Small presentational helpers --------------------------------------------
function Shell({
  back,
  title,
  badges,
  children,
}: {
  back: React.ReactNode
  title: string
  badges: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        {back}
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold">{title}</h1>
          {badges}
        </div>
      </div>
      {children}
    </div>
  )
}

function TotalMark({ data }: { data: TestView }) {
  return (
    <>
      <Badge variant="secondary">{data.total_mark} marks</Badge>
      <Badge variant="outline">{data.duration} min</Badge>
    </>
  )
}

function StatusBadge({ status }: { status: TestView["status"] }) {
  return (
    <Badge variant="outline" className="capitalize">
      {status.replace(/_/g, " ")}
    </Badge>
  )
}
