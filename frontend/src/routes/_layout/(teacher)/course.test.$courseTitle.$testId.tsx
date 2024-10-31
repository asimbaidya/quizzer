import { createFileRoute, notFound } from '@tanstack/react-router';
import { Container, Heading } from '@chakra-ui/react';
import { useTestQuestions } from '../../../hooks/teacher';
import { CustomError } from '../../../core/request';

export const Route = createFileRoute(
  '/_layout/(teacher)/course/test/$courseTitle/$testId'
)({
  component: () => {
    const { courseTitle, testId } = Route.useParams();
    const { data, isLoading, error } = useTestQuestions(courseTitle, testId);

    if (isLoading) return <div>Loading...</div>;
    if (error) {
      const customError = error as CustomError;
      throw notFound();
      // return <div>Error: {customError?.details}</div>;
    }

    // console.log('data', data);
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
        View all The Question on Test {testId}
        You can Add Question on Test {testId}
        {questions?.map((question) => (
          <p size="sm" key={question.id}>
            {question.id}
          </p>
        ))}
        {questions.length !== 0 || 'No Questions'}
      </Heading>
    </Container>
  );
}
