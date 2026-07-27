import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"

import { TeacherService } from "@/client"
import CreateQuizDialog from "@/components/Teacher/CreateQuizDialog"
import CreateTestDialog from "@/components/Teacher/CreateTestDialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { QuizzesAndTests } from "@/lib/quiz"

export const Route = createFileRoute("/_layout/teach/$courseTitle/")({
  component: TeacherCourseDetail,
  head: () => ({ meta: [{ title: "Course - Quizzer" }] }),
})

function TeacherCourseDetail() {
  const { courseTitle } = Route.useParams()

  const { data, isLoading } = useQuery({
    queryKey: ["teacher-course", courseTitle],
    queryFn: async () =>
      (await TeacherService.getQuizzesAndTests({
        courseTitle,
      })) as unknown as QuizzesAndTests,
  })

  const { data: students } = useQuery({
    queryKey: ["teacher-students", courseTitle],
    queryFn: () => TeacherService.getEnrolledStudents({ courseTitle }),
  })

  if (isLoading) return <Skeleton className="h-40 w-full" />

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link
          to="/teach"
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Back to teaching
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">{courseTitle}</h1>
      </div>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Quizzes</h2>
          <CreateQuizDialog courseTitle={courseTitle} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(data?.quizzes ?? []).map((quiz) => (
            <Link
              key={quiz.id}
              to="/teach/$courseTitle/$kind/$assessmentId"
              params={{ courseTitle, kind: "quiz", assessmentId: quiz.id }}
            >
              <Card className="transition-colors hover:border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {quiz.title}
                    <Badge variant="secondary">{quiz.total_mark} marks</Badge>
                  </CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
          {(data?.quizzes ?? []).length === 0 && (
            <p className="text-muted-foreground">No quizzes yet.</p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Tests</h2>
          <CreateTestDialog courseTitle={courseTitle} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(data?.tests ?? []).map((test) => (
            <Link
              key={test.id}
              to="/teach/$courseTitle/$kind/$assessmentId"
              params={{ courseTitle, kind: "test", assessmentId: test.id }}
            >
              <Card className="transition-colors hover:border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {test.title}
                    <Badge variant="secondary">{test.total_mark} marks</Badge>
                  </CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
          {(data?.tests ?? []).length === 0 && (
            <p className="text-muted-foreground">No tests yet.</p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">Enrolled students</h2>
        <Card>
          <CardContent className="pt-6">
            {!students || students.length === 0 ? (
              <p className="text-muted-foreground">No students enrolled yet.</p>
            ) : (
              <ul className="flex flex-col gap-1 text-sm">
                {students.map((s) => (
                  <li key={s.id}>{s.full_name || s.email}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
