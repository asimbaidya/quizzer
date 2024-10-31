import { createFileRoute } from '@tanstack/react-router';
import { Container, Heading } from '@chakra-ui/react';

export const Route = createFileRoute(
  '/_layout/(student)/enrolledCourses/test/$courseTitle/$testId'
)({
  component: () => <EnrolledCoursesTestCourseTitleTestId />,
});

function EnrolledCoursesTestCourseTitleTestId() {
  const { courseTitle, testId } = Route.useParams();
  console.log('Route.useParams():', Route.useParams());
  return (
    <Container maxW="full" px={50}>
      <Heading size="lg" textAlign={{ base: 'center', md: 'left' }} py={12}>
        Your Get to See Question of Test {testId} of {courseTitle}
      </Heading>
    </Container>
  );
}
