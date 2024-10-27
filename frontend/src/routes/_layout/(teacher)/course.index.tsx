import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/(teacher)/course/')({
  component: () => (
    <div>
      Here Teacher will get to view/create all create courses one Created
    </div>
  ),
});
