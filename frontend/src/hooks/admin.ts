import { useMutation } from '@tanstack/react-query';
import { deleteUnusedImages, addUser } from '../core/services/admin';

export const mutationDeleteUnusedImages = () => {
  return useMutation({
    mutationFn: ({ signal }: { signal: AbortSignal }) =>
      deleteUnusedImages(signal),
  });
};

export const mutationAddUser = () => {
  return useMutation({
    mutationFn: ({ signal, data }: { signal: AbortSignal; data: any }) =>
      addUser(signal, data),
  });
};
