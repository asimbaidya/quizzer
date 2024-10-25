import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/(student)/enrolledCoursses/')({
  component: () => <div>Here Student will get to view all enrolled Courses</div>,
});
