import {
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { useParams } from '@tanstack/react-router';
import AddMultipleChoiceQuestion from './questions_create/AddMultipleChoiceQuestion';
import AddSingleChoiceQuestion from './questions_create/AddSingleChoiceQuestion';
import AddUserInputQuestion from './questions_create/AddUserInputQuestion';
import AddTrueFalseQuestion from './questions_create/AddTrueFalseQuestion';
import ViewTestQuestions from './question_view/ViewTestQuestions';
import { Question } from '../../core/types/question';

export default function Test({
  questions,
}: {
  questions: Question[] | undefined;
}) {
  const { courseTitle, testId } = useParams({
    from: '/_layout/(teacher)/course/test/$courseTitle/$testId',
  });
  const apiEndPoint = `/API/teacher/course/test/${courseTitle}/${testId}`;

  return (
    <Tabs variant="enclosed">
      <TabList>
        <Tab>View Test Questions</Tab>
        <Tab>Add Multiple Choice</Tab>
        <Tab>Add Single Choice</Tab>
        <Tab>Add User Input</Tab>
        <Tab>Add True False</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          {questions ? (
            <ViewTestQuestions questions={questions} />
          ) : (
            <Heading
              size="lg"
              textAlign={{ base: 'center', md: 'left' }}
              py={12}
            >
              No Questions Found
            </Heading>
          )}
        </TabPanel>
        <TabPanel>
          <AddMultipleChoiceQuestion apiEndPoint={apiEndPoint} />
        </TabPanel>
        <TabPanel>
          <AddSingleChoiceQuestion apiEndPoint={apiEndPoint} />
        </TabPanel>
        <TabPanel>
          <AddUserInputQuestion apiEndPoint={apiEndPoint} />
        </TabPanel>
        <TabPanel>
          <AddTrueFalseQuestion apiEndPoint={apiEndPoint} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}