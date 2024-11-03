import { createFileRoute } from '@tanstack/react-router';
import { Container, Heading } from '@chakra-ui/react';
import { useTestQuestions } from '../../../hooks/student';
import Test from '../../../ui/Student/Test';

export const Route = createFileRoute(
  '/_layout/(student)/enrolled_courses/test/$courseTitle/$testId'
)({
  component: () => <EnrolledCoursesTestCourseTitleTestId />,
});

function EnrolledCoursesTestCourseTitleTestId() {
  const { courseTitle, testId } = Route.useParams();
  console.log('courseTitle:', courseTitle);
  const {
    data: questions,
    error,
    isLoading,
  } = useTestQuestions(courseTitle, Number(testId));
  console.log(error, isLoading, questions);
  console.log('Route.useParams():', Route.useParams());
  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: 'center', md: 'left' }} py={12}>
        {!questions && isLoading && 'Loading...'}
        {!questions && `No Question found for test ${testId}`}
      </Heading>

      {questions && <Test questionWithSubmission={questions} />}
    </Container>
  );
}
