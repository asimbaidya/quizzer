import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_layout/(teacher)/course/quiz/$courseTltle/$studentId'
)({
  component: () => (
    <div>Hello /_layout/(teacher)/course/quiz/$courseTltle!</div>
  ),
});
