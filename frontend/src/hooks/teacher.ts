import { useQuery, useMutation } from '@tanstack/react-query';
import {
  fetchCourses,
  fetchCourseDetails,
  fetchEnrolledStudents,
  fetchQuizQuestions,
  fetchTestQuestions,
  fetchQuizStudentProgress,
  fetchTestStudentProgress,
} from '../core/services/teacher';

export const useCreatedCourses = () => {
  return useQuery({
    queryKey: ['CreatedCourses'],
    queryFn: ({ signal }: { signal: AbortSignal }) => fetchCourses(signal),
  });
};

export const useCourseDetails = (courseTitle: string) => {
  return useQuery({
    queryKey: ['courseDetails', courseTitle],
    queryFn: ({ signal }: { signal: AbortSignal }) =>
      fetchCourseDetails(courseTitle, signal),
  });
};

export const useEnrolledStudents = (courseTitle: string) => {
  return useQuery({
    queryKey: ['enrolledStudents', courseTitle],
    queryFn: ({ signal }: { signal: AbortSignal }) =>
      fetchEnrolledStudents(courseTitle, signal),
  });
};

export const useQuizQuestions = (courseTitle: string, quizId: number) => {
  return useQuery({
    queryKey: ['Questions'],
    queryFn: ({ signal }: { signal: AbortSignal }) =>
      fetchQuizQuestions(courseTitle, quizId, signal),
  });
};

export const useTestQuestions = (courseTitle: string, testId: number) => {
  return useQuery({
    queryKey: ['Questions'],
    queryFn: ({ signal }: { signal: AbortSignal }) =>
      fetchTestQuestions(courseTitle, testId, signal),
  });
};

export const useQuizStudentProgress = (courseTitle: string, quizId: number) => {
  return useQuery({
    queryKey: ['quizStudentProgress', courseTitle, quizId],
    queryFn: ({ signal }: { signal: AbortSignal }) =>
      fetchQuizStudentProgress(courseTitle, quizId, signal),
  });
};

export const useTestStudentProgress = (courseTitle: string, testId: number) => {
  return useQuery({
    queryKey: ['testStudentProgress', courseTitle, testId],
    queryFn: ({ signal }: { signal: AbortSignal }) =>
      fetchTestStudentProgress(courseTitle, testId, signal),
  });
};
