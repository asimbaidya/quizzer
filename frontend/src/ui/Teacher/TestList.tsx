import {
  Box,
  Flex,
  Heading,
  Text,
  Badge,
  Button,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  FaClipboardList,
  FaHourglassStart,
  FaHourglassEnd,
  FaClock,
} from 'react-icons/fa';
import { format } from 'date-fns';
import { Link } from '@tanstack/react-router';
import { Test } from '../../core/types/common';

const TestItem = ({ test }: { test: Test }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('gray.800', 'white');

  return (
    <Box bg={bgColor} p={6} borderRadius="md" shadow="md" borderWidth={1}>
      <Badge colorScheme="green" fontSize="lg" py={1} px={2} mb={4}>
        Test
      </Badge>
      <Heading size="2xl" mb={2} color={headingColor} textAlign={'center'}>
        {test.title}
      </Heading>
      <Flex alignItems="center" mt={2} justifyContent="center">
        <FaHourglassStart />
        <Text ml={2} color={textColor}>
          Start: {format(new Date(test.window_start), 'PPP p')}
        </Text>
      </Flex>
      <Flex alignItems="center" mt={2} justifyContent="center">
        <FaHourglassEnd />
        <Text ml={2} color={textColor}>
          End: {format(new Date(test.window_end), 'PPP p')}
        </Text>
      </Flex>
      <Flex alignItems="center" mt={4} justifyContent="center">
        <FaClipboardList />
        <Text ml={2} color={textColor}>
          Total Marks: {test.total_mark}
        </Text>
      </Flex>
      <Flex alignItems="center" mt={2} justifyContent="center">
        <FaClock />
        <Text ml={2} color={textColor}>
          Duration: {test.duration} minutes
        </Text>
      </Flex>
      <Button mt={6} width="full" colorScheme="blue" as={Link} to={test.url}>
        View Test
      </Button>
    </Box>
  );
};

const TestList = ({ tests }: { tests: Test[] }) => {
  return (
    <Box w="100%" mt={8}>
      <Heading size="xl" mb={4} textAlign={'center'}>
        Tests
      </Heading>
      <Stack spacing={4}>
        {tests.map((test) => (
          <TestItem key={test.id} test={test} />
        ))}
      </Stack>
    </Box>
  );
};

export default TestList;
