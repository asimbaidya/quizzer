import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_layout/(student)/enrolledCourses/test/$courseTitle/$testId',
)({
  component: () => (
    <div>
      Hello /_layout/(student)/enrolledCourses/test/$courseTitle/$testId!
    </div>
  ),
})
