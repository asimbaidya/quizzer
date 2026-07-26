import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"

import { TeacherService } from "@/client"
import AddQuestionDialog from "@/components/Teacher/AddQuestionDialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface TeacherQuestion {
  id: string
  question_type: string
  question_data: {
    question_text: string
    choices?: { text: string; correct: boolean }[] | null
    true_false_answer?: boolean | null
    correct_answer?: string | null
  }
  total_marks: number
}

interface ProgressRow {
  student_id: string
  email: string
  received_marks: number
  weighted_marks: number
  total_attempts: number
  total_possible_marks: number
}

export const Route = createFileRoute(
  "/_layout/teach/$courseTitle/$kind/$assessmentId",
)({
  component: Assessment,
  head: () => ({ meta: [{ title: "Assessment - Quizzer" }] }),
})

function correctAnswerText(q: TeacherQuestion): string {
  const d = q.question_data
  if (
    q.question_type === "single_choice" ||
    q.question_type === "multiple_choice"
  )
    return (d.choices ?? [])
      .filter((c) => c.correct)
      .map((c) => c.text)
      .join(", ")
  if (q.question_type === "true_false") return String(d.true_false_answer)
  return d.correct_answer ?? ""
}

function Assessment() {
  const { courseTitle, kind, assessmentId } = Route.useParams()
  const isQuiz = kind === "quiz"
  const questionsKey = ["teacher-questions", kind, assessmentId]

  const { data: questions, isLoading } = useQuery({
    queryKey: questionsKey,
    queryFn: async () => {
      if (isQuiz) {
        return (await TeacherService.getQuestionsInQuiz({
          courseTitle,
          quizId: assessmentId,
        })) as unknown as TeacherQuestion[]
      }
      const res = (await TeacherService.getQuestionsInTest({
        courseTitle,
        testId: assessmentId,
      })) as unknown as { questions: TeacherQuestion[] }
      return res.questions
    },
  })

  const { data: progress } = useQuery({
    queryKey: ["teacher-progress", kind, assessmentId],
    queryFn: async () =>
      (isQuiz
        ? await TeacherService.getQuizProgress({
            courseTitle,
            quizId: assessmentId,
          })
        : await TeacherService.getTestProgress({
            courseTitle,
            testId: assessmentId,
          })) as unknown as ProgressRow[],
  })

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link
          to="/teach/$courseTitle"
          params={{ courseTitle }}
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Back to {courseTitle}
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <h1 className="text-2xl font-semibold capitalize">
            {kind} questions
          </h1>
          <AddQuestionDialog
            kind={isQuiz ? "quiz" : "test"}
            courseTitle={courseTitle}
            assessmentId={assessmentId}
            queryKey={questionsKey}
          />
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : (
        <div className="flex flex-col gap-3">
          {(questions ?? []).map((q, i) => (
            <Card key={q.id}>
              <CardHeader>
                <CardTitle className="flex items-start justify-between gap-4 text-base">
                  <span>
                    {i + 1}. {q.question_data.question_text}
                  </span>
                  <Badge variant="secondary" className="shrink-0">
                    {q.total_marks} marks
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <span className="capitalize">
                  {q.question_type.replace("_", " ")}
                </span>{" "}
                · Correct: {correctAnswerText(q)}
              </CardContent>
            </Card>
          ))}
          {(questions ?? []).length === 0 && (
            <p className="text-muted-foreground">
              No questions yet. Use “Add question”.
            </p>
          )}
        </div>
      )}

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">Student progress</h2>
        <Card>
          <CardContent className="pt-6">
            {!progress || progress.length === 0 ? (
              <p className="text-muted-foreground">No submissions yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead className="text-right">Raw</TableHead>
                    <TableHead className="text-right">Weighted</TableHead>
                    <TableHead className="text-right">Attempts</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {progress.map((row) => (
                    <TableRow key={row.student_id}>
                      <TableCell>{row.email}</TableCell>
                      <TableCell className="text-right">
                        {row.received_marks}/{row.total_possible_marks}
                      </TableCell>
                      <TableCell className="text-right">
                        {row.weighted_marks.toFixed(1)}
                      </TableCell>
                      <TableCell className="text-right">
                        {row.total_attempts}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
