import { createFileRoute } from '@tanstack/react-router';
import About from '../ui/About';

export const Route = createFileRoute('/about')({
  component: () => <About />,
});
