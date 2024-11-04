import { createFileRoute } from '@tanstack/react-router';
import About from '../ui/About';

export const Route = createFileRoute('/about')({
  component: () => <Container />,
});

const Container = () => {
  return (
    <div>
      <About />
    </div>
  );
};
