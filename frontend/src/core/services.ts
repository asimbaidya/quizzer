import request from './request';
import { User, Course } from '../core/schemas';

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

export const fetchUserData = async (signal: AbortSignal) => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  return await request<User>({
    method: 'GET',
    url: '/API/user/me',
    signal,
  });
};
