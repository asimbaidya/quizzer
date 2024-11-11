import { Box, Text, Flex, Heading } from '@chakra-ui/react';
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
  const {
    duration,
    status,
    total_mark,
    start_time,
    question_submissions,
    window_end,
  } = questionWithSubmission;

  if (question_submissions?.length === 0) {
    return <Heading fontSize={'4xl'}>No Questions Added Yet</Heading>;
  }

  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [timerExpired, setTimerExpired] = useState<boolean>(false);

  useEffect(() => {
    if (start_time && window_end) {
      const startTime = new Date(start_time).getTime();
      const endTime = startTime + duration * 60 * 1000;
      const windowEnd = new Date(window_end).getTime();

      const actualEndTime = Math.min(endTime, windowEnd);

      const interval = setInterval(() => {
        const currentTime = new Date().getTime();
        const timeRemaining = actualEndTime - currentTime;

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
  }, [start_time, duration, window_end]);

  // useEffect(() => {
  //   if (start_time) {
  //     const endTime = new Date(start_time).getTime() + duration * 60 * 1000;
  //     const interval = setInterval(() => {
  //       const currentTime = new Date().getTime();
  //       const timeRemaining = endTime - currentTime;

  //       if (timeRemaining <= 0) {
  //         clearInterval(interval);
  //         setTimerExpired(true);
  //       } else {
  //         setTimeLeft(timeRemaining);
  //       }
  //     }, 1000);

  //     return () => clearInterval(interval);
  //   }
  // }, []);

  // helper function to format time in mm:ss
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

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

  // const _totalScore = question_submissions.reduce((acc, { submission }) => {
  //   return acc + (submission.score || 0);
  // }, 0);
  // const totalScore = _totalScore ? _totalScore : 0;

  // const totalWeightedScore =
  //   (totalScore / total_mark) * questionWithSubmission.total_mark;

  // const totalQuestions = questionWithSubmission.question_submissions.length;

  const totalCorrect = question_submissions.filter(
    ({ submission }) => submission.is_correct
  ).length;

  const totalAttempts = question_submissions.filter(
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
          <Text>Total Weighted Score: {totalWeightedScore.toFixed(2)}</Text>
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
      {question_submissions.map((questionSubmission, index) => {
        const { question, submission } = questionSubmission;

        // console.log('questionSubmission', questionSubmission);

        // if (status === 'in_progress' && submission.made_attempt === true) {
        //   return null;
        // }

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
