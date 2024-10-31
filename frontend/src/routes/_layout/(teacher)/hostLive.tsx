import { createFileRoute } from '@tanstack/react-router';
import { Container, Heading } from '@chakra-ui/react';
// NOT SURE

export const Route = createFileRoute('/_layout/(teacher)/hostLive')({
  component: () => <HostLive />,
});

function HostLive() {
  console.log('Route.useParams():', Route.useParams());
  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: 'center', md: 'left' }} py={12}>
        Your Start a Live Session Here
      </Heading>
    </Container>
  );
}
