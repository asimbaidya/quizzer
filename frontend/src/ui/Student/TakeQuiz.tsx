import { QuizQuestionWithSubmission } from '../../core/types/question';
import { Box, Flex, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import SubmissionSingleChoice from './question/SubmissionSingleChoice';
import SubmissionMultipleChoice from './question/SubmissionMultipleChoice';
import SubmissionUserInput from './question/SubmissionUserInput';
import SubmissionTrueFalse from './question/SubmissionTrueFalse';

interface TakeQuizProp {
  questionWithSubmission: QuizQuestionWithSubmission;
}

const TakeQuiz: React.FC<TakeQuizProp> = ({ questionWithSubmission }) => {
  const [randomizedQuestions, setRandomizedQuestions] = useState<
    QuizQuestionWithSubmission['question_submissions']
  >([]);

  useEffect(() => {
    const shuffledQuestions = [
      ...questionWithSubmission.question_submissions,
    ].sort(() => Math.random() - 0.5);
    setRandomizedQuestions(shuffledQuestions);
  }, [questionWithSubmission]);

  const _totalScore = randomizedQuestions.reduce((acc, { submission }) => {
    return acc + (submission.score || 0);
  }, 0);
  const totalScore = _totalScore ? _totalScore : 0;

  const totalMarks = questionWithSubmission.question_submissions.reduce(
    (acc, { question }) => acc + question.total_marks,
    0
  );
  console.log(totalMarks);
  console.log(totalScore);

  const totalWeightedScore =
    (totalScore / totalMarks) * questionWithSubmission.total_mark;

  const totalQuestions = questionWithSubmission.question_submissions.length;
  const totalCorrect = randomizedQuestions.filter(
    ({ submission }) => submission.is_correct
  ).length;

  const totalAttempts = randomizedQuestions.filter(
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
        <Text>Total Score: {totalScore / totalMarks}</Text>
        <Text>
          Total Weighted Score: {totalWeightedScore.toFixed(2)} /
          {questionWithSubmission.total_mark}
        </Text>
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
      {randomizedQuestions.map(({ question, submission }, index) => {
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
      })}
    </Box>
  );
};

export default TakeQuiz;
