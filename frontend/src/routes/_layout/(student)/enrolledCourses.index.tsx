import { Box, Text } from '@chakra-ui/react';
import { useEnrolledCourses } from '../../../hooks/student';
import { Container, Heading } from '@chakra-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import CourseList from '../../../ui/Student/CourseList';

export const Route = createFileRoute('/_layout/(student)/enrolledCourses/')({
  component: () => <EnrolledCourses />,
});

export default function EnrolledCourses() {
  const { data: courses, error, isLoading } = useEnrolledCourses();

  return (
    <Container maxW="full" px={50}>
      <Heading size="lg" textAlign={{ base: 'center', md: 'left' }} py={12}>
        Courses
      </Heading>
      {courses?.length === 0 || courses === undefined ? (
        <Box>
          <Text fontSize="2xl" color="white">
            No Courses Found
          </Text>
        </Box>
      ) : (
        <CourseList courses={courses} />
      )}
    </Container>
  );
}
