import { createFileRoute } from '@tanstack/react-router';
import { Container, Heading } from '@chakra-ui/react';

export const Route = createFileRoute('/_layout/(student)/note')({
  component: () => <Note />,
});

function Note() {
  console.log('Route.useParams():', Route.useParams());
  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: 'center', md: 'left' }} py={12}>
        Take Note Make Note Save Note
      </Heading>
    </Container>
  );
}
