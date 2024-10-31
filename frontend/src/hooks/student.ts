import { useQuery } from '@tanstack/react-query';
import { fetchEnrolledCourses } from '../core/services/student';

export const useEnrolledCourses = () => {
  return useQuery({
    queryKey: ['enrolledCourses'],
    queryFn: ({ signal }: { signal: AbortSignal }) =>
      fetchEnrolledCourses(signal),
  });
};
