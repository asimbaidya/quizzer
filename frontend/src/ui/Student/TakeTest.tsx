import { Box, Text, Flex } from '@chakra-ui/react';
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
  const { duration, status, total_mark, start_time } = questionWithSubmission;
  const [randomizedQuestions, setRandomizedQuestions] = useState<
    TestQuestionWithSubmission['question_submissions']
  >([]);

  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [timerExpired, setTimerExpired] = useState<boolean>(false);

  // calculate the timer only if start_time is provided
  useEffect(() => {
    if (start_time) {
      const endTime = new Date(start_time).getTime() + duration * 60 * 1000;
      const interval = setInterval(() => {
        const currentTime = new Date().getTime();
        const timeRemaining = endTime - currentTime;

        if (timeRemaining <= 0) {
          clearInterval(interval);
          setTimerExpired(true);
        } else {
          setTimeLeft(timeRemaining);
        }
      }, 1000);

      // cleanup interval on component unmount or when timer expired
      return () => clearInterval(interval);
    }
  }, []);

  // shuffle the questions only once, when the component mounts or when the questions change
  useEffect(() => {
    const shuffledQuestions = [
      ...questionWithSubmission.question_submissions,
    ].sort(() => Math.random() - 0.5);
    setRandomizedQuestions(shuffledQuestions);
  }, [questionWithSubmission]);

  // helper function to format time in mm:ss
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  const _totalScore = randomizedQuestions.reduce((acc, { submission }) => {
    return acc + (submission.score || 0);
  }, 0);
  const totalScore = _totalScore ? _totalScore : 0;

  const totalWeightedScore =
    (totalScore / total_mark) * questionWithSubmission.total_mark;

  const totalQuestions = questionWithSubmission.question_submissions.length;
  const totalCorrect = randomizedQuestions.filter(
    ({ submission }) => submission.is_correct
  ).length;

  const totalAttempts = randomizedQuestions.filter(
    ({ submission }) => submission.made_attempt
  ).length;

  return (
    <Box>
      {status !== 'in_progress' && (
        <Flex
          borderWidth={1}
          borderRadius="md"
          p={4}
          mb={4}
          justifyContent="space-between"
        >
          <Text>Total Score: {totalScore}</Text>
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
        </Flex>
      )}

      {/* display the timer only if start_time is available */}
      {start_time && status === 'in_progress' && (
        <Box mb={4}>
          <Text fontSize="lg" fontWeight="bold">
            Time Remaining: {timerExpired ? "Time's up!" : formatTime(timeLeft)}
          </Text>
        </Box>
      )}

      {/* render the questions */}
      {randomizedQuestions.map((questionSubmission, index) => {
        const { question, submission } = questionSubmission;

        // console.log('questionSubmission', questionSubmission);

        if (status === 'in_progress' && submission.made_attempt === true) {
          return null;
        }
        //
        let canSubmit = false;
        if (status === 'in_progress' && submission.made_attempt === false) {
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

export default TakeTest;
