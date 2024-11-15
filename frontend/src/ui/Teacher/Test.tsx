import {
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Button,
} from '@chakra-ui/react';
import { useParams } from '@tanstack/react-router';
import AddMultipleChoiceQuestion from './questions_create/AddMultipleChoiceQuestion';
import AddSingleChoiceQuestion from './questions_create/AddSingleChoiceQuestion';
import AddUserInputQuestion from './questions_create/AddUserInputQuestion';
import AddTrueFalseQuestion from './questions_create/AddTrueFalseQuestion';
import ViewQuestions from './question_view/ViewQuestions';
import { TestQuestions } from '../../core/types/question';
import { Link } from '@tanstack/react-router';

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
  // console.log(windowStart, current);
  // console.log(notOpened);

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
        {notOpened && <Tab>Add Multiple Choice</Tab>}
        {notOpened && <Tab>Add Single Choice</Tab>}
        {notOpened && <Tab>Add User Input</Tab>}
        {notOpened && <Tab>Add True False</Tab>}

        {notOpened || <Tab>View Student's Progress</Tab>}
      </TabList>

      <TabPanels>
        <TabPanel>
          {questions ? (
            <ViewQuestions
              questions={questions}
              totalGradedMark={test.total_mark}
            />
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

        {notOpened && (
          <TabPanel>
            <AddMultipleChoiceQuestion apiEndPoint={apiEndPoint} />
          </TabPanel>
        )}
        {notOpened && (
          <TabPanel>
            <AddSingleChoiceQuestion apiEndPoint={apiEndPoint} />
          </TabPanel>
        )}
        {notOpened && (
          <TabPanel>
            <AddUserInputQuestion apiEndPoint={apiEndPoint} />
          </TabPanel>
        )}
        {notOpened && (
          <TabPanel>
            <AddTrueFalseQuestion apiEndPoint={apiEndPoint} />
          </TabPanel>
        )}

        {notOpened || (
          <TabPanel>
            <Button
              as={Link}
              to={`/course/students/test/${courseTitle}/${testId}`}
            >
              Visit Progress
            </Button>
          </TabPanel>
        )}
      </TabPanels>
    </Tabs>
  );
}
