import { createFileRoute } from '@tanstack/react-router';
import About from '../ui/Common/About';

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
