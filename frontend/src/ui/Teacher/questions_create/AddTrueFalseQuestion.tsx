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

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TrueFalseQuestionSchema } from '../../../core/schemas/question_create';
import OptionalImageUpload from './OptionalImageUpload';
import useCustomToast from '../../../hooks/useCustomToast';
import { useQueryClient } from '@tanstack/react-query';

import { useMutation } from '@tanstack/react-query';
import { createQuestionOnAPIEndPoint } from '../../../core/services/teacher';

type TrueFalseQuestionFormData = z.infer<typeof TrueFalseQuestionSchema>;

const AddTrueFalseQuestion = ({ apiEndPoint }: { apiEndPoint: string }) => {
  const [image, setImage] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
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
  } = useForm<TrueFalseQuestionFormData>({
    resolver: zodResolver(TrueFalseQuestionSchema),
    defaultValues: {
      question_data: {
        question_text: '',
        true_false_answer: 'true',
      },
      tag: 'untagged',
      total_marks: 5,
      image: null,
    },
  });

  const questionText = watch('question_data.question_text', '');

  const onSubmit = (data: TrueFalseQuestionFormData) => {
    const formData = {
      ...data,
      image,
      question_data: {
        ...data.question_data,
        true_false_answer: selectedAnswer,
      },
    };

    const signal = new AbortController().signal;
    mutation.mutate({
      apiEndPoint: apiEndPoint,
      questionData: formData,
      signal,
    });

    // alert(`Submitted Data:\n${JSON.stringify(formData, null, 2)}`);
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

      {/* True/False Answer */}
      <FormControl
        isInvalid={!!errors.question_data?.true_false_answer}
        isRequired
        mt={4}
      >
        <FormLabel>Answer</FormLabel>
        <Flex mb={4}>
          <Button
            mr={2}
            colorScheme={selectedAnswer === true ? 'green' : 'gray'}
            onClick={() => setSelectedAnswer(true)}
            width={'50%'}
            fontSize={'xl'}
          >
            True
          </Button>
          <Button
            colorScheme={selectedAnswer === false ? 'green' : 'gray'}
            onClick={() => setSelectedAnswer(false)}
            width={'50%'}
            fontSize={'xl'}
          >
            False
          </Button>
        </Flex>
        {errors.question_data?.true_false_answer && (
          <p style={{ color: 'red' }}>
            {errors.question_data.true_false_answer.message}
          </p>
        )}
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

      {/* Submit Button */}
      <Button mt={4} colorScheme="blue" type="submit">
        Save
      </Button>
    </Box>
  );
};

export default AddTrueFalseQuestion;
