import DatePicker from 'react-datepicker';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TestSchema } from '../../../core/schemas/common';
import 'react-datepicker/dist/react-datepicker.css';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useCustomToast from '../../../hooks/useCustomToast';
import { useParams } from '@tanstack/react-router';

import { createTest } from '../../../core/services/teacher';

import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Box,
  NumberInput,
  NumberInputField,
  Heading,
  FormErrorMessage,
  useColorModeValue,
} from '@chakra-ui/react';

type TestCreateFormData = z.infer<typeof TestSchema>;

const TestCreateForm: React.FC = () => {
  // common utility
  const queryClient = useQueryClient();
  const { showToast } = useCustomToast();
  const { courseTitle } = useParams({
    from: '/_layout/(teacher)/course/$courseTitle',
  });

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    reset,
  } = useForm<TestCreateFormData>({
    resolver: zodResolver(TestSchema),
    defaultValues: {
      title: 'New Test',
      total_mark: 20,
      duration: 30,

      window_start: new Date(Date.now() + 10 * 60 * 1000), // 10 minute from now
      window_end: new Date(Date.now() + 60 * 60 * 1000), // 60 minutes from now
    },
  });

  const mutation = useMutation({
    mutationFn: ({
      courseTitle,
      testData,
      signal,
    }: {
      courseTitle: string;
      testData: any;
      signal: AbortSignal;
    }) => createTest(courseTitle, testData, signal),
    onSuccess: () => {
      showToast({
        title: 'Test Created',
        description: 'Test has been created successfully',
        status: 'success',
      });

      reset();
      queryClient.invalidateQueries({
        queryKey: ['courseDetails', courseTitle],
      });
    },
    onError: (error) => {
      showToast({
        title: 'Test Creation Failed',
        description: error.message,
        status: 'error',
      });
    },
  });

  const onSubmit = (data: TestCreateFormData) => {
    const formattedData = {
      ...data,
      window_start: data.window_start.toISOString(),
      window_end: data.window_end.toISOString(),
    };
    // alert(JSON.stringify(formattedData, null, 2));
    // reset();

    mutation.mutate({
      courseTitle: courseTitle,
      testData: formattedData,
      signal: new AbortController().signal,
    });
  };

  const inputBg = useColorModeValue('gray.100', 'gray.700');

  return (
    <Box
      maxW="4xl"
      mx="auto"
      mt={8}
      p={6}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
      userSelect={'none'}
    >
      <Heading mb={6} textAlign="center">
        Create New Test
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* title */}
        <FormControl isInvalid={!!errors.title} mb={4}>
          <FormLabel fontSize={'lg'}>Title</FormLabel>
          <Input placeholder="Test Title" {...register('title')} bg={inputBg} />
          <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
        </FormControl>

        {/* total mark */}
        <FormControl isInvalid={!!errors.total_mark} mb={4}>
          <FormLabel fontSize={'lg'}>Total Mark</FormLabel>
          <NumberInput min={0}>
            <NumberInputField
              placeholder="Total Marks"
              {...register('total_mark', { valueAsNumber: true })}
              bg={inputBg}
            />
          </NumberInput>
          <FormErrorMessage>{errors.total_mark?.message}</FormErrorMessage>
        </FormControl>

        {/* duration */}
        <FormControl isInvalid={!!errors.duration} mb={4}>
          <FormLabel fontSize={'lg'}>Duration (minutes)</FormLabel>
          <NumberInput min={1}>
            <NumberInputField
              placeholder="Duration in minutes"
              {...register('duration', { valueAsNumber: true })}
              bg={inputBg}
            />
          </NumberInput>
          <FormErrorMessage>{errors.duration?.message}</FormErrorMessage>
        </FormControl>

        {/* window start */}
        <FormControl isInvalid={!!errors.window_start} mb={4}>
          <FormLabel fontSize={'lg'}>Window Start</FormLabel>
          <Controller
            control={control}
            name="window_start"
            render={({ field: { onChange, onBlur, value } }) => (
              <Box>
                <DatePicker
                  selected={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={30}
                  timeCaption="time"
                  dateFormat="MMMM d, yyyy h:mm aa"
                  placeholderText="Select date and time"
                  customInput={<Input bg={inputBg} />}
                  popperClassName="date-picker-popper"
                  popperPlacement="top-start"
                />
              </Box>
            )}
          />
          <FormErrorMessage>{errors.window_start?.message}</FormErrorMessage>
        </FormControl>

        {/* window end */}
        <FormControl isInvalid={!!errors.window_end} mb={4}>
          <FormLabel fontSize={'lg'}>Window End</FormLabel>
          <Controller
            control={control}
            name="window_end"
            render={({ field: { onChange, onBlur, value } }) => (
              <Box>
                <DatePicker
                  selected={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={30}
                  timeCaption="time"
                  dateFormat="MMMM d, yyyy h:mm aa"
                  placeholderText="Select date and time"
                  customInput={<Input bg={inputBg} />}
                  popperClassName="date-picker-popper"
                  popperPlacement="top-start"
                />
              </Box>
            )}
          />
          <FormErrorMessage>{errors.window_end?.message}</FormErrorMessage>
        </FormControl>

        <Button type="submit" colorScheme="teal" width="full" mt={4}>
          Create Test
        </Button>
      </form>
    </Box>
  );
};

export default TestCreateForm;
