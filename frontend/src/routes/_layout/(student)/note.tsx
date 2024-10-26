import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/(student)/note')({
  component: () => <div>Here User can manage Notes</div>,
});
