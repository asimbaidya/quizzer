import { format } from 'date-fns';
import { Link } from '@tanstack/react-router';
import { Test } from '../../core/types/common';
import {
  Box,
  Heading,
  Text,
  Badge,
  Button,
  Stack,
  useColorModeValue,
  HStack,
  Spacer,
} from '@chakra-ui/react';

const TestItem = ({ test }: { test: Test }) => {
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
      <HStack justify="space-between" width="full">
        <Badge colorScheme="green" fontSize="lg" py={1} px={2}>
          Test
        </Badge>
        <Spacer />
        <Heading size="lg" color={textColor} textAlign="center">
          {test.title}
        </Heading>
        <Spacer />
      </HStack>
      <HStack justify="space-between" width="full" mt={4}>
        <Text fontSize="sm" color={descriptionColor}>
          Window Start: {format(new Date(test.window_start), 'PPP p')}
        </Text>
        <Text fontSize="sm" color={descriptionColor}>
          Window End: {format(new Date(test.window_end), 'PPP p')}
        </Text>
      </HStack>
      <HStack justify="space-between" width="full" mt={4}>
        <Text fontSize="md" color={descriptionColor}>
          Total Marks: {test.total_mark}
        </Text>
        <Text fontSize="md" color={descriptionColor}>
          Duration: {test.duration} minutes
        </Text>
      </HStack>
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
