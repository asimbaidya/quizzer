import { TestStatus, SubmissionStatus, QuestionType } from './common';

export interface Question {
  question_data: {
    question_type: QuestionType;
    choices?: { text: string; correct: boolean }[];
    question_text: string;
    correct_answer: string | null;
    true_false_answer: boolean | null;
  };
  id: number;
  tag: string;
  question_set_id: number;
  question_type: QuestionType;
  total_marks: number;
  image?: string;
  image_url?: string;
  url?: string;
}

//  related to question
export interface SingleChoiceSubmissionResponse {
  question_type: 'single_choice';
  user_response: string;
  is_submitted: boolean;
  feedback?: string;
  score?: number;
}

export interface MultipleChoiceSubmissionResponse {
  question_type: 'multiple_choice';
  user_response: string[];
  is_submitted: boolean;
  feedback?: string;
  score?: number;
}

export interface UserInputSubmissionResponse {
  question_type: 'user_input';
  user_response: string;
  is_submitted: boolean;
  feedback?: string;
  score?: number;
}

export interface TrueFalseSubmissionResponse {
  question_type: 'true_false';
  user_response: boolean;
  is_submitted: boolean;
  feedback?: string;
  score?: number;
}

// define the interfaces for each question type response

export interface SingleChoiceResponse {
  question_type: 'single_choice';
  user_response: string;
}

export interface MultipleChoiceResponse {
  question_type: 'multiple_choice';
  user_response: string[];
}

export interface UserInputResponse {
  question_type: 'user_input';
  user_response: string;
}

export interface TrueFalseResponse {
  question_type: 'true_false';
  user_response: boolean;
}

// union type for questionstudentresponse
export type QuestionStudentResponse =
  | SingleChoiceResponse
  | MultipleChoiceResponse
  | UserInputResponse
  | TrueFalseResponse;

export interface StudentChoice {
  text: string;
}

export interface QuestionStudentData {
  question_type: QuestionType;
  question_text: string;
  choices?: StudentChoice[];
}

export interface QuestionStudentView {
  question_type: QuestionType;
  question_data: QuestionStudentData;
  tag: string;
  total_marks: number;
  url?: string;
  image_url?: string;
  image?: string;
  made_attempt?: boolean;
  is_correct: boolean;
  score: number;
  feedback: string;
}

export interface QuestionSubmissionStudentView {
  question_type: QuestionType;
  user_response?: QuestionStudentResponse;
  made_attempt: boolean;
  is_correct?: boolean;
  score?: number;
  feedback?: string;
  attempt_time?: Date;
  attempt_count?: number;
  status: SubmissionStatus;
}

export interface QuestionSubmission {
  question: QuestionStudentView;
  submission: QuestionSubmissionStudentView;
}

export interface QuizQuestionWithSubmission {
  question_submissions: QuestionSubmission[];
  total_mark: number;
  allowed_attempt: number;
  is_unlimited_attempt: boolean;
}

export interface TestQuestionWithSubmission {
  question_submissions: QuestionSubmission[];
  total_mark: number;
  start_time?: Date;
  status: TestStatus;
}
