import React from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  Grid,
  GridItem,
  Flex,
  Spacer,
  Badge,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { Link } from '@tanstack/react-router';

export interface Quiz {
  id: number;
  course_id: number;
  title: string;
  created_at: string;
  updated_at: string | null;
  allowed_attempt: number;
  question_set_id: number;
  total_mark: number;
  is_unlimited_attempt: boolean;
  url: string;
}

interface QuizListProps {
  quizzes: Quiz[];
}

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
        </Badge>
        <Spacer />
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

const QuizList: React.FC<QuizListProps> = ({ quizzes }) => {
  // color scheme based on color mode
  const cardBg = useColorModeValue('white', 'gray.700');
  const cardBorder = useColorModeValue('gray.200', 'gray.600');

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
