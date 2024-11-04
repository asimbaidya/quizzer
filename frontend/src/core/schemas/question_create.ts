import { z } from 'zod';

// schema for true/false question data
export const TrueFalseQuestionDataSchema = z.object({
  question_type: z.literal('true_false').default('true_false'),
  question_text: z
    .string()
    .min(4, 'Question text must be at least 4 characters')
    .max(100, 'Question text cannot exceed 100 characters'),
  true_false_answer: z.enum(['true', 'false']),
});

// full schema for true/false question
export const TrueFalseQuestionSchema = z.object({
  question_type: z.literal('true_false').default('true_false'),
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
  question_type: z.literal('user_input').default('user_input'),
  question_text: z
    .string()
    .min(4, 'Question text must be at least 4 characters')
    .max(100, 'Question text cannot exceed 100 characters'),
  correct_answer: z.string().min(1, 'Correct answer is required'),
});

// full schema for user input question
export const UserInputQuestionSchema = z.object({
  question_type: z.literal('user_input').default('user_input'),
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

// choice schema common to both question types
const ChoiceSchema = z.object({
  text: z.string().min(1, 'Choice text is required'),
  correct: z.boolean(),
});

// single choice question schema
export const SingleChoiceQuestionSchema = z.object({
  question_type: z.literal('single_choice').default('single_choice'),
  question_data: z.object({
    question_type: z.literal('single_choice').default('single_choice'),
    question_text: z
      .string()
      .min(4, 'Question text must be at least 4 characters')
      .max(100, 'Question text cannot exceed 100 characters'),
    choices: z
      .array(ChoiceSchema)
      .min(4, 'At least four choices are required')
      .max(6, 'At most six choices are allowed')
      // ensure exactly one correct choice
      .refine(
        (choices) => choices.filter((choice) => choice.correct).length === 1,
        {
          message: 'Exactly one choice must be marked as correct',
          path: ['root'],
        }
      )
      // ensure all choices are unique
      .refine(
        (choices) => {
          const texts = choices.map((choice) => choice.text.trim());
          const uniqueTexts = new Set(texts);
          return texts.length === uniqueTexts.size;
        },
        {
          message: 'All choices must be unique',
          path: ['root'],
        }
      ),
  }),
  tag: z.string().min(1, 'Tag is required'),
  total_marks: z
    .number()
    .min(1, 'Total marks must be at least 1')
    .max(100, 'Total marks cannot exceed 100'),
  image: z.string().nullable().optional(),
});

// multiple choice question schema
export const MultipleChoiceQuestionSchema = z.object({
  question_type: z.literal('multiple_choice').default('multiple_choice'),
  question_data: z.object({
    question_type: z.literal('multiple_choice').default('multiple_choice'),
    question_text: z
      .string()
      .min(4, 'Question text must be at least 4 characters')
      .max(100, 'Question text cannot exceed 100 characters'),
    choices: z
      .array(ChoiceSchema)
      .min(4, 'At least four choices are required')
      .max(6, 'At most six choices are allowed')
      // ensure at least one correct choice
      .refine((choices) => choices.some((choice) => choice.correct), {
        message: 'At least one choice must be marked as correct',
        path: ['root'],
      })
      // ensure all choices are unique
      .refine(
        (choices) => {
          const texts = choices.map((choice) => choice.text.trim());
          const uniqueTexts = new Set(texts);
          return texts.length === uniqueTexts.size;
        },
        {
          message: 'All choices must be unique',
          path: ['root'],
        }
      ),
  }),
  tag: z.string().min(1, 'Tag is required'),
  total_marks: z
    .number()
    .min(1, 'Total marks must be at least 1')
    .max(100, 'Total marks cannot exceed 100'),
  image: z.string().nullable().optional(),
});
