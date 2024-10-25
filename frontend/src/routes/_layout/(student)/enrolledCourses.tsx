import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/(student)/enrolledCourses')({
  component: () => <div>Here Student will get to view All enrolled Courses</div>,
});
