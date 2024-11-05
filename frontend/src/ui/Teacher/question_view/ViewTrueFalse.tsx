import {
  Box,
  Text,
  Image,
  Input,
  Heading,
  useColorModeValue,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { Question } from '../../../core/types/question';

interface Props {
  question: Question;
}

const ViewTrueFalse: React.FC<Props> = ({ question }) => {
  const { question_text } = question.question_data;
  const image_url = question?.image_url || null;
  const correctColor = useColorModeValue('green.300', 'green.500');

  return (
    <Box p={5} borderWidth={1} borderRadius="md" mt={5}>
      <HStack justify="center" spacing={2} mb={4}>
        <Badge fontSize={'lg'} colorScheme="blue" px={4} py={2}>
          Type: {question.question_type}
        </Badge>
        <Badge fontSize={'lg'} colorScheme="purple" px={4} py={2}>
          Tag: {question.tag}
        </Badge>
        <Badge fontSize={'lg'} colorScheme="orange" px={4} py={2}>
          Mark: {question.total_marks}
        </Badge>
      </HStack>
      <Text fontSize="4xl" mb={4}>
        {question_text}
      </Text>
      {image_url && (
        <Image src={image_url} mx={'auto'} alt="Question Image" mb={4} />
      )}

      <Input
        readOnly
        fontSize={'xl'}
        borderWidth={2}
        borderColor={correctColor}
        color={correctColor}
        cursor={'pointer'}
        value={String(question.question_data.true_false_answer)}
      ></Input>
    </Box>
  );
};

export default ViewTrueFalse;
