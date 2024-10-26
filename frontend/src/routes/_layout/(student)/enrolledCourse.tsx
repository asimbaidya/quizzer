import { createFileRoute, Outlet } from '@tanstack/react-router';

// Layout Route
export const Route = createFileRoute('/_layout/(student)/enrolledCourse')({
  component: () => (
    <div>
      <Outlet />
    </div>
  ),
});