import { createFileRoute } from '@tanstack/react-router';
import Welcome from '../../ui/Welcome';

export const Route = createFileRoute('/_layout/')({
  component: () => <Welcome />,
});
