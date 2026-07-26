import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"

import { StudentService } from "@/client"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { QuizzesAndTests } from "@/lib/quiz"

export const Route = createFileRoute("/_layout/courses/$courseTitle")({
  component: CourseDetail,
  head: () => ({ meta: [{ title: "Course - Quizzer" }] }),
})

function CourseDetail() {
  const { courseTitle } = Route.useParams()
  const { data, isLoading } = useQuery({
    queryKey: ["course-contents", courseTitle],
    queryFn: async () =>
      (await StudentService.getQuizzesAndTests({
        courseTitle,
      })) as unknown as QuizzesAndTests,
  })

  if (isLoading) return <Skeleton className="h-40 w-full" />

  const quizzes = data?.quizzes ?? []
  const tests = data?.tests ?? []

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link
          to="/courses"
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Back to courses
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">{courseTitle}</h1>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">Quizzes</h2>
        {quizzes.length === 0 ? (
          <p className="text-muted-foreground">No quizzes yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => (
              <Link
                key={quiz.id}
                to="/quiz/$courseTitle/$quizId"
                params={{ courseTitle, quizId: quiz.id }}
              >
                <Card className="transition-colors hover:border-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {quiz.title}
                      <Badge variant="secondary">{quiz.total_mark} marks</Badge>
                    </CardTitle>
                    <CardDescription>Quiz</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">Tests</h2>
        {tests.length === 0 ? (
          <p className="text-muted-foreground">No tests available right now.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tests.map((test) => (
              <Card key={test.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {test.title}
                    <Badge variant="secondary">{test.total_mark} marks</Badge>
                  </CardTitle>
                  <CardDescription>
                    {test.duration} min · closes{" "}
                    {new Date(test.window_end).toLocaleString()}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
