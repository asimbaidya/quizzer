import { format } from 'date-fns';
import { Link } from '@tanstack/react-router';
import { Quiz } from '../../core/types/common';
import {
  Box,
  Heading,
  Text,
  Button,
  Stack,
  useColorModeValue,
  HStack,
  Select,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';

const QuizItem = ({ quiz }: { quiz: Quiz }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');
  const descriptionColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box
      p={4}
      borderWidth={1}
      borderRadius="md"
      width="full"
      bg={bgColor}
      borderColor={borderColor}
    >
      <VStack align="stretch" spacing={2}>
        <HStack justify="space-between">
          <Heading size="md" color={textColor}>
            {quiz.title}
          </Heading>
          <Text fontSize="sm" color={descriptionColor}>
            {format(new Date(quiz.created_at), 'PPP')}
          </Text>
        </HStack>

        <HStack justify="space-between" fontSize="sm">
          <Text color={descriptionColor}>Total Marks: {quiz.total_mark}</Text>
          <Text color={descriptionColor}>
            Max Attempts:{' '}
            {quiz.is_unlimited_attempt ? '∞' : quiz.allowed_attempt}
          </Text>
          <Button size="sm" colorScheme="blue" as={Link} to={quiz.url}>
            View Quiz
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

const QuizList = ({ quizzes }: { quizzes: Quiz[] }) => {
  const [filter, setFilter] = useState<'all' | 'limited' | 'unlimited'>('all');

  const filteredQuizzes = quizzes.filter((quiz) => {
    if (filter === 'unlimited') return quiz.is_unlimited_attempt;
    if (filter === 'limited') return !quiz.is_unlimited_attempt;
    return true;
  });

  return (
    <Box w="100%">
      <VStack spacing={4} align="stretch">
        <Heading size="xl" textAlign={'center'}>
          Quizzes
        </Heading>
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          maxW="200px"
          alignSelf="flex-end"
        >
          <option value="all">All Quizzes</option>
          <option value="limited">Limited Attempts</option>
          <option value="unlimited">Unlimited Attempts</option>
        </Select>
        <Stack spacing={3}>
          {filteredQuizzes.map((quiz) => (
            <QuizItem key={quiz.id} quiz={quiz} />
          ))}
        </Stack>
      </VStack>
    </Box>
  );
};

export default QuizList;
