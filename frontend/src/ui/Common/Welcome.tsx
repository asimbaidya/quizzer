import { Container, Heading } from '@chakra-ui/react';
export default function Welcome() {
  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: 'center', md: 'left' }} py={12}>
        Welcome
      </Heading>
    </Container>
  );
}
