import { Box, Button, Flex, Text, Image } from '@chakra-ui/react';
import { useState } from 'react';
import {
  MultipleChoiceSubmissionResponse,
  QuestionSubmission,
} from '../../../core/types/question';

import { MultipleChoiceResponseSchema } from '../../../core/schemas/question_submission';

const SubmissionMultipleChoice: React.FC<QuestionSubmission> = ({
  question,
  submission,
}) => {
  const { image_url } = question;
  const { question_text, choices } = question.question_data;
  const is_submitted = submission?.made_attempt || false;

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleOptionSelect = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  const handleSubmit = () => {
    const submission: MultipleChoiceSubmissionResponse =
      MultipleChoiceResponseSchema.parse({
        question_type: 'multiple_choice',
        user_response: selectedOptions,
        is_submitted: true,
      });
    alert(JSON.stringify(submission));
  };

  const handleShowFeedback = () => {
    alert(`Feedback: ${question.feedback}\nScore: ${question.score}`);
  };

  return (
    <Box p={5} borderWidth={1} borderRadius="md" mt={5}>
      <Text fontSize="xl" mb={4}>
        {question_text}
      </Text>
      {image_url && <Image src={image_url} alt="Question Image" mb={4} />}
      {choices?.map((choice) => (
        <Flex
          key={choice.text}
          alignItems="center"
          mb={2}
          p={2}
          borderWidth={2}
          borderColor={
            selectedOptions.includes(choice.text) ? 'green.500' : 'gray.300'
          }
          borderRadius="md"
          cursor="pointer"
          _hover={{ borderColor: 'green.300' }}
          onClick={() => handleOptionSelect(choice.text)}
        >
          <Text
            color={
              selectedOptions.includes(choice.text) ? 'green.500' : 'black'
            }
            fontWeight={
              selectedOptions.includes(choice.text) ? 'bold' : 'normal'
            }
          >
            {choice.text}
          </Text>
        </Flex>
      ))}
      {!is_submitted && selectedOptions.length > 0 && (
        <Button mt={4} onClick={handleSubmit}>
          Submit
        </Button>
      )}
      {is_submitted && (
        <Button mt={4} onClick={handleShowFeedback}>
          Show Feedback
        </Button>
      )}
    </Box>
  );
};

export default SubmissionMultipleChoice;
