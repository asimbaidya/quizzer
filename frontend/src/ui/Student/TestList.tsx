import {
  Box,
  Heading,
  Text,
  Button,
  Stack,
  Flex,
  Badge,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { MdAccessTime, MdStar, MdEvent, MdCalendarToday } from 'react-icons/md';
import { Link } from '@tanstack/react-router';
import { TestStatus } from '../../core/types/common';
import { TestWithUrlAndStatus } from '../../core/types/common';

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

const TestList = ({ tests }: { tests: TestWithUrlAndStatus[] }) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const cardBorder = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  return (
    <Box p={5} userSelect={'none'}>
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
            position="relative"
          >
            {/* Status Badge */}
            <Badge
              colorScheme={getStatusColor(test.status)}
              position="absolute"
              top={4}
              right={4}
            >
              {formatStatus(test.status)}
            </Badge>

            {/* Test Title */}
            <Flex justifyContent="center" mb={4}>
              <Heading size="lg" textAlign="center">
                {test.title}
              </Heading>
            </Flex>

            {/* Start Time, End Time, and Duration */}
            <Flex justifyContent="center" mb={4}>
              <Flex alignItems="center" mx={3}>
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
              <Flex alignItems="center" mx={3}>
                <Icon as={MdEvent} w={5} h={5} mr={2} color="red.500" />
                <Text color={textColor}>
                  End: {format(new Date(test.window_end), 'PPP p')}
                </Text>
              </Flex>
              <Flex alignItems="center" mx={3}>
                <Icon as={MdAccessTime} w={5} h={5} mr={2} color="teal.500" />
                <Text color={textColor}>Duration: {test.duration} minutes</Text>
              </Flex>
            </Flex>

            {/* Go to Test Button */}
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
