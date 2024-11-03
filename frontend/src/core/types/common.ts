export type TestStatus =
  | 'not_opened'
  | 'not_started'
  | 'in_progress'
  | 'completed';
export type UserRole = 'admin' | 'teacher' | 'student';

export type QuestionType =
  | 'single_choice'
  | 'multiple_choice'
  | 'user_input'
  | 'true_false';

export type SubmissionStatus = 'viewed' | 'submitted';

export interface User {
  id: number;
  full_name: string;
  email: string;
  role: string;
  joined_at?: string;
}

export interface NoteItem {
  heading: string;
  content: string;
  flag: number;
}

export interface NoteData {
  notes: NoteItem[];
}

export interface Note {
  title: string;
  note_data: NoteData;
  id: number;
  user_id: number;
  created_at: Date;
  updated_at?: Date;
}

// Teacher(is the creator)
export interface Course {
  creator_id: number;
  title: string;
  created_at: string;
  is_open: boolean;
  id: number;
  description: string;
  course_pin: string;
}

interface EnrollMetadata {
  course_title: string;
  course_pin: string;
}

export interface Quiz {
  id: number;
  course_id: number;
  title: string;
  question_set_id: number;
  created_at: Date;
  updated_at?: Date;
  total_mark: number;
  is_unlimited_attempt: boolean;
  allowed_attempt: number;
}

export interface Test {
  id: number;
  course_id: number;
  question_set_id: number;
  title: string;
  duration: number;
  total_mark: number;
  window_start: Date;
  window_end: Date;
}
// export interface Quiz {
//   id: number;
//   course_id: number;
//   title: string;
//   question_set_id: number;
//   created_at: Date;
//   updated_at?: Date;
//   total_mark: number;
// }

// export interface Test {
//   id: number;
//   course_id: number;
//   question_set_id: number;
//   title: string;
//   duration: number;
//   total_mark: number;
//   time_window_start: Date;
//   time_window_end: Date;
// }

export interface StudentQuizProgress {
  quiz_total_mark: number;
  student_id: number;
  email: string;
  received_marks: number;
  total_attempts: number;
  total_questions_attempted: number;
  total_possible_marks: number;
  total_questions: number;
  weighted_marks: number;
  is_unlimited_attempt: boolean;
  total_allowed_attempt: number;
}

export interface StudentTestProgress {
  test_total_mark: number;
  student_id: number;
  email: string;
  received_marks: number;
  total_attempts: number;
  total_questions_attempted: number;
  total_possible_marks: number;
  total_questions: number;
  weighted_marks: number;
}

export interface QuizWithUrl extends Quiz {
  url: string;
}

export interface TestWithUrlAndStatus extends Test {
  url: string;
  status: TestStatus;
  start_url?: string;
}

export interface AllQuizzesTests {
  quizzes: QuizWithUrl[];
  tests: TestWithUrlAndStatus[];
}
