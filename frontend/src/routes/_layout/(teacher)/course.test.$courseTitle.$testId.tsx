import { createFileRoute, notFound } from '@tanstack/react-router';
import { Container, Heading } from '@chakra-ui/react';
import { useTestQuestions } from '../../../hooks/teacher';
import { CustomError } from '../../../core/request';
import Test from '../../../ui/Teacher/Test';

export const Route = createFileRoute(
  '/_layout/(teacher)/course/test/$courseTitle/$testId'
)({
  component: () => {
    const { courseTitle, testId } = Route.useParams();
    const { data, isLoading, error } = useTestQuestions(
      courseTitle,
      Number(testId)
    );

    if (isLoading) return <div>Loading...</div>;
    if (error) {
      const customError = error as CustomError;
      <div>Error: {customError?.details}</div>;
      throw notFound();
    }

    return <CourseTestCourseTitleTestId questions={data} />;
  },
});

function CourseTestCourseTitleTestId({ questions }) {
  console.log('Route.useParams():', Route.useParams());
  const { courseTitle, testId } = Route.useParams();
  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: 'center', md: 'left' }} py={12}>
        Course: {courseTitle}
      </Heading>
      <Test />
    </Container>
  );
}
