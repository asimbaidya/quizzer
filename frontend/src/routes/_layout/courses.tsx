import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link, redirect } from "@tanstack/react-router"

import { type CoursePublic, StudentService, UsersService } from "@/client"
import EnrollDialog from "@/components/Student/EnrollDialog"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export const Route = createFileRoute("/_layout/courses")({
  component: StudentCourses,
  beforeLoad: async () => {
    const user = await UsersService.readUserMe()
    if (user.role !== "student") {
      throw redirect({ to: "/" })
    }
  },
  head: () => ({ meta: [{ title: "My Courses - Quizzer" }] }),
})

function StudentCourses() {
  const { data: courses, isLoading } = useQuery({
    queryKey: ["enrolled-courses"],
    queryFn: () => StudentService.getEnrolledCourses(),
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">My Courses</h1>
          <p className="text-muted-foreground">Courses you are enrolled in.</p>
        </div>
        <EnrollDialog />
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : !courses || courses.length === 0 ? (
        <p className="text-muted-foreground">
          You aren't enrolled in any courses yet. Use “Enroll in a course”.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course: CoursePublic) => (
            <Link
              key={course.id}
              to="/courses/$courseTitle"
              params={{ courseTitle: course.title }}
            >
              <Card className="transition-colors hover:border-primary">
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
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
