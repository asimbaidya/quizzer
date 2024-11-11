import { useQuery, useMutation } from '@tanstack/react-query';
import {
  fetchEnrolledCourses,
  fetchCourseQuizzesAndTests,
  fetchQuizQuestions,
  fetchTestQuestions,
  fetchNotes,
  fetchNote,
} from '../core/services/student';

export const useEnrolledCourses = () => {
  return useQuery({
    queryKey: ['enrolledCourses'],
    queryFn: ({ signal }: { signal: AbortSignal }) =>
      fetchEnrolledCourses(signal),
  });
};

export const useCourseQuizzesAndTests = (courseTitle: string) => {
  return useQuery({
    queryKey: ['courseQuizzesAndTests', courseTitle],
    queryFn: ({ signal }: { signal: AbortSignal }) =>
      fetchCourseQuizzesAndTests(courseTitle, signal),
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

export const useNotes = () => {
  return useQuery({
    queryKey: ['notes'],
    queryFn: ({ signal }: { signal: AbortSignal }) => fetchNotes(signal),
  });
};

export const useNote = (noteId: number) => {
  return useQuery({
    queryKey: ['note', noteId],
    queryFn: ({ signal }: { signal: AbortSignal }) => fetchNote(noteId, signal),
  });
};
