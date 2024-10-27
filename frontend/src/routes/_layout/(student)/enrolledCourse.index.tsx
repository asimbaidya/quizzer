import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/(student)/enrolledCourse/')({
  component: () => (
    <div>Here Student will get to view link of all enrolled Courses</div>
  ),
});
