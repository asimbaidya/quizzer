import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/(teacher)/course/$courseTltle')({
  component: () => <div>Here Teacher can View all the Quiz/Test under a Course</div>,
});
