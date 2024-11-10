import { createFileRoute } from '@tanstack/react-router';
import { Container, Heading } from '@chakra-ui/react';
import TakeQuiz from '../../../ui/Student/TakeQuiz';
import { useQuizQuestions } from '../../../hooks/student';
import Loading from '../../../ui/Common/Loading';

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

  if (isLoading) {
    return <Loading />;
  }

  // console.log(questions);
  return (
    <Container maxW="full">
      <Heading size="4lg" textAlign={{ base: 'center', md: 'left' }} py={12}>
        {courseTitle} : {quizId}
      </Heading>
      {questions && <TakeQuiz questionWithSubmission={questions} />}
    </Container>
  );
}
