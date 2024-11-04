import { format } from 'date-fns';
import { Link } from '@tanstack/react-router';
import { Quiz } from '../../core/types/common';
import {
  Box,
  Heading,
  Text,
  Badge,
  Button,
  Spacer,
  Stack,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';

const QuizItem = ({ quiz }: { quiz: Quiz }) => {
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('black', 'white');
  const descriptionColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box
      p={8}
      borderWidth={1}
      borderRadius="md"
      boxShadow="md"
      width="full"
      bg={bgColor}
      borderColor={borderColor}
    >
      <HStack justify="space-between" width="full">
        <Badge colorScheme="green" fontSize="lg" py={1} px={2}>
          Quiz
        </Badge>{' '}
        <Spacer />{' '}
        <Heading size="4xl" color={textColor} textAlign="center">
          {quiz.title}
        </Heading>
        <Spacer />
        <Text fontSize="sm" color={descriptionColor}>
          Created At: {format(new Date(quiz.created_at), 'PPP p')}
        </Text>
      </HStack>
      <HStack justify="space-between" width="full" mt={4}>
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

const QuizList = ({ quizzes }: { quizzes: Quiz[] }) => {
  return (
    <Box w="100%">
      <Heading size="xl" mb={4} textAlign={'center'}>
        Quizzes
      </Heading>
      <Stack spacing={4}>
        {quizzes.map((quiz) => (
          <QuizItem key={quiz.id} quiz={quiz} />
        ))}
      </Stack>
    </Box>
  );
};

export default QuizList;
