import request from '../request';
import { User, Course, Quiz, Test, TeacherQuizAndTest } from '../types/common';
import { Question } from '../types/question';

//TODO: apply missing type annotations

export const fetchCourses = async (signal: AbortSignal): Promise<Course[]> => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  return await request<Course[]>({
    method: 'GET',
    url: '/API/teacher/courses',
    signal,
  });
};

export const fetchCourseDetails = async (
  courseTitle: string,
  signal: AbortSignal
): Promise<TeacherQuizAndTest> => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  return await request({
    method: 'GET',
    url: `/API/teacher/course/${courseTitle}`,
    signal,
  });
};

export const fetchEnrolledStudents = async (
  courseTitle: string,
  signal: AbortSignal
): Promise<User[]> => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  return await request({
    method: 'GET',
    url: `/API/teacher/course/students/${courseTitle}`,
    signal,
  });
};

export const fetchQuizQuestions = async (
  courseTitle: string,
  quizId: number,
  signal: AbortSignal
): Promise<Question[]> => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  return await request({
    method: 'GET',
    url: `/API/teacher/course/quiz/${courseTitle}/${quizId}`,
    signal,
  });
};

export const createQuestionOnAPIEndPoint = async (
  apiEndPoint: string,
  questionData: any,
  signal: AbortSignal
): Promise<any> => {
  console.log(questionData);
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  return await request({
    method: 'POST',
    url: apiEndPoint,
    signal,
    body: questionData,
  });
};

export const fetchTestQuestions = async (
  courseTitle: string,
  testId: number,
  signal: AbortSignal
): Promise<Question[]> => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  return await request({
    method: 'GET',
    url: `/API/teacher/course/test/${courseTitle}/${testId}`,
    signal,
  });
};

export const fetchQuizStudentProgress = async (
  courseTitle: string,
  quizId: number,
  signal: AbortSignal
): Promise<any> => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  return await request({
    method: 'GET',
    url: `/API/teacher/course/quiz/students/${courseTitle}/${quizId}`,
    signal,
  });
};

export const fetchTestStudentProgress = async (
  courseTitle: string,
  testId: number,
  signal: AbortSignal
): Promise<any> => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  return await request({
    method: 'GET',
    url: `/API/teacher/course/test/students/${courseTitle}/${testId}`,
    signal,
  });
};

export const createCourse = async (
  courseData: any,
  signal: AbortSignal
): Promise<any> => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  return await request({
    method: 'POST',
    url: '/API/teacher/course',
    signal,
    formData: courseData,
  });
};

export const createQuiz = async (
  courseTitle: string,
  quizData: any,
  signal: AbortSignal
): Promise<any> => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  return await request({
    method: 'POST',
    url: `/API/teacher/course/quiz/${courseTitle}`,
    signal,
    formData: quizData,
  });
};

export const createTest = async (
  courseTitle: string,
  testData: any,
  signal: AbortSignal
): Promise<any> => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  return await request({
    method: 'POST',
    url: `/API/teacher/course/test/${courseTitle}`,
    signal,
    formData: testData,
  });
};
