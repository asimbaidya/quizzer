import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Container, Heading } from '@chakra-ui/react';

export const Route = createFileRoute('/_layout/(student)/(notes)/note')({
  component: () => <Note />,
});

function Note() {
  // console.log('Route.useParams():', Route.useParams()); // ;
  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: 'center', md: 'left' }} py={12}>
        User Wotes
      </Heading>
      <Outlet />
    </Container>
  );
}
