import { createFileRoute } from '@tanstack/react-router';
import { Container, Heading } from '@chakra-ui/react';

export const Route = createFileRoute(
  '/_layout/(teacher)/course/quiz/$courseTitle/$quizId'
)({
  component: () => <QuizCourseQuizCourseTitleStudentId />,
});

function QuizCourseQuizCourseTitleStudentId() {
  const { courseTitle, quizId } = Route.useParams();
  console.log('Route.useParams():', Route.useParams());
  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: 'center', md: 'left' }} py={12}>
        Course: {courseTitle}
        You can Add Question on Quiz {quizId}
      </Heading>
    </Container>
  );
}
