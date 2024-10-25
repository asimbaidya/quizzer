import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/(student)/enrolledCourses')({
  component: () => (
    <div>
      <Outlet />
    </div>
  ),
});
