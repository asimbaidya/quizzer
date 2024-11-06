export type TestStatus =
  | 'not_opened' // Start window has not been reached
  | 'not_started' // Student has not started the test
  | 'in_progress' // Student is currently taking the test; duration left
  | 'in_waiting_for_result' // Test has ended and is waiting for the window to close
  | 'completed' // Student has completed the test
  | 'not_participated'; // Student has not participated in the test and the test has ended; this type of tests won't be visible to the student

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

// export interface NoteItem {
//   heading: string;
//   content: string;
//   flag: number;
// }

// export interface NoteData {
//   notes: NoteItem[];
// }

// export interface Note {
//   title: string;
//   note_data: NoteData;
//   id: number;
//   user_id: number;
//   created_at: Date;
//   updated_at?: Date;
//   url?: string;
// }

// Teacher(is the creator)
export interface Course {
  creator_id: number;
  title: string;
  created_at: string;
  is_open: boolean;
  id: number;
  description: string;
  course_pin: string;
  url: string;
}

export interface EnrollMetadata {
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
  url: string;
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
  url: string;
}

export interface TeacherQuizAndTest {
  quizzes: Quiz[];
  tests: Test[];
}

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
