import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/(teacher)/course/$courseTitle')({
  component: () => <div>Here Teacher can Edit(add quiz) Course</div>,
});
