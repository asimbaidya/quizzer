import {
  Box,
  Text,
  Image,
  Flex,
  Heading,
  HStack,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { Question } from '../../../core/types/question';

interface Props {
  question: Question;
}

const ViewSingleChoice: React.FC<Props> = ({ question }) => {
  const { question_text, choices } = question.question_data;
  const image_url = question?.image_url || null;

  const textColor = useColorModeValue('black', 'white');
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
      {choices?.map((choice) => (
        <Flex
          key={choice.text}
          alignItems="center"
          mb={2}
          p={2}
          borderWidth={2}
          borderColor={choice.correct ? correctColor : 'gray.300'}
          borderRadius="md"
          // cursor="pointer"
        >
          <Text
            fontSize={'xl'}
            color={choice.correct ? correctColor : textColor}
          >
            {choice.text}
          </Text>
        </Flex>
      ))}
    </Box>
  );
};

export default ViewSingleChoice;
