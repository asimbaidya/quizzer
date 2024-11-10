import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { CustomError } from '../../core/request';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { EnrollMetadataSchema } from '../../core/schemas/common';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useCustomToast from '../../hooks/useCustomToast';
import { EnrollMetadata } from '../../core/types/common';
import { enrollCourse } from '../../core/services/student';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  FormErrorMessage,
} from '@chakra-ui/react';

type EnrollMetadataFormInputs = z.infer<typeof EnrollMetadataSchema>;

const EnrollMetadataForm: React.FC = () => {
  // common utility
  const queryClient = useQueryClient();
  const { showToast } = useCustomToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EnrollMetadataFormInputs>({
    resolver: zodResolver(EnrollMetadataSchema),
    defaultValues: {
      course_title: 'TNT101',
      course_pin: '12345678',
    },
  });

  const mutation = useMutation({
    mutationFn: ({
      data,
      signal,
    }: {
      data: EnrollMetadata;
      signal: AbortSignal;
    }) => enrollCourse(signal, data),
    onSuccess: () => {
      reset();

      showToast({
        title: 'Enrolled Successfully',
        description: 'You have successfully enrolled',
        status: 'success',
      });
      queryClient.invalidateQueries({
        queryKey: ['enrolledCourses'],
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

  const onSubmit: SubmitHandler<EnrollMetadataFormInputs> = (data) => {
    mutation.mutate({
      data: data,
      signal: new AbortController().signal,
    });
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      p={5}
      borderWidth={1}
      borderRadius="lg"
      userSelect={'none'}
    >
      <Text fontSize="lg" mb={5} textAlign="center">
        Enroll in Course
      </Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl mb={4} isInvalid={!!errors.course_title}>
          <FormLabel fontSize="lg">Course Title</FormLabel>
          <Input fontSize="lg" {...register('course_title')} />
          <FormErrorMessage fontSize="lg">
            {errors.course_title?.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl mb={4} isInvalid={!!errors.course_pin}>
          <FormLabel fontSize="lg">Course PIN</FormLabel>
          <Input fontSize="lg" type="text" {...register('course_pin')} />
          <FormErrorMessage fontSize="lg">
            {errors.course_pin?.message}
          </FormErrorMessage>
        </FormControl>

        <Button mt={4} colorScheme="teal" type="submit" fontSize="lg">
          Enroll
        </Button>
      </form>
    </Box>
  );
};

export default EnrollMetadataForm;
