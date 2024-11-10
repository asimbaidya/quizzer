import { createFileRoute } from '@tanstack/react-router';
import { Container, Heading } from '@chakra-ui/react';
import ShowTestProgress from '../../../ui/Teacher/ShowTestProgress';
import { useTestStudentProgress } from '../../../hooks/teacher';
import Loading from '../../../ui/Common/Loading';

export const Route = createFileRoute(
  '/_layout/(teacher)/course/students/test/$courseTitle/$testId'
)({
  component: () => <CourseStudentsTestCourseTitleQuizId />,
});

function CourseStudentsTestCourseTitleQuizId() {
  const { courseTitle, testId } = Route.useParams();

  const { data: testStudentProgress, isLoading } = useTestStudentProgress(
    courseTitle,
    Number(testId)
  );

  if (isLoading) {
    return <Loading />;
  }

  // console.log('Route.useParams():', Route.useParams());

  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: 'center', md: 'left' }} py={12}>
        Course: {courseTitle}
        You can See All student's Progress for Test {testId}
      </Heading>
      <ShowTestProgress progressData={testStudentProgress || []} />
    </Container>
  );
}
