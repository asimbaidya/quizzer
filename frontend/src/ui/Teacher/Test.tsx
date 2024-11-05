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
import ViewQuestions from './question_view/ViewQuestions';
import { TestQuestions } from '../../core/types/question';

export default function Test({
  testQuestions,
}: {
  testQuestions: TestQuestions | undefined;
}) {
  // data extraction

  const questions = testQuestions?.questions;
  const test = testQuestions?.test;

  if (
    testQuestions === undefined ||
    test == undefined ||
    questions === undefined
  ) {
    return (
      <Heading size="lg" textAlign={{ base: 'center', md: 'left' }} py={12}>
        No Data Found
      </Heading>
    );
  }

  const windowStart = new Date(test.window_start);
  const current = new Date();
  const notOpened = current < windowStart;
  console.log(windowStart, current);
  console.log(notOpened);

  // ... shit shit ..
  // okey need to do shortcut here
  // let's compare start_date ent

  // path extraction
  const { courseTitle, testId } = useParams({
    from: '/_layout/(teacher)/course/test/$courseTitle/$testId',
  });
  const apiEndPoint = `/API/teacher/course/test/${courseTitle}/${testId}`;

  return (
    <Tabs variant="enclosed">
      <TabList>
        <Tab>View Test Questions</Tab>
        {notOpened === true ? (
          <>
            <Tab>Add Multiple Choice</Tab>
            <Tab>Add Single Choice</Tab>
            <Tab>Add User Input</Tab>
            <Tab>Add True False</Tab>
          </>
        ) : (
          <Tab>View Student's Progress</Tab>
        )}
      </TabList>

      <TabPanels>
        <TabPanel>
          {questions ? (
            <ViewQuestions questions={questions} />
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

        {notOpened === true ? (
          <>
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
          </>
        ) : (
          <TabPanel>
            <Heading as="h1">Not Implemented Yet</Heading>
          </TabPanel>
        )}
      </TabPanels>
    </Tabs>
  );
}
