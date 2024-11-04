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
      <HStack>
        <Badge m={4} fontSize={'lg'} colorScheme="blue">
          Type: {question.question_type}
        </Badge>
        <Badge m={4} fontSize={'lg'} colorScheme="purple">
          Tag: {question.tag}
        </Badge>
        <Badge m={4} fontSize={'lg'} color={'orange'}>
          Mark: {question.total_marks}
        </Badge>
      </HStack>
      <Text fontSize="4xl" mb={4}>
        {question_text}
      </Text>
      {image_url && <Image src={image_url} alt="Question Image" mb={4} />}

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
