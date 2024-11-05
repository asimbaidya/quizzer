import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { AllQuizzesTests } from '../../core/types/common';
import QuizList from './QuizList';
import TestList from './TestList';

interface CourseProps {
  quizandtests: AllQuizzesTests;
}

export default function Course({ quizandtests }: CourseProps) {
  return (
    <>
      <Tabs variant="enclosed">
        <TabList>
          <Tab fontSize={'lg'}>Quizzes</Tab>
          <Tab fontSize={'lg'}>Tests</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <QuizList quizzes={quizandtests.quizzes} />
          </TabPanel>
          <TabPanel>
            <TestList tests={quizandtests.tests} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
