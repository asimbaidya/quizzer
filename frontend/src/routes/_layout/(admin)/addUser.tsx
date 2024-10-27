import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/(admin)/addUser')({
  component: () => (
    <div>here Admin will add New Users(admin/teacher/student)</div>
  ),
});
