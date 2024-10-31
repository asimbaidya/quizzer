import { createFileRoute } from '@tanstack/react-router';
import { Container, Heading } from '@chakra-ui/react';

export const Route = createFileRoute('/_layout/(admin)/addUser')({
  component: () => <AdminAddUser />,
});

function AdminAddUser() {
  return (
    <Container maxW="full" px={50}>
      <Heading size="lg" textAlign={{ base: 'center', md: 'left' }} py={12}>
        Place to Do Nepotism
      </Heading>
    </Container>
  );
}
