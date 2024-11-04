import {
  Box,
  Flex,
  Heading,
  Text,
  Badge,
  Button,
  Spacer,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaClipboardList, FaClock } from 'react-icons/fa';
import { format } from 'date-fns';
import { Link } from '@tanstack/react-router';
import { Quiz } from '../../core/types/common';

const QuizItem = ({ quiz }: { quiz: Quiz }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('gray.800', 'white');

  return (
    <Box bg={bgColor} p={6} borderRadius="md" shadow="md" borderWidth={1}>
      <Badge colorScheme="green" fontSize="lg" py={1} px={2} mb={4}>
        Quiz
      </Badge>
      <Heading size="2xl" mb={2} color={headingColor} textAlign={'center'}>
        {quiz.title}
      </Heading>
      <Flex alignItems="center" justifyContent="center">
        <Text mt={2} color={textColor}>
          Created At: {format(new Date(quiz.created_at), 'PPP p')}
        </Text>
      </Flex>
      <Flex alignItems="center" mt={4} justifyContent="center">
        <FaClipboardList />
        <Text ml={2} color={textColor}>
          Total Marks: {quiz.total_mark}
        </Text>
      </Flex>
      <Flex alignItems="center" mt={2} justifyContent="center">
        <FaClock />
        <Text ml={2} color={textColor}>
          Allowed Attempts:{' '}
          {quiz.is_unlimited_attempt ? 'Unlimited' : quiz.allowed_attempt}
        </Text>
      </Flex>
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
