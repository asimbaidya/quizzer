import { Box } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { TestQuestionWithSubmission } from '../../core/types/question';
import SubmissionSingleChoice from './question/SubmissionSingleChoice';
import SubmissionMultipleChoice from './question/SubmissionMultipleChoice';
import SubmissionUserInput from './question/SubmissionUserInput';
import SubmissionTrueFalse from './question/SubmissionTrueFalse';

interface TakeTestProp {
  questionWithSubmission: TestQuestionWithSubmission;
}

const TakeTest: React.FC<TakeTestProp> = ({ questionWithSubmission }) => {
  const { status, total_mark, start_time } = questionWithSubmission;
  const [randomizedQuestions, setRandomizedQuestions] = useState<
    TestQuestionWithSubmission['question_submissions']
  >([]);

  useEffect(() => {
    const shuffledQuestions = [
      ...questionWithSubmission.question_submissions,
    ].sort(() => Math.random() - 0.5);
    setRandomizedQuestions(shuffledQuestions);
  }, [questionWithSubmission]);

  return (
    <Box>
      {randomizedQuestions.map((questionSubmission, index) => {
        const { question } = questionSubmission;
        const canSubmit = true;

        switch (question.question_type) {
          case 'single_choice':
            return (
              <SubmissionSingleChoice
                key={index}
                questionSubmission={questionSubmission}
                canSubmit={canSubmit}
              />
            );
          case 'multiple_choice':
            return (
              <SubmissionMultipleChoice
                key={index}
                questionSubmission={questionSubmission}
                canSubmit={canSubmit}
              />
            );
          case 'user_input':
            return (
              <SubmissionUserInput
                key={index}
                questionSubmission={questionSubmission}
                canSubmit={canSubmit}
              />
            );
          case 'true_false':
            return (
              <SubmissionTrueFalse
                key={index}
                questionSubmission={questionSubmission}
                canSubmit={canSubmit}
              />
            );
          default:
            return null;
        }
      })}
    </Box>
  );
};

export default TakeTest;
