import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_layout/(teacher)/course/test/$courseTltle/$testId'
)({
  component: () => (
    <div>Hello /_layout/(teacher)/course/test/$courseTltle!</div>
  ),
});
