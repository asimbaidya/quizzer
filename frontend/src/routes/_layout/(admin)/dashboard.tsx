import { createFileRoute } from '@tanstack/react-router';
import { Container, Heading } from '@chakra-ui/react';

export const Route = createFileRoute('/_layout/(admin)/dashboard')({
  component: () => <DashBoard />,
});

function DashBoard() {
  console.log('Route.useParams():', Route.useParams());
  return (
    <Container maxW="full">
      <Heading
        size="lg"
        textAlign={{ base: 'center', md: 'left' }}
        py={12}
      ></Heading>
      Here You Flex with data
    </Container>
  );
}
