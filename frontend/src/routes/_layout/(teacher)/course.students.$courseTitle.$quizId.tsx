import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_layout/(teacher)/course/students/$courseTitle/$quizId'
)({
  component: () => (
    <div>Here Teacher will be able to see All Student Report</div>
  ),
});
