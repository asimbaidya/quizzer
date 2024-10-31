import { createFileRoute } from '@tanstack/react-router';
import { Container, Heading } from '@chakra-ui/react';

export const Route = createFileRoute(
  '/_layout/(student)/enrolledCourses/$courseTitle'
)({
  component: () => <EnrolledCoursesCourseTitle />,
});

function EnrolledCoursesCourseTitle() {
  const { courseTitle } = Route.useParams();
  console.log('Route.useParams():', Route.useParams());
  return (
    <Container maxW="full" px={50}>
      <Heading size="lg" textAlign={{ base: 'center', md: 'left' }} py={12}>
        Here Student will get to View courses {courseTitle}
        ann the Test and Quiz link in course {courseTitle}
        that course
      </Heading>
    </Container>
  );
}
