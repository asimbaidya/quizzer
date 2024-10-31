import { useQuery } from '@tanstack/react-query';
import { fetchEnrolledCourses } from '../core/services/student';
import { fetchTestQuestions } from '../core/services/teacher';

export const useCreatedCourses = () => {
  return useQuery({
    queryKey: ['CreatedCourses'],
    queryFn: ({ signal }: { signal: AbortSignal }) =>
      fetchEnrolledCourses(signal),
  });
};

export const useTestQuestions = (courseTitle: string, testId: string) => {
  return useQuery({
    queryKey: ['testQuestions', courseTitle, testId],
    queryFn: ({ signal }: { signal: AbortSignal }) =>
      fetchTestQuestions(courseTitle, testId, signal),
  });
};
