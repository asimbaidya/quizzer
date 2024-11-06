import { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
  Image,
  useColorModeValue,
  Badge,
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
  const [showFeedback, setShowFeedback] = useState(false);

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
    setShowFeedback(!showFeedback);
  };

  const textColor = useColorModeValue('black', 'white');
  const borderColor = useColorModeValue('gray.300', 'gray.600');
  const selectedBorderColor = useColorModeValue('green.500', 'teal.500');
  const hoverBorderColor = useColorModeValue('green.300', 'teal.300');
  const selectedTextColor = useColorModeValue('green.500', 'teal.500');
  const boxBg = useColorModeValue('green.50', 'green.900');
  const borderGreen = useColorModeValue('green.500', 'green.400');
  const feedbackBorderColor = submission.is_correct
    ? useColorModeValue('green.500', 'green.400')
    : useColorModeValue('red.500', 'red.400');

  return (
    <Box
      p={5}
      borderWidth={2}
      borderRadius="md"
      mt={5}
      borderColor={submission.is_correct ? borderGreen : borderColor}
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
      <Flex mt={4} gap={2}>
        {selectedOptions.length > 0 && (
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

export default SubmissionMultipleChoice;
