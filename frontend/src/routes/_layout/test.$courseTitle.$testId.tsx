import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"

import { StudentService } from "@/client"
import QuestionCard from "@/components/Student/QuestionCard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import useCustomToast from "@/hooks/useCustomToast"
import type { TestView } from "@/lib/quiz"
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

  const { data, isLoading, isError } = useQuery({
    queryKey,
    retry: false,
    queryFn: async () =>
      (await StudentService.getTestQuestions({
        courseTitle,
        testId,
      })) as unknown as TestView,
  })

  const startMutation = useMutation({
    mutationFn: () => StudentService.startTest({ courseTitle, testId }),
    onSuccess: () => {
      showSuccessToast("Test started")
      queryClient.invalidateQueries({ queryKey })
    },
    onError: handleError.bind(showErrorToast),
  })

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

  // The backend rejects viewing questions until the test is started / in window.
  if (isError || !data) {
    return (
      <div className="flex flex-col gap-6">
        {back}
        <Card>
          <CardHeader>
            <CardTitle>Ready to start?</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-muted-foreground">
              This is a timed test. Once you start, the countdown begins and you
              must submit within the allowed duration and window.
            </p>
            <div>
              <Button
                onClick={() => startMutation.mutate()}
                disabled={startMutation.isPending}
              >
                Start test
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        {back}
        <div className="mt-2 flex items-center gap-3">
          <h1 className="text-2xl font-semibold">Test</h1>
          <Badge variant="secondary">{data.total_mark} marks</Badge>
          <Badge variant="outline" className="capitalize">
            {data.status.replace("_", " ")}
          </Badge>
          <Badge variant="outline">{data.duration} min</Badge>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {data.question_submissions.map((item) => (
          <QuestionCard
            key={item.question.id}
            item={item}
            courseTitle={courseTitle}
            questionSetId={data.question_set_id}
            invalidateKey={queryKey}
          />
        ))}
      </div>
    </div>
  )
}
