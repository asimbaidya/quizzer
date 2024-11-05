import { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
  Image,
  useColorModeValue,
} from '@chakra-ui/react';
import { QuestionSubmission } from '../../../core/types/question';
import { MultipleChoiceResponseSchema } from '../../../core/schemas/question_submission';

import { submitQuestionAnswerAtAPI } from '../../../core/services/student';
import { useMutation } from '@tanstack/react-query';
import useCustomToast from '../../../hooks/useCustomToast';
import { useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

type MultipleChoiceChoice = z.infer<typeof MultipleChoiceResponseSchema>;

interface Prop {
  questionSubmission: QuestionSubmission;
  canSubmit: boolean;
}

const SubmissionMultipleChoice: React.FC<Prop> = ({
  questionSubmission,
  canSubmit,
}) => {
  // unpack value
  const { question, submission } = questionSubmission;

  const { image_url } = question;
  const { question_text, choices } = question.question_data;
  // const is_submitted = submission?.is_correct || false;
  const is_submitted = false;

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

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
    const user_answer: MultipleChoiceChoice =
      MultipleChoiceResponseSchema.parse({
        question_type: 'multiple_choice',
        user_response: {
          question_type: 'multiple_choice',
          user_response: selectedOptions,
        },
      });

    // handle the submission if url exist
    if (question?.url === undefined) {
      showToast({
        title: 'Error',
        description: 'Question URL is undefined',
        status: 'error',
      });
      return;
    }
    // alert(JSON.stringify(user_response, null, 2));
    console.log(user_answer);
    mutation.mutate({
      apiEndPoint: question.url,
      answerData: user_answer,
      signal: new AbortController().signal,
    });
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  const handleShowFeedback = () => {
    alert(`Feedback: ${submission.feedback}\nScore: ${question.score}`);
  };

  const textColor = useColorModeValue('black', 'white');
  const borderColor = useColorModeValue('gray.300', 'gray.600');
  const selectedBorderColor = useColorModeValue('green.500', 'teal.500');
  const hoverBorderColor = useColorModeValue('green.300', 'teal.300');
  const selectedTextColor = useColorModeValue('green.500', 'teal.500');

  return (
    <Box p={5} borderWidth={1} borderRadius="md" mt={5}>
      <Text fontSize="4xl" mb={4} color={textColor}>
        Q. {question_text}
      </Text>
      {image_url && (
        <Image src={image_url} alt="Question Image" mb={4} mx={'auto'} />
      )}
      {choices?.map((choice) => (
        <Flex
          key={choice.text}
          alignItems="center"
          mb={2}
          p={2}
          borderWidth={2}
          borderColor={
            selectedOptions.includes(choice.text)
              ? selectedBorderColor
              : borderColor
          }
          borderRadius="md"
          cursor="pointer"
          _hover={{ borderColor: hoverBorderColor }}
          onClick={() => handleOptionSelect(choice.text)}
        >
          <Text
            color={
              selectedOptions.includes(choice.text)
                ? selectedTextColor
                : textColor
            }
            fontWeight={
              selectedOptions.includes(choice.text) ? 'bold' : 'normal'
            }
            fontSize={'xl'}
          >
            {choice.text}
          </Text>
        </Flex>
      ))}
      <Text fontSize="sm" color={textColor}>
        Select All That Apply
      </Text>
      {!is_submitted && selectedOptions.length > 0 && (
        <Button mt={4} onClick={handleSubmit}>
          Submit
        </Button>
      )}
      {submission.feedback && (
        <Button mt={4} onClick={handleShowFeedback}>
          Show Feedback
        </Button>
      )}
    </Box>
  );
};

export default SubmissionMultipleChoice;
