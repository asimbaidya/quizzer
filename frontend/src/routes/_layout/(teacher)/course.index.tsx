import { createFileRoute } from '@tanstack/react-router';
import { Container, Heading } from '@chakra-ui/react';

export const Route = createFileRoute('/_layout/(teacher)/course/')({
  component: () => <Course />,
});

function Course() {
  console.log('Route.useParams():', Route.useParams());
  return (
    <>
      <Container maxW="full">
        <Heading size="lg" textAlign={{ base: 'center', md: 'left' }} py={12}>
          All the Course Courses
        </Heading>
      </Container>
    </>
  );
}
