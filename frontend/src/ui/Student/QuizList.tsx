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
            <Box
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              bg={cardBg}
              borderColor={cardBorder}
              boxShadow="md"
              _hover={{ boxShadow: 'xl' }}
              transition="box-shadow 0.2s"
            >
              <Box p={6}>
                <Flex alignItems="center">
                  <Heading size="md" fontSize={'2xl'}>
                    {quiz.title}
                  </Heading>
                  <Spacer />
                  <Badge colorScheme="green">
                    {quiz.is_unlimited_attempt
                      ? 'Unlimited Attempts'
                      : `${quiz.allowed_attempt} Attempt(s)`}
                  </Badge>
                </Flex>

                <Text mt={4} color="gray.500">
                  Total Marks: {quiz.total_mark}
                </Text>
                <Text mt={2} color="gray.500">
                  Created At: {format(new Date(quiz.created_at), 'PPP p')}
                </Text>

                {quiz.updated_at && (
                  <Text mt={2} color="gray.500">
                    Updated At: {format(new Date(quiz.updated_at), 'PPP p')}
                  </Text>
                )}

                <Link to={quiz.url}>
                  <Button mt={4} colorScheme="teal" width="full">
                    Go to Quiz
                  </Button>
                </Link>
              </Box>
            </Box>
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};

export default QuizList;
