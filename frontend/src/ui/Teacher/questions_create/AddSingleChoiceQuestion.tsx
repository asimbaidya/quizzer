import { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Switch,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Badge,
  HStack,
} from '@chakra-ui/react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SingleChoiceQuestionSchema } from '../../../core/schemas/question_create';
import OptionalImageUpload from './OptionalImageUpload';

import { useMutation } from '@tanstack/react-query';
import { createQuestionOnAPIEndPoint } from '../../../core/services/teacher';
import { useQueryClient } from '@tanstack/react-query';
import useCustomToast from '../../../hooks/useCustomToast';
import { z } from 'zod';

type SingleChoiceQuestionFormData = z.infer<typeof SingleChoiceQuestionSchema>;

const AddSingleChoiceQuestion = ({ apiEndPoint }: { apiEndPoint: string }) => {
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
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SingleChoiceQuestionFormData>({
    resolver: zodResolver(SingleChoiceQuestionSchema),
    defaultValues: {
      question_data: {
        question_type: 'single_choice',
        question_text: '',
        choices: [
          { text: '', correct: false },
          { text: '', correct: false },
          { text: '', correct: false },
          { text: '', correct: false },
        ],
      },
      tag: 'untagged',
      total_marks: 5,
      image: null,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'question_data.choices',
  });

  const questionText = watch('question_data.question_text', '');
  const choices = watch('question_data.choices');

  const onSubmit = (data: SingleChoiceQuestionFormData) => {
    const formData = { ...data, image };

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

      <FormControl mt={4}>
        <FormLabel>Upload Image (Optional)</FormLabel>
        <OptionalImageUpload setFile={setImage} />
      </FormControl>

      {/* {fields.map((field, index) => (
        <Flex key={field.id} alignItems="center" mt={4}>
          <Checkbox
            mr={2}
            isChecked={choices[index]?.correct}
            onChange={(e) => {
              // set all choices to false first
              fields.forEach((_, i) => {
                setValue(`question_data.choices.${i}.correct`, false);
              });
              // then set the selected one to true
              setValue(
                `question_data.choices.${index}.correct`,
                e.target.checked
              );
            }}
          />
          <Input
            placeholder={`Option ${index + 1}`}
            borderColor={choices[index]?.correct ? 'green.500' : undefined}
            focusBorderColor={choices[index]?.correct ? 'green.500' : undefined}
            {...register(`question_data.choices.${index}.text`)}
          />
          {index > 3 && (
            <Button ml={2} size="sm" onClick={() => remove(index)}>
              Remove
            </Button>
          )}
        </Flex>
      ))} */}

      {fields.map((field, index) => (
        <Flex key={field.id} alignItems="center" mt={4}>
          <Switch
            mr={2}
            size={'lg'}
            isChecked={choices[index]?.correct}
            onChange={(e) => {
              // Set all choices to false
              fields.forEach((_, i) => {
                setValue(`question_data.choices.${i}.correct`, false);
              });
              // Set the selected one to true
              setValue(
                `question_data.choices.${index}.correct`,
                e.target.checked
              );
            }}
          />
          <Input
            placeholder={`Option ${index + 1}`}
            borderColor={choices[index]?.correct ? 'green.500' : undefined}
            focusBorderColor={choices[index]?.correct ? 'green.500' : undefined}
            {...register(`question_data.choices.${index}.text`)}
          />
          {index > 3 && (
            <Button ml={2} size="sm" onClick={() => remove(index)}>
              Remove
            </Button>
          )}
        </Flex>
      ))}

      {errors.question_data?.choices?.root && (
        <p style={{ color: 'red' }}>
          {errors.question_data.choices.root.message}
        </p>
      )}

      <Button
        mt={4}
        onClick={() => append({ text: '', correct: false })}
        isDisabled={fields.length >= 6}
      >
        Add Option
      </Button>

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

export default AddSingleChoiceQuestion;
