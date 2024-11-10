import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Badge,
  HStack,
  Flex,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { createQuestionOnAPIEndPoint } from '../../../core/services/teacher';

import { UserInputQuestionSchema } from '../../../core/schemas/question_create';
import useCustomToast from '../../../hooks/useCustomToast';
import { useQueryClient } from '@tanstack/react-query';

import OptionalImageUpload from './OptionalImageUpload';

type UserInputQuestionFormData = z.infer<typeof UserInputQuestionSchema>;

const AddUserInputQuestion = ({ apiEndPoint }: { apiEndPoint: string }) => {
  const [image, setImage] = useState<string | null>(null);
  const { showToast } = useCustomToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      apiEndPoint,
      questionData,
      signal,
    }: {
      apiEndPoint: string;
      questionData: any;
      signal: AbortSignal;
    }) => createQuestionOnAPIEndPoint(apiEndPoint, questionData, signal),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['Questions'],
      });
      // reset the form
      reset();
      setImage(null);

      showToast({
        title: 'Question Submitted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      showToast({
        title: 'Failed to submit question',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<UserInputQuestionFormData>({
    resolver: zodResolver(UserInputQuestionSchema),
    defaultValues: {
      question_data: {
        question_text: '',
      },
      tag: 'untagged',
      total_marks: 5,
      image: null,
    },
  });

  // watch the question_text and correct_answer fields for character count
  const questionText = watch('question_data.question_text', '');
  const correctAnswer = watch('question_data.correct_answer', '');

  const onSubmit = (data: UserInputQuestionFormData) => {
    // include the image in the data
    // console.log(data);
    const formData = { ...data, image };
    // console.log(formData);

    const signal = new AbortController().signal;
    mutation.mutate({
      apiEndPoint: apiEndPoint,
      questionData: formData,
      signal,
    });

    // alert(`Submitted Data:\n${JSON.stringify(formData, null, 2)}`);
    // console.log(`${JSON.stringify(formData, null, 2)}`);
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      mb={4}
    >
      {/* Question Text */}
      <FormControl isInvalid={!!errors.question_data?.question_text} isRequired>
        <FormLabel>Question Text</FormLabel>
        <Textarea
          placeholder="Enter your question"
          maxLength={100}
          {...register('question_data.question_text')}
          fontSize={'4xl'}
        />
        <Flex justifyContent="space-between">
          {errors.question_data?.question_text && (
            <p style={{ color: 'red' }}>
              {errors.question_data.question_text.message}
            </p>
          )}
          <Box alignSelf="flex-end" color="gray.500">
            {questionText.length}/100
          </Box>
        </Flex>
      </FormControl>

      {/* Image Upload */}
      <FormControl mt={4}>
        <FormLabel>Upload Image (Optional)</FormLabel>
        <OptionalImageUpload setFile={setImage} />
      </FormControl>

      {/* Correct Answer */}
      <FormControl
        isInvalid={!!errors.question_data?.correct_answer}
        isRequired
        mt={4}
      >
        <FormLabel>Correct Answer</FormLabel>
        <Input
          placeholder="Enter the correct answer"
          maxLength={60}
          {...register('question_data.correct_answer')}
        />
        <Flex justifyContent="space-between">
          {errors.question_data?.correct_answer && (
            <p style={{ color: 'red' }}>
              {errors.question_data.correct_answer.message}
            </p>
          )}
          <Box alignSelf="flex-end" color="gray.500">
            {correctAnswer.length}/60
          </Box>
        </Flex>
      </FormControl>

      <HStack spacing={4} mt={4} justify="space-between">
        <FormControl isInvalid={!!errors.tag} isRequired flex={1}>
          <Flex align="center" gap={2}>
            <FormLabel margin={0}>Tag:</FormLabel>
            <Badge
              variant="subtle"
              colorScheme="blue"
              py={2}
              px={4}
              fontSize="md"
              borderRadius="md"
            >
              <Input
                variant="unstyled"
                placeholder="Enter a tag"
                {...register('tag')}
              />
            </Badge>
          </Flex>
          {errors.tag && <p style={{ color: 'red' }}>{errors.tag.message}</p>}
        </FormControl>

        <FormControl isInvalid={!!errors.total_marks} isRequired width="auto">
          <Flex align="center" gap={2}>
            <FormLabel margin={0}>Marks:</FormLabel>
            <Input
              type="number"
              placeholder="Marks"
              min={1}
              max={100}
              color="yellow.500"
              width="80px"
              {...register('total_marks', { valueAsNumber: true })}
            />
          </Flex>
          {errors.total_marks && (
            <p style={{ color: 'red' }}>{errors.total_marks.message}</p>
          )}
        </FormControl>
      </HStack>

      <Button mt={4} colorScheme="blue" type="submit">
        Save
      </Button>
    </Box>
  );
};

export default AddUserInputQuestion;
