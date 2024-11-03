import { z } from 'zod';

// schema for true/false question data
export const TrueFalseQuestionDataSchema = z.object({
  question_type: z.literal('true_false'),
  question_text: z
    .string()
    .min(4, 'Question text must be at least 4 characters')
    .max(100, 'Question text cannot exceed 100 characters'),
  true_false_answer: z.enum(['true', 'false']),
});

// full schema for true/false question
export const TrueFalseQuestionSchema = z.object({
  question_data: TrueFalseQuestionDataSchema,
  tag: z.string().min(1, 'Tag is required').default('untagged'),
  total_marks: z
    .number({ required_error: 'Total marks are required' })
    .min(1, 'Total marks must be at least 1')
    .max(100, 'Total marks cannot exceed 100')
    .default(5),
  image: z
    .string()
    .max(255, 'Image URL cannot exceed 255 characters')
    .nullable()
    .optional(),
});

// schema for user input question data
export const UserInputQuestionDataSchema = z.object({
  question_type: z.literal('user_input'),
  question_text: z
    .string()
    .min(4, 'Question text must be at least 4 characters')
    .max(100, 'Question text cannot exceed 100 characters'),
  correct_answer: z.string().min(1, 'Correct answer is required'),
});

// full schema for user input question
export const UserInputQuestionSchema = z.object({
  question_data: UserInputQuestionDataSchema,
  tag: z.string().min(1, 'Tag is required').default('untagged'),
  total_marks: z
    .number({ required_error: 'Total marks are required' })
    .min(1, 'Total marks must be at least 1')
    .max(100, 'Total marks cannot exceed 100')
    .default(5),
  image: z
    .string()
    .max(255, 'Image URL cannot exceed 255 characters')
    .nullable()
    .optional(),
});

// choice common in single_choice and multiple_choice
const ChoiceSchema = z.object({
  text: z.string().min(1, 'Choice text is required'),
  correct: z.boolean(),
});

// single choice question schema
export const SingleChoiceQuestionSchema = z.object({
  question_data: z.object({
    question_type: z.literal('single_choice'),
    question_text: z
      .string()
      .min(4, 'Question text must be at least 4 characters')
      .max(100, 'Question text cannot exceed 100 characters'),
    choices: z
      .array(ChoiceSchema)
      .min(4, 'At least two choices are required')
      .max(6, 'At most Six choices are allowed')
      .refine(
        (choices) => choices.filter((choice) => choice.correct).length === 1,
        'Exactly one choice must be marked as correct'
      ),
  }),
  tag: z.string().min(1, 'Tag is required'),
  total_marks: z
    .number()
    .min(1, 'Total marks must be at least 1')
    .max(100, 'Total marks cannot exceed 100'),
  image: z.string().nullable().optional(),
});

// Multiple Choice Question Schema
export const MultipleChoiceQuestionSchema = z.object({
  question_data: z.object({
    question_type: z.literal('multiple_choice'),
    question_text: z
      .string()
      .min(4, 'Question text must be at least 4 characters')
      .max(100, 'Question text cannot exceed 100 characters'),
    choices: z
      .array(ChoiceSchema)
      .min(4, 'At least two choices are required')
      .max(6, 'At most Six choices are allowed')
      .refine(
        (choices) => choices.some((choice) => choice.correct),
        'At least one choice must be marked as correct'
      ),
  }),
  tag: z.string().min(1, 'Tag is required'),
  total_marks: z
    .number()
    .min(1, 'Total marks must be at least 1')
    .max(100, 'Total marks cannot exceed 100'),
  image: z.string().nullable().optional(),
});
