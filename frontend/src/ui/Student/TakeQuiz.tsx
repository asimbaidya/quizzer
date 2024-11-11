import { QuizQuestionWithSubmission } from '../../core/types/question';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';

import SubmissionSingleChoice from './question/SubmissionSingleChoice';
import SubmissionMultipleChoice from './question/SubmissionMultipleChoice';
import SubmissionUserInput from './question/SubmissionUserInput';
import SubmissionTrueFalse from './question/SubmissionTrueFalse';

interface TakeQuizProp {
  questionWithSubmission: QuizQuestionWithSubmission;
}

const TakeQuiz: React.FC<TakeQuizProp> = ({ questionWithSubmission }) => {
  const {
    allowed_attempt,
    is_unlimited_attempt,
    total_mark,
    question_submissions,
  } = questionWithSubmission;

  if (question_submissions?.length === 0) {
    return <Heading fontSize={'4xl'}>No Questions Added Yet</Heading>;
  }

  const totalPossibleScore = question_submissions.reduce(
    (acc, { question }) => {
      return acc + (question.total_marks || 0);
    },
    0
  );
  const _totalScore = question_submissions.reduce((acc, { submission }) => {
    return acc + (submission.score || 0);
  }, 0);

  const totalScore = _totalScore ? _totalScore : 0;

  const totalWeightedScore =
    (totalScore / totalPossibleScore / 100) * total_mark * 100;
  const totalQuestions = questionWithSubmission.question_submissions.length;

  const totalCorrect = question_submissions.filter(
    ({ submission }) => submission.is_correct
  ).length;

  const totalAttempts = question_submissions.filter(
    ({ submission }) => submission.made_attempt
  ).length;

  return (
    <Box userSelect={'none'}>
      <Flex
        borderWidth={1}
        borderRadius="md"
        p={4}
        mb={4}
        justifyContent="space-between"
      >
        <Text>Total Score: {totalScore}</Text>
        <Text>Total Weighted Score: {totalWeightedScore.toFixed(2)}</Text>
        <Text>Total Questions: {totalQuestions}</Text>
        <Text>
          Total Correct: {totalCorrect} / {totalQuestions}
        </Text>
        <Text>
          Total Attempts: {totalAttempts} / {totalQuestions}
        </Text>
        {questionWithSubmission.is_unlimited_attempt ? (
          <Text color={'green'}>Unlimited Attempts Allowed</Text>
        ) : (
          <Text>
            Allowed Attempts: {questionWithSubmission.allowed_attempt}
          </Text>
        )}
      </Flex>
      {question_submissions.map((questionSubmission, index) => {
        const { question, submission } = questionSubmission;

        let canSubmit = false;
        if (
          is_unlimited_attempt ||
          allowed_attempt > submission.attempt_count
        ) {
          canSubmit = true;
        }

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

export default TakeQuiz;
