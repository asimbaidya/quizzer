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

const QuizAndTests = ({ data }: { data: TeacherQuizAndTest | undefined }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      w="100%"
      h="100%"
      p={4}
    >
      {data === undefined ? (
        <Heading size="md">No Quizzes and Tests available</Heading>
      ) : null}

      {data?.quizzes && data.quizzes.length > 0 ? (
        <QuizList quizzes={data.quizzes} />
      ) : (
        <Heading size="md">No Quizzes available</Heading>
      )}
      {data?.tests && data.tests.length > 0 ? (
        <TestList tests={data.tests} />
      ) : (
        <Heading size="md">No Tests available</Heading>
      )}
    </Box>
  );
};
const CreateQuiz = () => {
  return <div>Create Quiz</div>;
};
const CreateTest = () => {
  return <div>Create Test</div>;
};

const tabsConfig = [
  { title: 'QuizAndTests', component: QuizAndTests },
  { title: 'Create Quiz', component: CreateQuiz },
  { title: 'Create Test', component: CreateTest },
];

interface Prop {
  data: TeacherQuizAndTest | undefined;
}

export default function CourseByTitle({ data }: Prop) {
  console.log(data);
  return (
    <Tabs variant="enclosed">
      <TabList>
        <Tab>Course Materials</Tab>
        <Tab>Create Quiz</Tab>
        <Tab>Create Test</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <QuizAndTests data={data} />
        </TabPanel>
        <TabPanel>
          <CreateQuiz />
        </TabPanel>
        <TabPanel>
          <CreateTest />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
