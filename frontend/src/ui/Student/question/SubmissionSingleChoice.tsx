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
import {
  SingleChoiceSubmissionResponse,
  QuestionSubmission,
} from '../../../core/types/question';
import { SingleChoiceResponseSchema } from '../../../core/schemas/question_submission';

const SubmissionSingleChoice: React.FC<QuestionSubmission> = ({
  question,
  submission,
}) => {
  const { image_url } = question;
  const { question_text, choices } = question.question_data;
  const is_submitted = submission?.made_attempt || false;

  const [selectedOption, setSelectedOption] = useState<string>('');

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  console.log(image_url);
  const handleSubmit = () => {
    const submission: SingleChoiceSubmissionResponse =
      SingleChoiceResponseSchema.parse({
        question_type: 'single_choice',
        user_response: selectedOption,
        is_submitted: true,
      });
    alert(JSON.stringify(submission));
  };

  const handleShowFeedback = () => {
    alert(`Feedback: ${question.feedback}\nScore: ${question.score}`);
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
            selectedOption === choice.text ? selectedBorderColor : borderColor
          }
          borderRadius="md"
          cursor="pointer"
          _hover={{ borderColor: hoverBorderColor }}
          onClick={() => handleOptionSelect(choice.text)}
        >
          <Text
            color={
              selectedOption === choice.text ? selectedTextColor : textColor
            }
            fontWeight={selectedOption === choice.text ? 'bold' : 'normal'}
            fontSize={'xl'}
          >
            {choice.text}
          </Text>
        </Flex>
      ))}
      {!is_submitted && selectedOption && (
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

export default SubmissionSingleChoice;
