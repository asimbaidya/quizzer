import request from '../request';
import { Course } from '../types';

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

// GET
// /API/student/enrolled_courses
// Get All Enrolled Courses Link

export const fetchCourseQuizzesAndTests = async (
  courseTitle: string,
  signal: AbortSignal
): Promise<any> => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  return await request({
    method: 'GET',
    url: `/API/student/enrolled_courses/${courseTitle}`,
    signal,
  });
};

// GET
// /API/student/enrolled_courses/{course_title}
// Get All Quiz And Test In Enrolled Course

export const fetchQuizQuestions = async (
  courseTitle: string,
  quizId: number,
  signal: AbortSignal
): Promise<any> => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  return await request({
    method: 'GET',
    url: `/API/student/enrolled_courses/quiz/${courseTitle}/${quizId}`,
    signal,
  });
};

// GET
// /API/student/enrolled_courses/quiz/{course_title}/{quiz_id}
// Get All Question In A Quiz Of Enrolled Course

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

// POST
// /API/student/enrolled_courses/test/{course_title}/{test_id}
// Start Test

export const fetchTestQuestions = async (
  courseTitle: string,
  testId: number,
  signal: AbortSignal
): Promise<any> => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  return await request({
    method: 'GET',
    url: `/API/student/enrolled_courses/test/${courseTitle}/${testId}`,
    signal,
  });
};

// GET
// /API/student/enrolled_courses/test/{course_title}/{test_id}
// Get All Question In A Test Of Enrolled Course

export const fetchNotes = async (signal: AbortSignal): Promise<any> => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  return await request({
    method: 'GET',
    url: '/API/student/notes',
    signal,
  });
};

// GET
// /API/student/notes
// Get All Note Of User

export const createNote = async (
  noteData: any,
  signal: AbortSignal
): Promise<any> => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  return await request({
    method: 'POST',
    url: '/API/student/notes',
    signal,
    data: noteData,
  });
};

// POST
// /API/student/notes
// Create Note For User

export const fetchNote = async (
  noteId: number,
  signal: AbortSignal
): Promise<any> => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  return await request({
    method: 'GET',
    url: `/API/student/notes/${noteId}`,
    signal,
  });
};

// GET
// /API/student/notes/{note_id}
// Get Specific Note Of User

export const updateNote = async (
  noteId: number,
  noteData: any,
  signal: AbortSignal
): Promise<any> => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  return await request({
    method: 'PUT',
    url: `/API/student/notes/${noteId}`,
    signal,
    data: noteData,
  });
};

// PUT
// /API/student/notes/{note_id}
// Update Note For User

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

// DELETE
// /API/student/notes/{note_id}
// Delete Note For User

export const enrollCourse = async (
  coursePin: string,
  courseTitle: string,
  signal: AbortSignal
): Promise<any> => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  return await request({
    method: 'POST',
    url: '/API/student/enrolled_courses/',
    signal,
    data: { coursePin, courseTitle },
  });
};

// POST
// /API/student/enrolled_courses/
// Enroll Course With Course Pin And Course Title

export const submitQuestionAnswer = async (
  questionId: number,
  answerData: any,
  signal: AbortSignal
): Promise<any> => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  return await request({
    method: 'POST',
    url: `/API/student/questions/submit/${questionId}`,
    signal,
    data: answerData,
  });
};

// POST
// /API/student/questions/submit/{question_id}
// Submit Question Answer
