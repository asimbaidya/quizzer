import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_layout/(student)/enrolledCourse/$courseTitle'
)({
  component: () => (
    <div>
      Here Student will get to View specific courses and link toall quiz under
      that course
    </div>
  ),
});
