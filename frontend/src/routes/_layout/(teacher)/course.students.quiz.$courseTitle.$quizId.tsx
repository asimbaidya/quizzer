import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_layout/(teacher)/course/students/quiz/$courseTitle/$quizId'
)({
  component: () => (
    <div>
      Hello /_layout/(teacher)/course/students/test/$courseTitle/quizId!
    </div>
  ),
});
