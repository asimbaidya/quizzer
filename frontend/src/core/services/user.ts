import request from '../request';
import { User } from '../types/common';

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

export const signUp = async (signal: AbortSignal, data: User): Promise<any> => {
  return await request({
    method: 'POST',
    url: '/API/user/signup',
    signal,
    body: data,
  });
};
