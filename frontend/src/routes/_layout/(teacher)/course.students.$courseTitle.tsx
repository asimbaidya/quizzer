import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_layout/(teacher)/course/students/$courseTitle'
)({
  component: () => <CourseStudentsCourseTitle />,
});

import { Container, Heading } from '@chakra-ui/react';

function CourseStudentsCourseTitle() {
  const { courseTitle } = Route.useParams();
  console.log('Route.useParams():', Route.useParams());
  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: 'center', md: 'left' }} py={12}>
        Course: {courseTitle}
        All the Enrolled Student off Course {courseTitle}
      </Heading>
    </Container>
  );
}
