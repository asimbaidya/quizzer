import request from '../request';
import { User } from '../schemas/common';

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
