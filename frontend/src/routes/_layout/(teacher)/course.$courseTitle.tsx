import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { Container, Heading } from '@chakra-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import { useCourseDetails, useEnrolledStudents } from '../../../hooks/teacher';
import ShowEnrolledStudents from '../../../ui/Teacher/ShowEnrolledStudents';

import TestList from '../../../ui/Teacher/TestList';
import QuizList from '../../../ui/Teacher/QuizList';
import TestCreateForm from '../../../ui/Teacher/forms/TestCreateForm';
import QuizCreateForm from '../../../ui/Teacher/forms/QuizCreateForm';

export const Route = createFileRoute('/_layout/(teacher)/course/$courseTitle')({
  component: () => <CourseCourseTitle />,
});

function CourseCourseTitle() {
  const { courseTitle } = Route.useParams();
  console.log('Route.useParams():', Route.useParams());

  const {
    data: quizAndTests,
    isLoading,
    isError,
  } = useCourseDetails(courseTitle);

  const { data: students } = useEnrolledStudents(courseTitle);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: 'center', md: 'left' }} py={12}>
        Course: {courseTitle} - Create Quz and Test Here
      </Heading>
      <Tabs variant="enclosed" colorScheme="purple">
        <TabList>
          <Tab>Enrolled Students</Tab>
          <Tab>Quizzes</Tab>
          <Tab>Tests</Tab>
          <Tab>Create Quiz</Tab>
          <Tab>Create Test</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <ShowEnrolledStudents students={students || []} />
          </TabPanel>
          <TabPanel>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              w="100%"
              h="100%"
              p={4}
            >
              {quizAndTests?.quizzes && quizAndTests.quizzes.length > 0 ? (
                <QuizList quizzes={quizAndTests.quizzes} />
              ) : (
                <Heading size="md">No Quizzes available</Heading>
              )}
            </Box>
          </TabPanel>
          <TabPanel>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              w="100%"
              h="100%"
              p={4}
            >
              {quizAndTests?.tests && quizAndTests.tests.length > 0 ? (
                <TestList tests={quizAndTests.tests} />
              ) : (
                <Heading size="md">No Tests available</Heading>
              )}
            </Box>
          </TabPanel>
          <TabPanel>
            <QuizCreateForm />
          </TabPanel>
          <TabPanel>
            <TestCreateForm />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}
