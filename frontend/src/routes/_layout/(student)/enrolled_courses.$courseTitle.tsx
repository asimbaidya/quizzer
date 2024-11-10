import { createFileRoute } from '@tanstack/react-router';
import { Container, Heading } from '@chakra-ui/react';
import CourseQuizAndTests from '../../../ui/Student/CourseQuizAndTests';
import { useCourseQuizzesAndTests } from '../../../hooks/student';
import Loading from '../../../ui/Common/Loading';

export const Route = createFileRoute(
  '/_layout/(student)/enrolled_courses/$courseTitle'
)({
  component: () => <EnrolledCoursesCourseTitle />,
});

function EnrolledCoursesCourseTitle() {
  const { courseTitle } = Route.useParams();

  const {
    data: quizzesAndTests,
    error,
    isLoading,
  } = useCourseQuizzesAndTests(courseTitle);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Container maxW="full">
      <Heading size="4xl" textAlign={{ base: 'center', md: 'left' }} py={12}>
        {courseTitle}
      </Heading>
      {quizzesAndTests === undefined ? (
        <h2>This Course is Empty Wait for Quiz/Tests</h2>
      ) : (
        <CourseQuizAndTests quizandtests={quizzesAndTests} />
      )}
    </Container>
  );
}
