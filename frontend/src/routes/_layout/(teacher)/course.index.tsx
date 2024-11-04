import { createFileRoute } from '@tanstack/react-router';
import { Container, Heading } from '@chakra-ui/react';
import { useCreatedCourses } from '../../../hooks/teacher';
import CourseList from '../../../ui/Teacher/CourseList';
import { Box, Text } from '@chakra-ui/react';

export const Route = createFileRoute('/_layout/(teacher)/course/')({
  component: () => <Course />,
});

function Course() {
  console.log('Route.useParams():', Route.useParams());

  const { data, isLoading } = useCreatedCourses();

  return (
    <>
      <Container maxW="full">
        <Heading size="lg" textAlign={{ base: 'center', md: 'left' }} py={12}>
          All the Course Courses
        </Heading>

        {data?.length === 0 || data === undefined ? (
          <Box>
            <Text fontSize="2xl" color="white">
              No Courses Found
            </Text>
          </Box>
        ) : (
          <CourseList courses={data} />
        )}
      </Container>
    </>
  );
}
