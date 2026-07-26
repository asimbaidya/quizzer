import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"

import { StudentService } from "@/client"
import QuestionCard from "@/components/Student/QuestionCard"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { QuizView } from "@/lib/quiz"

export const Route = createFileRoute("/_layout/quiz/$courseTitle/$quizId")({
  component: TakeQuiz,
  head: () => ({ meta: [{ title: "Quiz - Quizzer" }] }),
})

function TakeQuiz() {
  const { courseTitle, quizId } = Route.useParams()
  const queryKey = ["quiz", courseTitle, quizId]
  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: async () =>
      (await StudentService.getQuizQuestions({
        courseTitle,
        quizId,
      })) as unknown as QuizView,
  })

  if (isLoading) return <Skeleton className="h-96 w-full" />
  if (!data) return <p className="text-muted-foreground">Quiz not found.</p>

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
        <div className="mt-2 flex items-center gap-3">
          <h1 className="text-2xl font-semibold">Quiz</h1>
          <Badge variant="secondary">{data.total_mark} marks</Badge>
          <Badge variant="outline">
            {data.is_unlimited_attempt
              ? "Unlimited attempts"
              : `${data.allowed_attempt} attempts`}
          </Badge>
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
        {data.question_submissions.length === 0 && (
          <p className="text-muted-foreground">
            This quiz has no questions yet.
          </p>
        )}
      </div>
    </div>
  )
}
