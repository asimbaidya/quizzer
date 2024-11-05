import {
  Box,
  Button,
  Input,
  Text,
  Image,
  useColorModeValue,
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
  // unpack value
  const { question, submission } = questionSubmission;

  const { image_url } = question;
  const { question_text } = question.question_data;
  // const is_submitted = submission?.made_attempt || false;
  // const is_submitted = submission?.is_correct || false;
  const is_submitted = false;

  const [userInput, setUserInput] = useState<string>('');

  const inputBg = useColorModeValue('gray.400', 'gray.700');
  const inputColor = useColorModeValue('black', 'white');
  const inputBorderColor = useColorModeValue('green', 'teal');
  const textColor = useColorModeValue('black', 'white');

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
        title: 'Success',
        description: 'Answer Submitted Successfully',
        status: 'success',
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

  const handleShowFeedback = () => {
    alert(`Feedback: ${question.feedback}\nScore: ${question.score}`);
  };

  return (
    <Box p={5} borderWidth={1} borderRadius="md" mt={5}>
      <Text fontSize="4xl" mb={4} color={textColor}>
        Q. {question_text}
      </Text>
      {image_url && (
        <Image src={image_url} alt="Question Image" mb={4} mx={'auto'} />
      )}
      {!is_submitted ? (
        <>
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
          {userInput && <Button onClick={handleSubmit}>Submit</Button>}
        </>
      ) : null}
      {submission.feedback && (
        <Button onClick={handleShowFeedback}>Show Feedback</Button>
      )}
    </Box>
  );
};

export default SubmissionUserInput;
