import { createFileRoute } from '@tanstack/react-router';
import Welcome from '../../ui/Common/Welcome';

export const Route = createFileRoute('/_layout/')({
  component: () => <Welcome />,
});
