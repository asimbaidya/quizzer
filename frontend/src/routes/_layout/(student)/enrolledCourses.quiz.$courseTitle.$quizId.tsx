import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_layout/(student)/enrolledCourses/quiz/$courseTitle/$quizId',
)({
  component: () => (
    <div>Here Student will be Able to attempt/view-answer of quiz</div>
  ),
})