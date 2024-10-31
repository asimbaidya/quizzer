import { createFileRoute } from '@tanstack/react-router';
import { Container, Heading } from '@chakra-ui/react';

export const Route = createFileRoute('/_layout/(student)/joinLive')({
  component: () => <JoinLive />,
});

function JoinLive() {
  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: 'center', md: 'left' }} py={12}>
        Wanna Play Game? Join Live but need Secret Sauce for that
      </Heading>
    </Container>
  );
}
