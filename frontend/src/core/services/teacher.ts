import request from '../request';
import { Course } from '../types';

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

// GET
// /API/teacher/courses
// Get Courses

export const fetchCourseDetails = async (
  courseTitle: string,
  signal: AbortSignal
): Promise<any> => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  return await request({
    method: 'GET',
    url: `/API/teacher/course/${courseTitle}`,
    signal,
  });
};

// GET
// /API/teacher/course/{course_title}
// Get Quizzes And Tests In Course

export const fetchEnrolledStudents = async (
  courseTitle: string,
  signal: AbortSignal
): Promise<any> => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  return await request({
    method: 'GET',
    url: `/API/teacher/course/students/${courseTitle}`,
    signal,
  });
};

// GET
// /API/teacher/course/students/{course_title}
// Get Enrolled Students

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
    url: `/API/teacher/course/quiz/${courseTitle}/${quizId}`,
    signal,
  });
};

// GET
// /API/teacher/course/quiz/{course_title}/{quiz_id}
// Get Questions In Quiz

export const createQuizQuestion = async (
  courseTitle: string,
  quizId: number,
  questionData: any,
  signal: AbortSignal
): Promise<any> => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  return await request({
    method: 'POST',
    url: `/API/teacher/course/quiz/${courseTitle}/${quizId}`,
    signal,
    data: questionData,
  });
};

// POST
// /API/teacher/course/quiz/{course_title}/{quiz_id}
// Create Question In Quiz

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
    url: `/API/teacher/course/test/${courseTitle}/${testId}`,
    signal,
  });
};

// GET
// /API/teacher/course/test/{course_title}/{test_id}
// Get Questions In Test

export const createTestQuestion = async (
  courseTitle: string,
  testId: number,
  questionData: any,
  signal: AbortSignal
): Promise<any> => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  return await request({
    method: 'POST',
    url: `/API/teacher/course/test/${courseTitle}/${testId}`,
    signal,
    data: questionData,
  });
};

// POST
// /API/teacher/course/test/{course_title}/{test_id}
// Create Question In Test

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

// GET
// /API/teacher/course/quiz/students/{course_title}/{quiz_id}
// Get Student Progress In Quiz

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

// GET
// /API/teacher/course/test/students/{course_title}/{test_id}
// Get Student Progress In Test

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
    data: courseData,
  });
};

// POST
// /API/teacher/course
// Create Course

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
    data: quizData,
  });
};

// POST
// /API/teacher/course/quiz/{course_title}
// Create Quiz

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
    data: testData,
  });
};

// POST
// /API/teacher/course/test/{course_title}
// Create Test
