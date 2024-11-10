import { createFileRoute } from '@tanstack/react-router';
import { Container, Heading } from '@chakra-ui/react';
import { useTestQuestions } from '../../../hooks/student';
import TakeTest from '../../../ui/Student/TakeTest';
import Loading from '../../../ui/Common/Loading';

export const Route = createFileRoute(
  '/_layout/(student)/enrolled_courses/test/$courseTitle/$testId'
)({
  component: () => <EnrolledCoursesTestCourseTitleTestId />,
});

function EnrolledCoursesTestCourseTitleTestId() {
  const { courseTitle, testId } = Route.useParams();

  const {
    data: questions,
    error,
    isLoading,
  } = useTestQuestions(courseTitle, Number(testId));

  if (isLoading) {
    return <Loading />;
  }
  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: 'center', md: 'left' }} py={12}>
        {!questions && isLoading && 'Loading...'}
        {!questions && `No Question found for test ${testId}`}
      </Heading>

      {questions && <TakeTest questionWithSubmission={questions} />}
    </Container>
  );
}
