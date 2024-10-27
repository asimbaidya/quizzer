import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/(teacher)/hostLive')({
  component: () => (
    <div>
      Here Teacher will see all created quiz and by selecting one, can host live
    </div>
  ),
});
