import request from '../request';
import { User } from '../types/common';

// TODO: Add type for data
export const deleteUnusedImages = async (signal: AbortSignal): Promise<any> => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  return await request({
    method: 'GET',
    url: '/API/admin/delete_unused_images',
    signal,
  });
};

// TODO: Add type for data
export const addUser = async (
  signal: AbortSignal,
  data: User
): Promise<any> => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  return await request({
    method: 'POST',
    url: '/API/admin/users',
    signal,
    formData: data,
  });
};
