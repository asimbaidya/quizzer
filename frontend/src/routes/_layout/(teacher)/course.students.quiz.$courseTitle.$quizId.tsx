import { createFileRoute } from '@tanstack/react-router';
import { Container, Heading } from '@chakra-ui/react';
import ShowQuizProgress from '../../../ui/Teacher/ShowQuizProgress';
import { useQuizStudentProgress } from '../../../hooks/teacher';
import Loading from '../../../ui/Common/Loading';

export const Route = createFileRoute(
  '/_layout/(teacher)/course/students/quiz/$courseTitle/$quizId'
)({
  component: () => <CourseStudentsTestCourseTitleQuizId />,
});

function CourseStudentsTestCourseTitleQuizId() {
  const { courseTitle, quizId } = Route.useParams();
  // console.log('Route.useParams():', Route.useParams());

  const { data: quizStudentProgress, isLoading } = useQuizStudentProgress(
    courseTitle,
    Number(quizId)
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: 'center', md: 'left' }} py={12}>
        Course: {courseTitle}
        You can See All student's Progress for Quiz {quizId}
      </Heading>
      <ShowQuizProgress progressData={quizStudentProgress || []} />
    </Container>
  );
}
