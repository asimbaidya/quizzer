import {
  Box,
  Button,
  Input,
  Text,
  Image,
  useColorModeValue,
  Flex,
  Badge,
} from '@chakra-ui/react';
import { useState } from 'react';

import {
  UserInputSubmissionResponse,
  QuestionSubmission,
} from '../../../core/types/question';
import { UserInputResponseSchema } from '../../../core/schemas/question_submission';
import { useMutation } from '@tanstack/react-query';
import useCustomToast from '../../../hooks/useCustomToast';
import { submitQuestionAnswerAtAPI } from '../../../core/services/student';
import { useQueryClient } from '@tanstack/react-query';

interface Prop {
  questionSubmission: QuestionSubmission;
  canSubmit: boolean;
}

const SubmissionUserInput: React.FC<Prop> = ({
  questionSubmission,
  canSubmit,
}) => {
  const { question, submission } = questionSubmission;

  const { image_url } = question;
  const { question_text } = question.question_data;
  const [userInput, setUserInput] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState<boolean>(false);

  const { showToast } = useCustomToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      apiEndPoint,
      answerData,
      signal,
    }: {
      apiEndPoint: string;
      answerData: any;
      signal: AbortSignal;
    }) => submitQuestionAnswerAtAPI(apiEndPoint, answerData, signal),
    onSuccess: () => {
      showToast({
        title: 'Your Answer Submitted',
        status: 'info',
      });
      queryClient.invalidateQueries({
        queryKey: ['Questions'],
      });
    },
    onError: (error) => {
      showToast({
        title: 'Error',
        description: error.message,
        status: 'error',
      });
    },
  });

  const handleSubmit = () => {
    const user_answer = UserInputResponseSchema.parse({
      question_type: 'user_input',
      user_response: {
        question_type: 'user_input',
        user_response: userInput,
      },
      is_submitted: true,
    });

    if (question?.url === undefined) {
      showToast({
        title: 'Error',
        description: 'Question URL is undefined',
        status: 'error',
      });
      return;
    }

    mutation.mutate({
      apiEndPoint: question.url,
      answerData: user_answer,
      signal: new AbortController().signal,
    });
  };

  // remove alert and toggle feedback visibility
  const handleShowFeedback = () => {
    setShowFeedback(!showFeedback);
  };

  const inputBg = useColorModeValue('gray.400', 'gray.700');
  const inputColor = useColorModeValue('black', 'white');
  const inputBorderColor = useColorModeValue('green', 'teal');
  const textColor = useColorModeValue('black', 'white');
  const borderColor = useColorModeValue('gray.300', 'gray.600');
  // determine feedback border color based on correctness
  const feedbackBorderColor = submission.is_correct
    ? useColorModeValue('green.500', 'green.400')
    : useColorModeValue('red.500', 'red.400');

  return (
    <Box
      p={5}
      borderWidth={2}
      borderRadius="md"
      mt={5}
      borderColor={borderColor}
    >
      <Flex justify="space-between" mb={4}>
        <Badge colorScheme="purple" px={2}>
          Topic: {question.tag}
        </Badge>
        <Text>
          Score: {submission.score || 0}/{question.total_marks}
        </Text>
      </Flex>

      <Text fontSize="4xl" mb={4} color={textColor}>
        Q. {question_text}
      </Text>
      {image_url && (
        <Image src={image_url} alt="Question Image" mb={4} mx={'auto'} />
      )}
      <Input
        placeholder="Type Answer Here"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        mb={4}
        bg={inputBg}
        color={inputColor}
        borderColor={inputBorderColor}
        borderWidth={'2px'}
        fontSize={'xl'}
      />
      <Flex mt={4} gap={2}>
        {userInput && (
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isDisabled={!canSubmit}
          >
            Submit
          </Button>
        )}
        {submission.feedback && (
          <Button
            colorScheme={submission.is_correct ? 'green' : 'red'}
            onClick={handleShowFeedback}
          >
            {showFeedback ? 'Hide Feedback' : 'Show Feedback'}
          </Button>
        )}
      </Flex>

      {showFeedback && submission.feedback && (
        <Box
          mt={4}
          p={4}
          borderRadius="md"
          borderWidth={2}
          borderColor={feedbackBorderColor}
        >
          <Text color={textColor}>{submission.feedback}</Text>
        </Box>
      )}
    </Box>
  );
};

export default SubmissionUserInput;
