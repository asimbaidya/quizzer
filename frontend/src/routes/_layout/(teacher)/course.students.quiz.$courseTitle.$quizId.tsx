import { createFileRoute } from '@tanstack/react-router';
import { Container, Heading } from '@chakra-ui/react';

export const Route = createFileRoute(
  '/_layout/(teacher)/course/students/quiz/$courseTitle/$quizId'
)({
  component: () => <CourseStudentsTestCourseTitleQuizId />,
});

function CourseStudentsTestCourseTitleQuizId() {
  const { courseTitle, quizId } = Route.useParams();
  console.log('Route.useParams():', Route.useParams());
  return (
    <Container maxW="full" px={50}>
      <Heading size="lg" textAlign={{ base: 'center', md: 'left' }} py={12}>
        Course: {courseTitle}
        You can See All student's Progress for Quiz {quizId}
      </Heading>
    </Container>
  );
}
