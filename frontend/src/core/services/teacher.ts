import request from '../request';
import { Course } from '../schemas/common';

// export const fetchEnrolledCourses = async (signal: AbortSignal) => {
//   if (!localStorage.getItem('access_token')) {
//     throw new Error('No Token');
//   }
//   return await request<Course[]>({
//     method: 'GET',
//     url: '/API/student/enrolled_courses',
//     signal,
//   });
// };

export const fetchCreatedCourses = async (signal: AbortSignal) => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  return await request<Course[]>({
    method: 'GET',
    url: '/API/teacher/created_courses',
    signal,
  });
};
// GET
// /API/teacher/course/test/{course_title}/{test_id}
// Get Questions In Test

export const fetchCreatedTestsAndQuizzes = async (signal: AbortSignal) => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  // todo
};

export const fetchEnrolledStudents = async (signal: AbortSignal) => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  //   todo
};

// GET
// /API/teacher/courses
// Get Courses

// GET
// /API/teacher/course/{course_title}
// Get Quizzes And Tests In Course

// GET
// /API/teacher/course/students/{course_title}
// Get Enrolled Students

// GET
// /API/teacher/course/quiz/{course_title}/{quiz_id}
// Get Questions In Quiz

// POST
// /API/teacher/course/quiz/{course_title}/{quiz_id}
// Create Question In Quiz

// GET
// /API/teacher/course/test/{course_title}/{test_id}
// Get Questions In Test

export const fetchTestQuestions = async (
  courseTitle: string,
  testId: string,
  signal: AbortSignal
) => {
  const path = `/API/teacher/course/test/${courseTitle}/${testId}`;

  return await request<Course[]>({
    method: 'GET',
    url: path,
    signal,
  });
};

// POST
// /API/teacher/course/test/{course_title}/{test_id}
// Create Question In Test

// GET
// /API/teacher/course/students/{course_title}/{quiz_id}
// Get Student Progress

// POST
// /API/teacher/course
// Create Course

// POST
// /API/teacher/course/quiz/{course_title}
// Create Quiz

// POST
// /API/teacher/course/test/{course_title}
// Create Test
