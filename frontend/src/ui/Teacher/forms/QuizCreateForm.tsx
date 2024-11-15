import useCustomToast from '../../../hooks/useCustomToast';
import { CustomError } from '../../../core/request';
import { QuizSchema } from '../../../core/schemas/common';
import { createQuiz } from '../../../core/services/teacher';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Text,
  FormErrorMessage,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';

// Define the form data type from the schema
type QuizFormData = z.infer<typeof QuizSchema>;

const QuizCreateForm = () => {
  // common utility
  const queryClient = useQueryClient();
  const { showToast } = useCustomToast();
  const { courseTitle } = useParams({
    from: '/_layout/(teacher)/course/$courseTitle',
  });

  const inputBg = useColorModeValue('gray.100', 'gray.700');

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm<QuizFormData>({
    resolver: zodResolver(QuizSchema),
    defaultValues: {
      title: 'New Quiz',
      total_mark: 20,
      is_unlimited_attempt: false,
      allowed_attempt: 1,
    },
  });

  const mutation = useMutation({
    mutationFn: ({
      courseTitle,
      quizData,
      signal,
    }: {
      courseTitle: string;
      quizData: any;
      signal: AbortSignal;
    }) => createQuiz(courseTitle, quizData, signal),
    onSuccess: () => {
      showToast({
        title: 'Quiz Created',
        status: 'success',
      });

      reset();
      queryClient.invalidateQueries({
        queryKey: ['courseDetails', courseTitle],
      });
    },
    onError: (error) => {
      if (error instanceof CustomError) {
        showToast({
          title: 'Enrollment Failed',
          description: error.details,
          status: 'error',
        });
      } else {
        showToast({
          title: 'Enrollment Failed',
          description: error.name,
          status: 'error',
        });
      }
    },
  });

  const onSubmit = (data: QuizFormData) => {
    // alert(JSON.stringify(data, null, 2));
    mutation.mutate({
      courseTitle: courseTitle,
      quizData: data,
      signal: new AbortController().signal,
    });
  };

  const isUnlimited = watch('is_unlimited_attempt');
  return (
    <Box
      maxW="4xl"
      mx="auto"
      p={5}
      borderWidth={1}
      borderRadius="lg"
      userSelect={'none'}
    >
      <Text fontSize="2xl" mb={5} textAlign="center">
        Create Quiz
      </Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl mb={4} isInvalid={!!errors.title}>
          <FormLabel fontSize={'lg'}>Title</FormLabel>
          <Input {...register('title')} bg={inputBg} />
          <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
        </FormControl>

        <FormControl mb={4} isInvalid={!!errors.total_mark}>
          <FormLabel fontSize={'lg'}>Total Mark</FormLabel>
          <Input
            type="number"
            {...register('total_mark', { valueAsNumber: true })}
            bg={inputBg}
          />
          <FormErrorMessage>{errors.total_mark?.message}</FormErrorMessage>
        </FormControl>

        <HStack flex={1}>
          <FormControl mb={4} flexBasis={'50%'}>
            <HStack>
              <FormLabel fontSize={'lg'}>Unlimited Attempts</FormLabel>
              <Switch {...register('is_unlimited_attempt')} size={'lg'} />
            </HStack>
          </FormControl>

          {!isUnlimited && (
            <FormControl
              mb={4}
              isInvalid={!!errors.allowed_attempt}
              flexBasis={'50%'}
            >
              <HStack width={'100%'}>
                <FormLabel flexBasis={'80%'} fontSize={'lg'}>
                  Allowed Attempts
                </FormLabel>
                <Input
                  type="number"
                  {...register('allowed_attempt', { valueAsNumber: true })}
                  bg={inputBg}
                />
                <FormErrorMessage>
                  {errors.allowed_attempt?.message}
                </FormErrorMessage>
              </HStack>
            </FormControl>
          )}
        </HStack>

        <Button type="submit" colorScheme="teal" width="full" mt={4}>
          Create Quiz
        </Button>
      </form>
    </Box>
  );
};

export default QuizCreateForm;
