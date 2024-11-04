import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CourseSchema } from '../../../core/schemas/common';
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
import { z } from 'zod';

// define the form data type from the schema
type CourseFormData = z.infer<typeof CourseSchema>;

const CourseCreateForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CourseFormData>({
    resolver: zodResolver(CourseSchema),
  });

  const onSubmit = (data: CourseFormData) => {
    //
    alert(JSON.stringify(data, null, 2));
    reset();
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
