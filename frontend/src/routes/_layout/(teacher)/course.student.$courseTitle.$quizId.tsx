import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/(teacher)/course/student/$courseTitle/$quizId')({
  component: () => <div>Here Teacher will be able to see All Student Report</div>,
});
