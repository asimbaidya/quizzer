import React from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  Stack,
  Flex,
  Spacer,
  Badge,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { MdAccessTime, MdStar, MdEvent, MdCalendarToday } from 'react-icons/md'; // Importing icons
import { Link } from '@tanstack/react-router';

export type TestStatus =
  | 'not_opened'
  | 'not_started'
  | 'in_progress'
  | 'completed';

export interface Test {
  id: number;
  course_id: number;
  title: string;
  question_set_id: number;
  duration: number;
  total_mark: number;
  window_start: string;
  window_end: string;
  url: string;
  status: TestStatus;
}

// props interface
interface TestListProps {
  tests: Test[];
}

// helper function to format status text
const formatStatus = (status: TestStatus): string => {
  switch (status) {
    case 'not_opened':
      return 'Not Opened';
    case 'not_started':
      return 'Not Started';
    case 'in_progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    default:
      return status;
  }
};

// helper function to get color scheme based on status
const getStatusColor = (status: TestStatus): string => {
  switch (status) {
    case 'not_opened':
      return 'gray';
    case 'not_started':
      return 'yellow';
    case 'in_progress':
      return 'blue';
    case 'completed':
      return 'green';
    default:
      return 'gray';
  }
};

const TestList: React.FC<TestListProps> = ({ tests }) => {
  // color scheme based on color mode
  const cardBg = useColorModeValue('white', 'gray.700');
  const cardBorder = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  return (
    <Box p={5}>
      <Heading mb={6} textAlign="center">
        Available Tests
      </Heading>
      <Stack spacing={6}>
        {tests.map((test) => (
          <Box
            key={test.id}
            borderWidth="1px"
            borderRadius="lg"
            bg={cardBg}
            borderColor={cardBorder}
            p={6}
            boxShadow="sm"
            _hover={{ boxShadow: 'md' }}
            transition="box-shadow 0.2s"
          >
            {/* Test Title and Status Badge */}
            <Flex alignItems="center" mb={4}>
              <Heading size="lg">{test.title}</Heading>
              <Spacer />
              <Badge colorScheme={getStatusColor(test.status)}>
                {formatStatus(test.status)}
              </Badge>
            </Flex>

            {/* Duration and Total Marks */}
            <Flex alignItems="center" mb={2}>
              <Flex alignItems="center" mr={6}>
                <Icon as={MdAccessTime} w={5} h={5} mr={2} color="teal.500" />
                <Text color={textColor}>Duration: {test.duration} minutes</Text>
              </Flex>
              <Flex alignItems="center">
                <Icon as={MdStar} w={5} h={5} mr={2} color="yellow.400" />
                <Text color={textColor}>Total Marks: {test.total_mark}</Text>
              </Flex>
            </Flex>

            {/* Window Start and End Times */}
            <Flex alignItems="center" mb={2}>
              <Flex alignItems="center" mr={6}>
                <Icon
                  as={MdCalendarToday}
                  w={5}
                  h={5}
                  mr={2}
                  color="purple.500"
                />
                <Text color={textColor}>
                  Start: {format(new Date(test.window_start), 'PPP p')}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Icon as={MdEvent} w={5} h={5} mr={2} color="red.500" />
                <Text color={textColor}>
                  End: {format(new Date(test.window_end), 'PPP p')}
                </Text>
              </Flex>
            </Flex>

            <Link to={test.url}>
              <Button mt={4} colorScheme="teal" width="full">
                Go to Test
              </Button>
            </Link>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default TestList;
