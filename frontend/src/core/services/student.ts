import request from '../request';
import { NotesDocument } from '../schemas/common';
import { Course, AllQuizzesTests, EnrollMetadata } from '../types/common';
import {
  QuizQuestionWithSubmission,
  TestQuestionWithSubmission,
} from '../types/question';

export const fetchEnrolledCourses = async (
  signal: AbortSignal
): Promise<Course[]> => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  return await request<Course[]>({
    method: 'GET',
    url: '/API/student/enrolled_courses',
    signal,
  });
};

export const fetchCourseQuizzesAndTests = async (
  courseTitle: string,
  signal: AbortSignal
): Promise<AllQuizzesTests> => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  return await request({
    method: 'GET',
    url: `/API/student/enrolled_courses/${courseTitle}`,
    signal,
  });
};

export const fetchQuizQuestions = async (
  courseTitle: string,
  quizId: number,
  signal: AbortSignal
): Promise<QuizQuestionWithSubmission> => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  return await request({
    method: 'GET',
    url: `/API/student/enrolled_courses/quiz/${courseTitle}/${quizId}`,
    signal,
  });
};

// TODO: fix the return type from any
export const startTest = async (
  courseTitle: string,
  testId: number,
  signal: AbortSignal
): Promise<any> => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  return await request({
    method: 'POST',
    url: `/API/student/enrolled_courses/test/${courseTitle}/${testId}`,
    signal,
  });
};

export const fetchTestQuestions = async (
  courseTitle: string,
  testId: number,
  signal: AbortSignal
): Promise<TestQuestionWithSubmission> => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  return await request({
    method: 'GET',
    url: `/API/student/enrolled_courses/test/${courseTitle}/${testId}`,
    signal,
  });
};

export const fetchNotes = async (
  signal: AbortSignal
): Promise<NotesDocument[]> => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  return await request({
    method: 'GET',
    url: '/API/student/notes',
    signal,
  });
};

// TODO: fix the return type from any
export const createNote = async (
  noteData: NotesDocument,
  signal: AbortSignal
): Promise<any> => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  return await request({
    method: 'POST',
    url: '/API/student/notes',
    signal,
    body: noteData,
  });
};

export const fetchNote = async (
  noteId: number,
  signal: AbortSignal
): Promise<NotesDocument> => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  return await request({
    method: 'GET',
    url: `/API/student/notes/${noteId}`,
    signal,
  });
};

export const updateNote = async (
  noteId: number,
  noteData: NotesDocument,
  signal: AbortSignal
): Promise<NotesDocument> => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  return await request({
    method: 'PUT',
    url: `/API/student/notes/${noteId}`,
    signal,
    body: noteData,
  });
};

export const deleteNote = async (
  noteId: number,
  signal: AbortSignal
): Promise<any> => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  return await request({
    method: 'DELETE',
    url: `/API/student/notes/${noteId}`,
    signal,
  });
};

// TODO: Fix the return type from any
export const enrollCourse = async (
  signal: AbortSignal,
  data: EnrollMetadata
): Promise<any> => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  return await request({
    method: 'POST',
    url: '/API/student/enrolled_courses/',
    signal,
    body: data,
  });
};

// TODO: Fix the return type from any
export const submitQuestionAnswerAtAPI = async (
  endPoint: string,
  answerData: any,
  signal: AbortSignal
): Promise<any> => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  return await request({
    method: 'POST',
    url: endPoint,
    signal,
    body: answerData,
  });
};
