import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/(teacher)/courses')({
  component: () => <div>Here Teacher will get to view all create courses</div>,
});
