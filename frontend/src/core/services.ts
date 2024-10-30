import request from './request';
import { User, Course } from '../core/schemas';

export const fetchEnrolledCourses = async () => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  return await request<Course[]>({
    method: 'GET',
    url: '/API/student/enrolled_courses',
  });
};
