import { Container, Heading } from '@chakra-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import CourseByTitle from '../../../ui/Teacher/CourseByTitle';
import { useCourseDetails } from '../../../hooks/teacher';

export const Route = createFileRoute('/_layout/(teacher)/course/$courseTitle')({
  component: () => <CourseCourseTitle />,
});

function CourseCourseTitle() {
  const { courseTitle } = Route.useParams();

  const {
    data: quizAndTests,
    isLoading,
    isError,
  } = useCourseDetails(courseTitle);

  console.log('Route.useParams():', Route.useParams());
  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: 'center', md: 'left' }} py={12}>
        Course: {courseTitle} - Create Quz and Test Here
      </Heading>
      <CourseByTitle data={quizAndTests} />
    </Container>
  );
}
