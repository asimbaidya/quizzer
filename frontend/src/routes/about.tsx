import { createFileRoute } from '@tanstack/react-router';
import About from '../ui/Common/About';
import Loading from '../ui/Common/Loading';

export const Route = createFileRoute('/about')({
  component: () => <Container />,
});

const Container = () => {
  return (
    <div>
      <About />
      <Loading />
    </div>
  );
};
