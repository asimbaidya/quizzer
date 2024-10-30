import { Container, Heading } from '@chakra-ui/react';
export default function About() {
  return (
    <Container maxW="full" px={50}>
      <Heading size="lg" textAlign={{ base: 'center', md: 'left' }} py={12}>
        Aboout
      </Heading>
    </Container>
  );
}
