import {
  Box,
  Heading,
  Text,
  Button,
  Grid,
  GridItem,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';
import { Link } from '@tanstack/react-router';
import { QuizWithUrl } from '../../core/types/common';

const QuizItem = ({ quiz }: { quiz: QuizWithUrl }) => {
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('black', 'white');
  const descriptionColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box
      p={4}
      borderWidth={1}
      borderRadius="md"
      boxShadow="md"
      width="full"
      bg={bgColor}
      borderColor={borderColor}
      userSelect={'none'}
    >
      <HStack justify="center" width="full">
        <Heading size="lg" color={textColor} textAlign="center">
          {quiz.title}
        </Heading>
      </HStack>
      <HStack justify="center" width="full" mt={4}>
        <Text fontSize="md" color={descriptionColor}>
          Total Marks: {quiz.total_mark}
        </Text>
        <Text fontSize="md" color={descriptionColor}>
          {quiz.is_unlimited_attempt
            ? 'Unlimited Attempts'
            : `${quiz.allowed_attempt} Attempt(s)`}
        </Text>
      </HStack>
      <Button mt={6} width="full" colorScheme="blue" as={Link} to={quiz.url}>
        View Quiz
      </Button>
    </Box>
  );
};

const QuizList = ({ quizzes }: { quizzes: QuizWithUrl[] }) => {
  return (
    <Box p={5}>
      <Heading mb={6} textAlign="center">
        Available Quizzes
      </Heading>
      <Grid
        templateColumns={{
          base: '1fr',
        }}
        gap={6}
      >
        {quizzes.map((quiz) => (
          <GridItem key={quiz.id}>
            <QuizItem quiz={quiz} />
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};

export default QuizList;
