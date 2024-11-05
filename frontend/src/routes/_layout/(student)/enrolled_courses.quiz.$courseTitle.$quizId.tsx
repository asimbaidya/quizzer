import { createFileRoute } from '@tanstack/react-router';
import { Container, Heading } from '@chakra-ui/react';
import TakeQuiz from '../../../ui/Student/TakeQuiz';
import { useQuizQuestions } from '../../../hooks/student';
import { Text } from '@chakra-ui/react';

export const Route = createFileRoute(
  '/_layout/(student)/enrolled_courses/quiz/$courseTitle/$quizId'
)({
  component: () => <EnrolledCoursesQuizCourseTitleQuizId />,
});

function EnrolledCoursesQuizCourseTitleQuizId() {
  const { courseTitle, quizId } = Route.useParams();

  const {
    data: questions,
    error,
    isLoading,
  } = useQuizQuestions(courseTitle, Number(quizId));

  console.log(questions);
  return (
    <Container maxW="full">
      <Heading size="4lg" textAlign={{ base: 'center', md: 'left' }} py={12}>
        {courseTitle} : {quizId}
      </Heading>
      {questions && <TakeQuiz questionWithSubmission={questions} />}
    </Container>
  );
}
