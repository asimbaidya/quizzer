import request from '../request';
import { Course } from '../schemas/common';

export const fetchEnrolledCourses = async (signal: AbortSignal) => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  return await request<Course[]>({
    method: 'GET',
    url: '/API/student/enrolled_courses',
    signal,
  });
};
