import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/(student)/enrolledCourses/$courseTitle')({
  component: () => <div>Here Student will get to View specific courses</div>,
});
