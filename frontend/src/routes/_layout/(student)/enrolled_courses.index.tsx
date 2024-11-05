import { Box, Text } from '@chakra-ui/react';
import { useEnrolledCourses } from '../../../hooks/student';
import { Container, Heading } from '@chakra-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import CourseList from '../../../ui/Student/CourseList';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import EnrollForm from '../../../ui/Student/EnrollForm';

export const Route = createFileRoute('/_layout/(student)/enrolled_courses/')({
  component: () => <EnrolledCourses />,
});

export default function EnrolledCourses() {
  const { data: courses, error, isLoading } = useEnrolledCourses();

  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: 'center', md: 'left' }} py={12}>
        Courses
      </Heading>
      <Tabs variant="enclosed">
        <TabList>
          <Tab>Enrolled Courses</Tab>
          <Tab>Enroll to New Course</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            {courses?.length === 0 || courses === undefined ? (
              <Box>
                <Text fontSize="2xl" color="white">
                  No Courses Found
                </Text>
              </Box>
            ) : (
              <CourseList courses={courses} />
            )}
          </TabPanel>
          <TabPanel>
            <EnrollForm />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}
