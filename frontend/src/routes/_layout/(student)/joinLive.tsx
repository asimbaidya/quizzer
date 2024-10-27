import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/(student)/joinLive')({
  component: () => (
    <div>Here Student will be able to join live by giving live Pin</div>
  ),
});
