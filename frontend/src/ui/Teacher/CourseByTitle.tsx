import {
  Box,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { TeacherQuizAndTest } from '../../core/types/common';
import QuizList from './QuizList';
import TestList from './TestList';
import QuizCreateForm from './forms/QuizCreateForm';
import TestCreateForm from './forms/TestCreateForm';

interface Prop {
  data: TeacherQuizAndTest | undefined;
}

export default function CourseByTitle({ data }: Prop) {
  console.log(data);
  return (
    <Tabs variant="enclosed" colorScheme="purple">
      <TabList>
        <Tab>Quizzes</Tab>
        <Tab>Tests</Tab>
        <Tab>Create Quiz</Tab>
        <Tab>Create Test</Tab>
      </TabList>
      <TabPanels>
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
            {data?.quizzes && data.quizzes.length > 0 ? (
              <QuizList quizzes={data.quizzes} />
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
            {data?.tests && data.tests.length > 0 ? (
              <TestList tests={data.tests} />
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
  );
}
