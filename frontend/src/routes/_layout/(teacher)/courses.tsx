import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/(teacher)/courses')({
  component: () => (
    <div>
      <Outlet />
    </div>
  ),
});
