import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_layout/(teacher)/course/students/test/$courseTitle/$testId'
)({
  component: () => (
    <div>
      Hello /_layout/(teacher)/course/students/test/$courseTitle/$testId!
    </div>
  ),
});
