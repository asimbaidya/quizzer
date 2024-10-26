import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/(teacher)/course/student/$courseTitle/$quizId/$studentId')({
  component: () => <div>Here Teacher will able to see individual Student Report</div>,
});
