import request from '../request';
import { Course } from '../schemas/common';

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

// GET
// /API/admin/delete_unused_images
// Delete Unused Images

export const addUser = async (signal: AbortSignal): Promise<any> => {
  if (!localStorage.getItem('access_token')) {
    throw new Error('No Token');
  }
  return await request({
    method: 'POST',
    url: '/API/admin/users',
    signal,
  });
};

// POST
// /API/admin/users
// Add User
