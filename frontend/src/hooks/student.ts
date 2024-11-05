import { useQuery, useMutation } from '@tanstack/react-query';
import {
  fetchEnrolledCourses,
  fetchCourseQuizzesAndTests,
  fetchQuizQuestions,
  startTest,
  fetchTestQuestions,
  fetchNotes,
  createNote,
  fetchNote,
  updateNote,
  deleteNote,
  submitQuestionAnswer,
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
    queryKey: ['quizQuestions', courseTitle, quizId],
    queryFn: ({ signal }: { signal: AbortSignal }) =>
      fetchQuizQuestions(courseTitle, quizId, signal),
  });
};

export const useTestQuestions = (courseTitle: string, testId: number) => {
  return useQuery({
    queryKey: ['testQuestions', courseTitle, testId],
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

// Fix THESE
export const mutationStartTest = () => {
  return useMutation({
    mutationFn: ({
      courseTitle,
      testId,
      signal,
    }: {
      courseTitle: string;
      testId: number;
      signal: AbortSignal;
    }) => startTest(courseTitle, testId, signal),
  });
};
export const mutationCreateNote = () => {
  return useMutation({
    mutationFn: ({
      noteData,
      signal,
    }: {
      noteData: any;
      signal: AbortSignal;
    }) => createNote(noteData, signal),
  });
};

export const mutationUpdateNote = () => {
  return useMutation({
    mutationFn: ({
      noteId,
      noteData,
      signal,
    }: {
      noteId: number;
      noteData: any;
      signal: AbortSignal;
    }) => updateNote(noteId, noteData, signal),
  });
};

export const mutationDeleteNote = () => {
  return useMutation({
    mutationFn: ({ noteId, signal }: { noteId: number; signal: AbortSignal }) =>
      deleteNote(noteId, signal),
  });
};

export const mutationSubmitQuestionAnswer = () => {
  return useMutation({
    mutationFn: ({
      questionId,
      answerData,
      signal,
    }: {
      questionId: number;
      answerData: any;
      signal: AbortSignal;
    }) => submitQuestionAnswer(questionId, answerData, signal),
  });
};
