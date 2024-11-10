import { createFileRoute, notFound } from '@tanstack/react-router';
import { Container, Heading } from '@chakra-ui/react';
import { useTestQuestions } from '../../../hooks/teacher';
import { CustomError } from '../../../core/request';
import Test from '../../../ui/Teacher/Test';
import { TestQuestions } from '../../../core/types/question';
import Loading from '../../../ui/Common/Loading';

export const Route = createFileRoute(
  '/_layout/(teacher)/course/test/$courseTitle/$testId'
)({
  component: () => {
    const { courseTitle, testId } = Route.useParams();

    const {
      data: testAndQustions,
      isLoading,
      error,
    } = useTestQuestions(courseTitle, Number(testId));

    if (isLoading) {
      return <Loading />;
    }

    if (error) {
      const customError = error as CustomError;
      <div>Error: {customError?.details}</div>;
      throw notFound();
    }

    return <CourseTestCourseTitleTestId testQuestions={testAndQustions} />;
  },
});

function CourseTestCourseTitleTestId({
  testQuestions,
}: {
  testQuestions: TestQuestions | undefined;
}) {
  // console.log('Route.useParams():', Route.useParams());

  const { courseTitle, testId } = Route.useParams();
  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: 'center', md: 'left' }} py={12}>
        Course: {courseTitle}
      </Heading>
      <Test testQuestions={testQuestions} />
    </Container>
  );
}
