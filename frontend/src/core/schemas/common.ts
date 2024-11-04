// Enums
import { z } from 'zod';

// define the userrole enum
export const UserRole = z.enum(['admin', 'teacher', 'student']);

// update the userschema to use the userrole enum
export const UserSchema = z.object({
  full_name: z.string(),
  email: z.string().email(),
  role: UserRole,
  joined_at: z.date().optional(),
});

// students(note) related schemas
export const NoteItemSchema = z.object({
  heading: z.string(),
  content: z.string(),
  flag: z.number(),
});

export const NoteDataSchema = z.object({
  notes: z.array(NoteItemSchema),
});

export const NoteSchema = z.object({
  title: z.string(),
  note_data: NoteDataSchema,
  user_id: z.number(),
  created_at: z.date(),
  updated_at: z.date(),
});

// Teacher
export const CourseSchema = z.object({
  title: z.string().min(6, 'Title must be at least 6 characters long'),
  description: z.string().default('No Description Added'),
  is_open: z.boolean().default(true),
  course_pin: z
    .string()
    .min(8, 'Course pin must be at least 8 characters long')
    .max(24, 'Course pin must be at most 24 characters long')
    .default('KHUL_KHUL'),
});

export const QuizSchema = z.object({
  title: z.string().min(6, 'Title must be at least 6 characters long'),
  total_mark: z
    .number()
    .min(10, 'Minimum quiz mask should be 10')
    .max(100, '100 is max allowed quiz mark')
    .default(20),
  is_unlimited: z.boolean().default(false),
  allowed_attempt: z.number().default(1),
});

export const parseDate = (value: unknown): Date => {
  const date = new Date(value as string);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date');
  }
  return date;
};

export const TestSchema = z
  .object({
    title: z.string().min(1, 'Title is required').default('New Test'),
    total_mark: z.number().min(0, 'Total Mark must be at least 0').default(20),
    duration: z
      .number()
      .min(1, 'Duration must be at least 1 minute')
      .default(30),
    window_start: z.date().refine((date) => date >= new Date(), {
      message: 'Window start must be in the future',
    }),
    window_end: z.date().refine((date) => date >= new Date(), {
      message: 'Window end must be in the future',
    }),
  })
  .superRefine((data, ctx) => {
    const { window_start, window_end, duration } = data;

    // calculate the difference in minutes
    const differenceInMinutes =
      (window_end.getTime() - window_start.getTime()) / (1000 * 60);

    // validate the logic
    if (differenceInMinutes <= duration) {
      const minutesShort = duration - differenceInMinutes;
      ctx.addIssue({
        path: ['window_end'],
        message: `Window is  ${minutesShort} minutes shorter than the duration`,
        code: z.ZodIssueCode.custom,
      });
    }
  });

export const EnrollMetadataSchema = z.object({
  course_title: z.string().min(6, 'Title must be at least 6 characters long'),
  course_pin: z
    .string()
    .min(8, 'Course pin must be at least 8 characters long'),
});
