import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/(admin)/dashboard')({
  component: () => <div>Here Admin will get an overview of System</div>,
});
