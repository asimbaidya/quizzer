import { Container, Heading } from '@chakra-ui/react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/(teacher)/course/$courseTitle')({
  component: () => <CourseCourseTitle />,
});

function CourseCourseTitle() {
  const { courseTitle } = Route.useParams();
  console.log('Route.useParams():', Route.useParams());
  return (
    <Container maxW="full" px={50}>
      <Heading size="lg" textAlign={{ base: 'center', md: 'left' }} py={12}>
        Hello {courseTitle}
        Create Quz and Test Here
      </Heading>
    </Container>
  );
}
