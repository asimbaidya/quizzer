import { format } from 'date-fns';
import { Link } from '@tanstack/react-router';
import { Test } from '../../core/types/common';
import {
  Box,
  Heading,
  Text,
  Button,
  Stack,
  useColorModeValue,
  HStack,
  VStack,
  Select,
} from '@chakra-ui/react';
import { useState } from 'react';

const TestItem = ({ test }: { test: Test }) => {
  const current = new Date();
  const windowStart = new Date(test.window_start);
  const windowEnd = new Date(test.window_end);

  const status =
    current < windowStart
      ? 'upcoming'
      : current > windowEnd
        ? 'ended'
        : 'ongoing';

  const statusColors = {
    upcoming: useColorModeValue('blue.50', 'blue.900'),
    ongoing: useColorModeValue('green.50', 'green.900'),
    ended: useColorModeValue('gray.50', 'gray.700'),
  };

  const statusTextColors = {
    upcoming: useColorModeValue('blue.600', 'blue.200'),
    ongoing: useColorModeValue('green.600', 'green.200'),
    ended: useColorModeValue('gray.600', 'gray.400'),
  };

  const bgColor = statusColors[status];
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');

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
            {test.title}
          </Heading>
          <Text
            fontSize="sm"
            color={statusTextColors[status]}
            fontWeight="bold"
          >
            {status.toUpperCase()}
          </Text>
        </HStack>

        <HStack justify="space-between" fontSize="sm">
          <Text>Duration: {test.duration} min</Text>
          <Text>Total Marks: {test.total_mark}</Text>
          <Button size="sm" colorScheme="blue" as={Link} to={test.url}>
            View Test
          </Button>
        </HStack>

        <HStack
          justify="space-between"
          fontSize="xs"
          color={statusTextColors[status]}
        >
          <Text>Start: {format(windowStart, 'PPP p')}</Text>
          <Text>End: {format(windowEnd, 'PPP p')}</Text>
        </HStack>
      </VStack>
    </Box>
  );
};

const TestList = ({ tests }: { tests: Test[] }) => {
  const [filter, setFilter] = useState<
    'all' | 'upcoming' | 'ongoing' | 'ended'
  >('all');

  const filteredTests = tests.filter((test) => {
    const current = new Date();
    const windowStart = new Date(test.window_start);
    const windowEnd = new Date(test.window_end);

    switch (filter) {
      case 'upcoming':
        return current < windowStart;
      case 'ongoing':
        return current >= windowStart && current <= windowEnd;
      case 'ended':
        return current > windowEnd;
      default:
        return true;
    }
  });

  return (
    <Box w="100%">
      <VStack spacing={4} align="stretch">
        <Heading size="xl" textAlign={'center'}>
          Tests
        </Heading>
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          maxW="200px"
          alignSelf="flex-end"
        >
          <option value="all">All Tests</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="ended">Ended</option>
        </Select>
        <Stack spacing={3}>
          {filteredTests.map((test) => (
            <TestItem key={test.id} test={test} />
          ))}
        </Stack>
      </VStack>
    </Box>
  );
};

export default TestList;
