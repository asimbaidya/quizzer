import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  FormErrorMessage,
} from '@chakra-ui/react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define the Enroll Metadata schema
export const EnrollMetadataSchema = z.object({
  course_title: z.string().min(6, 'Title must be at least 6 characters long'),
  course_pin: z
    .string()
    .min(8, 'Course pin must be at least 8 characters long'),
});

const EnrollMetadataForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(EnrollMetadataSchema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Box maxW="md" mx="auto" p={5} borderWidth={1} borderRadius="lg">
      <Text fontSize="2xl" mb={5} textAlign="center">
        Enroll in Course
      </Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl mb={4} isInvalid={!!errors.course_title}>
          <FormLabel>Course Title</FormLabel>
          <Input {...register('course_title')} />
          <FormErrorMessage>{errors.course_title?.message}</FormErrorMessage>
        </FormControl>

        <FormControl mb={4} isInvalid={!!errors.course_pin}>
          <FormLabel>Course PIN</FormLabel>
          <Input type="password" {...register('course_pin')} />
          <FormErrorMessage>{errors.course_pin?.message}</FormErrorMessage>
        </FormControl>

        <Button mt={4} colorScheme="teal" type="submit">
          Enroll
        </Button>
      </form>
    </Box>
  );
};

export default EnrollMetadataForm;
