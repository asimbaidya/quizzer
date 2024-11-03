import { Box } from '@chakra-ui/react';
import { TestQuestionWithSubmission } from '../../core/types/question';
import SubmissionSingleChoice from './question/SubmissionSingleChoice';
import SubmissionMultipleChoice from './question/SubmissionMultipleChoice';
import SubmissionUserInput from './question/SubmissionUserInput';
import SubmissionTrueFalse from './question/SubmissionTrueFalse';

interface TestProp {
  questionWithSubmission: TestQuestionWithSubmission;
}
const Test: React.FC<TestProp> = ({ questionWithSubmission }) => {
  questionWithSubmission.question_submissions.map(({ question, submission }) =>
    console.log(question)
  );

  return (
    <Box>
      {questionWithSubmission.question_submissions.map(
        ({ question, submission }, index) => {
          switch (question.question_type) {
            case 'single_choice':
              return (
                <SubmissionSingleChoice
                  key={index}
                  question={question}
                  submission={submission}
                />
              );
            case 'multiple_choice':
              return (
                <SubmissionMultipleChoice
                  key={index}
                  question={question}
                  submission={submission}
                />
              );
            case 'user_input':
              return (
                <SubmissionUserInput
                  key={index}
                  question={question}
                  submission={submission}
                />
              );
            case 'true_false':
              return (
                <SubmissionTrueFalse
                  key={index}
                  question={question}
                  submission={submission}
                />
              );
            default:
              return null;
          }
        }
      )}
    </Box>
  );
};

export default Test;
