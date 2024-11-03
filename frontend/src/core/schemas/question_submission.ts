import { z } from 'zod';

// single choice schema
export const SingleChoiceResponseSchema = z.object({
  question_type: z.literal('single_choice'),
  user_response: z.string(),
  is_submitted: z.boolean(),
  feedback: z.string().optional(),
  score: z.number().optional(),
});

// multiple choice schema
export const MultipleChoiceResponseSchema = z.object({
  question_type: z.literal('multiple_choice'),
  user_response: z.array(z.string()),
  is_submitted: z.boolean(),
  feedback: z.string().optional(),
  score: z.number().optional(),
});

// user input schema
export const UserInputResponseSchema = z.object({
  question_type: z.literal('user_input'),
  user_response: z.string(),
  is_submitted: z.boolean(),
  feedback: z.string().optional(),
  score: z.number().optional(),
});

// true/false schema
export const TrueFalseResponseSchema = z.object({
  question_type: z.literal('true_false'),
  user_response: z.boolean(),
  is_submitted: z.boolean(),
  feedback: z.string().optional(),
  score: z.number().optional(),
});
