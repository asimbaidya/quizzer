import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/(teacher)/course/student/$courseTitle')({
  component: () => <div>Here Teacher will be able to manage all Enrolled Students</div>,
});