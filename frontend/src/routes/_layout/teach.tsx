import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link, redirect } from "@tanstack/react-router"

import { type CoursePublic, TeacherService, UsersService } from "@/client"
import CreateCourseDialog from "@/components/Teacher/CreateCourseDialog"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export const Route = createFileRoute("/_layout/teach")({
  component: TeacherCourses,
  beforeLoad: async () => {
    const user = await UsersService.readUserMe()
    if (user.role !== "teacher" && !user.is_superuser) {
      throw redirect({ to: "/" })
    }
  },
  head: () => ({ meta: [{ title: "Teaching - Quizzer" }] }),
})

function TeacherCourses() {
  const { data: courses, isLoading } = useQuery({
    queryKey: ["teacher-courses"],
    queryFn: () => TeacherService.getCourses(),
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Teaching</h1>
          <p className="text-muted-foreground">Courses you created.</p>
        </div>
        <CreateCourseDialog />
      </div>

      {isLoading ? (
        <Skeleton className="h-28 w-full" />
      ) : !courses || courses.length === 0 ? (
        <p className="text-muted-foreground">
          No courses yet. Create one to start.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course: CoursePublic) => (
            <Link
              key={course.id}
              to="/teach/$courseTitle"
              params={{ courseTitle: course.title }}
            >
              <Card className="transition-colors hover:border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {course.title}
                    <Badge variant="secondary">PIN {course.course_pin}</Badge>
                  </CardTitle>
                  <CardDescription>
                    {course.description || "No description"}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
