import { createFileRoute } from '@tanstack/react-router';
import { Container, Heading } from '@chakra-ui/react';

export const Route = createFileRoute(
  '/_layout/(student)/enrolledCourses/quiz/$courseTitle/$quizId'
)({
  component: () => <EnrolledCoursesQuizCourseTitleQuizId />,
});

function EnrolledCoursesQuizCourseTitleQuizId() {
  const { courseTitle, quizId } = Route.useParams();
  console.log('Route.useParams():', Route.useParams());
  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: 'center', md: 'left' }} py={12}>
        Your Get to See Question of Quiz {quizId} of {courseTitle}
      </Heading>
    </Container>
  );
}
