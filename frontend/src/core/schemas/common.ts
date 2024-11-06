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

export const NoteCreateSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long'),
  note_data: z.array(z.string()).default([]),
});
export type NoteCreateFormData = z.infer<typeof NoteCreateSchema>;

// zod schemas for notes
export const NoteItemSchema = z.object({
  title: z.string().default('Untitled'),
  content: z.string().default(''),
  flag: z.number().min(0).max(5).default(0),
  updatedAt: z.string().optional(),
});

export const NotesDocumentSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  note_data: z.array(NoteItemSchema),
  updated_at: z.string().optional(),
  created_at: z.string().optional(),
  url: z.string().optional(),
});
// typescript types
export type NoteItem = z.infer<typeof NoteItemSchema>;
export type NotesDocument = z.infer<typeof NotesDocumentSchema>;

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
  is_unlimited_attempt: z.boolean().default(false),
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
