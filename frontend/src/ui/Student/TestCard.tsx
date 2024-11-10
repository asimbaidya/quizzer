import {
  Box,
  Heading,
  Text,
  Button,
  Flex,
  Badge,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { MdAccessTime, MdEvent, MdCalendarToday } from 'react-icons/md';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { TestStatus } from '../../core/types/common';
import { TestWithUrlAndStatus } from '../../core/types/common';
import { useMutation } from '@tanstack/react-query';
import { startTest } from '../../core/services/student';
import useCustomToast from '../../hooks/useCustomToast';
import { CustomError } from '../../core/request';

const formatStatus = (status: TestStatus): string => {
  switch (status) {
    case 'not_opened':
      return 'Not Opened';
    case 'not_started':
      return 'Start The Start To See Question';
    case 'in_progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    default:
      return status;
  }
};

const TestCard = ({ test }: { test: TestWithUrlAndStatus }) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const cardBorder = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const navigate = useNavigate();
  const { showToast } = useCustomToast();

  const mutation = useMutation({
    mutationFn: ({
      courseTitle,
      testId,
      signal,
    }: {
      courseTitle: string;
      testId: number;
      signal: AbortSignal;
    }) => startTest(courseTitle, testId, signal),
    onSuccess: (data) => {
      navigate({ to: test.url });
      showToast({
        title: 'Test Started',
        status: 'success',
      });
    },
    onError: (error) => {
      let msg = error.message;
      if (error instanceof CustomError) {
        msg = error.details;
      }
      showToast({
        title: 'Failed to start test',
        description: msg,
        status: 'error',
      });
    },
  });

  const handleStart = async () => {
    if (!test.start_url) {
      showToast({
        title: 'Failed to start test',
        description: 'Test start url is not available -> ' + test.start_url,
        status: 'error',
      });
      return;
    }

    const parts: string[] = test.start_url.split('/');

    const courseTitle: string = parts[parts.length - 2];
    const courseId: string = parts[parts.length - 1];
    mutation.mutate({
      courseTitle: courseTitle,
      testId: Number(courseId),
      signal: new AbortController().signal,
    });
  };

  return (
    <Box
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
        colorScheme={'teal.200'}
        color={'tomato'}
        position="absolute"
        top={4}
        right={4}
        p={4}
        borderRadius={'md'}
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
          <Icon as={MdCalendarToday} w={5} h={5} mr={2} color="purple.500" />
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
      {test.status === 'not_started' ? (
        <Button mt={4} colorScheme="teal" width="full" onClick={handleStart}>
          Start Test
        </Button>
      ) : (
        <Link to={test.url}>
          <Button
            mt={4}
            colorScheme="teal"
            width="full"
            isDisabled={
              test.status !== 'in_progress' && test.status !== 'completed'
            }
          >
            Go to Test
          </Button>
        </Link>
      )}
    </Box>
  );
};

export default TestCard;
