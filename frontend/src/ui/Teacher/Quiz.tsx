import {
  Button,
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
import { Question } from '../../core/types/question';
import { Link } from '@tanstack/react-router';

export default function Quiz({
  questions,
}: {
  questions: Question[] | undefined;
}) {
  const { courseTitle, quizId } = useParams({
    from: '/_layout/(teacher)/course/quiz/$courseTitle/$quizId',
  });
  const apiEndPoint = `/API/teacher/course/quiz/${courseTitle}/${quizId}`;

  return (
    <Tabs variant="enclosed">
      <TabList>
        <Tab>View Quiz Questions</Tab>
        <Tab>Student Progress</Tab>
        <Tab>Add Multiple Choice</Tab>
        <Tab>Add Single Choice</Tab>
        <Tab>Add User Input</Tab>
        <Tab>Add True False</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          {Array.isArray(questions) && questions.length > 0 ? (
            // Temporary Criticall BUG:
            <ViewQuestions questions={questions} totalGradedMark={30} />
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
          <Button
            as={Link}
            to={`/course/students/quiz/${courseTitle}/${quizId}`}
          >
            Visit Progress
          </Button>
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
