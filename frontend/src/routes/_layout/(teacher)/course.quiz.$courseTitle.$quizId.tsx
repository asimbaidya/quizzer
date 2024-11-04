import { createFileRoute } from '@tanstack/react-router';
import { Container, Heading } from '@chakra-ui/react';
import Quiz from '../../../ui/Teacher/Quiz';
import { mutationCreateQuizQuestion } from '../../../hooks/teacher';

export const Route = createFileRoute(
  '/_layout/(teacher)/course/quiz/$courseTitle/$quizId'
)({
  component: () => <QuizCourseQuizCourseTitleStudentId />,
});

function QuizCourseQuizCourseTitleStudentId() {
  const createQuizQuestionMutation = mutationCreateQuizQuestion();
  const { courseTitle, quizId } = Route.useParams();

  const handleCreateQuizQuestion = (questionData: any) => {
    const signal = new AbortController().signal;
    createQuizQuestionMutation.mutate({
      courseTitle,
      quizId: parseInt(quizId),
      questionData,
      signal,
    });
  };
  console.log('Route.useParams():', Route.useParams());
  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: 'center', md: 'left' }} py={12}>
        Course: {courseTitle}
        You can Add Question on Quiz {quizId}
      </Heading>
      <Quiz onQuizQuestionCreate={handleCreateQuizQuestion} />
    </Container>
  );
}
