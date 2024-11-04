import { createFileRoute } from '@tanstack/react-router';
import { Container, Heading } from '@chakra-ui/react';
import { useCreatedCourses } from '../../../hooks/teacher';
import CourseList from '../../../ui/Teacher/CourseList';
import { Box, Text } from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import CourseCreateForm from '../../../ui/Teacher/forms/CourseCreateForm';

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
          Course Dashboard
        </Heading>

        <Tabs variant="enclosed">
          <TabList>
            <Tab>Existing Courses</Tab>
            <Tab>Add New</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {data?.length === 0 || data === undefined ? (
                <Box>
                  <Text fontSize="2xl" color="white">
                    No Courses Found
                  </Text>
                </Box>
              ) : (
                <CourseList courses={data} />
              )}
            </TabPanel>
            <TabPanel>
              <CourseCreateForm />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </>
  );
}
