import { createFileRoute } from '@tanstack/react-router';
import { Container, Heading } from '@chakra-ui/react';

export const Route = createFileRoute(
  '/_layout/(teacher)/course/test/$courseTitle/$testId'
)({
  component: () => <CourseTestCourseTitleTestId />,
});

function CourseTestCourseTitleTestId() {
  const { courseTitle, testId } = Route.useParams();
  console.log('Route.useParams():', Route.useParams());
  return (
    <Container maxW="full" px={50}>
      <Heading size="lg" textAlign={{ base: 'center', md: 'left' }} py={12}>
        Course: {courseTitle}
        You can Add Question on Test {testId}
      </Heading>
    </Container>
  );
}
