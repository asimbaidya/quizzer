import { createFileRoute } from '@tanstack/react-router';
import { Container, Heading } from '@chakra-ui/react';
import Quiz from '../../../ui/Teacher/Quiz';
import { useQuizQuestions } from '../../../hooks/teacher';
import Loading from '../../../ui/Common/Loading';

export const Route = createFileRoute(
  '/_layout/(teacher)/course/quiz/$courseTitle/$quizId'
)({
  component: () => <QuizCourseQuizCourseTitleStudentId />,
});

function QuizCourseQuizCourseTitleStudentId() {
  const { courseTitle, quizId } = Route.useParams();

  const {
    data: quizQuestions,
    isLoading,
    isError,
  } = useQuizQuestions(courseTitle, Number(quizId));

  if (isLoading) {
    return <Loading />;
  }

  const handleCreateQuizQuestion = (questionData: any) => {
    const signal = new AbortController().signal;
  };
  // console.log('Route.useParams():', Route.useParams());
  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: 'center', md: 'left' }} py={12}>
        Course: {courseTitle}
        You can Add Question on Quiz {quizId}
      </Heading>
      <Quiz questions={quizQuestions} />
    </Container>
  );
}
