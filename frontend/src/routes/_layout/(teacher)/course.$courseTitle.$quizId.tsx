import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/(teacher)/course/$courseTitle/$quizId')({
  component: () => <div>Here Teacher will be able to Update/View Quiz</div>,
});
