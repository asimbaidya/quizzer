import {
  Box,
  Button,
  Flex,
  Text,
  Image,
  useColorModeValue,
  Badge,
} from '@chakra-ui/react';
import { useState } from 'react';

import { TrueFalseResponseSchema } from '../../../core/schemas/question_submission';
import { QuestionSubmission } from '../../../core/types/question';
import { useMutation } from '@tanstack/react-query';
import useCustomToast from '../../../hooks/useCustomToast';
import { submitQuestionAnswerAtAPI } from '../../../core/services/student';
import { useQueryClient } from '@tanstack/react-query';

interface Prop {
  questionSubmission: QuestionSubmission;
  canSubmit: boolean;
}

const SubmissionTrueFalse: React.FC<Prop> = ({
  questionSubmission,
  canSubmit,
}) => {
  // unpack value
  const { question, submission } = questionSubmission;
  const { image_url } = question;
  const { question_text, choices } = question.question_data;
  // const is_submitted = submission?.is_correct;
  // const is_submitted = submission?.made_attempt || false;
  // const is_submitted = submission?.is_correct || false;
  const is_submitted = false;

  const [userResponse, setUserResponse] = useState<boolean | null>(null);

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

  const handleSelect = (response: boolean) => {
    setUserResponse(response);
  };

  const handleSubmit = () => {
    const user_answer = TrueFalseResponseSchema.parse({
      question_type: 'true_false',
      user_response: {
        question_type: 'true_false',
        user_response: userResponse as boolean,
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
    alert(`Feedback: ${submission.feedback}\nScore: ${question.score}`);
  };

  const textColor = useColorModeValue('black', 'white');

  return (
    <Box p={5} borderWidth={1} borderRadius="md" mt={5} userSelect={'none'}>
      <Text fontSize="4xl" mb={4} color={textColor}>
        Q. {question_text}
      </Text>
      {image_url && (
        <Image src={image_url} alt="Question Image" mb={4} mx={'auto'} />
      )}
      {!is_submitted ? (
        <>
          <Flex mb={4}>
            <Button
              mr={2}
              colorScheme={userResponse === true ? 'green' : 'gray'}
              onClick={() => handleSelect(true)}
              width={'50%'}
              fontSize={'xl'}
            >
              True
            </Button>
            <Button
              colorScheme={userResponse === false ? 'green' : 'gray'}
              onClick={() => handleSelect(false)}
              width={'50%'}
              fontSize={'xl'}
            >
              False
            </Button>
          </Flex>
          {userResponse !== null && (
            <Button onClick={handleSubmit}>Submit</Button>
          )}
        </>
      ) : null}
      {submission.feedback && (
        <Button onClick={handleShowFeedback}>Show Feedback</Button>
      )}
    </Box>
  );
};

export default SubmissionTrueFalse;
