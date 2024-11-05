import useCustomToast from '../../../hooks/useCustomToast';
import { CourseSchema } from '../../../core/schemas/common';
import { CustomError } from '../../../core/request';
import { createCourse } from '../../../core/services/teacher';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  FormErrorMessage,
  Textarea,
  Switch,
} from '@chakra-ui/react';

type CourseFormData = z.infer<typeof CourseSchema>;

const CourseCreateForm = () => {
  // common utility
  const queryClient = useQueryClient();
  const { showToast } = useCustomToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CourseFormData>({
    resolver: zodResolver(CourseSchema),
  });

  const mutation = useMutation({
    mutationFn: ({
      courseData,
      signal,
    }: {
      courseData: any;
      signal: AbortSignal;
    }) => createCourse(courseData, signal),
    onSuccess: () => {
      showToast({
        title: 'Course Created',
        description:
          'Course has been created successfully, you can now add Quiz and Test to this course',
        status: 'success',
      });

      reset();
      queryClient.invalidateQueries({
        queryKey: ['CreatedCourses'],
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

  const onSubmit = (data: CourseFormData) => {
    console.log(data);
    mutation.mutate({ courseData: data, signal: new AbortController().signal });
    // alert(JSON.stringify(data, null, 2));
  };

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
        Create Course
      </Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl mb={4} isInvalid={!!errors.title}>
          <FormLabel>Course Title</FormLabel>
          <Input {...register('title')} />
          <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Course Description</FormLabel>
          <Textarea
            {...register('description')}
            placeholder="No Description Added"
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Open for Enrollment</FormLabel>
          <Switch {...register('is_open')} defaultChecked />
        </FormControl>

        <FormControl mb={4} isInvalid={!!errors.course_pin}>
          <FormLabel>Course PIN</FormLabel>
          <Input type="text" {...register('course_pin')} />
          <FormErrorMessage>{errors.course_pin?.message}</FormErrorMessage>
        </FormControl>

        <Button mt={4} colorScheme="teal" type="submit">
          Create Course
        </Button>
      </form>
    </Box>
  );
};

export default CourseCreateForm;
