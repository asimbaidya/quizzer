import { createFileRoute, Outlet } from '@tanstack/react-router';

// Layout Route
export const Route = createFileRoute('/_layout/(teacher)/course')({
  component: () => (
    <div>
      <Outlet />
    </div>
  ),
});
