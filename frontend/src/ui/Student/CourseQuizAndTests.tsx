import { AllQuizzesTests } from '../../core/types/common';
import QuizList from './QuizList';
import TestList from './TestList';

interface CourseProps {
  quizandtests: AllQuizzesTests;
}

export default function Course({ quizandtests }: CourseProps) {
  console.log('quizandtests:', quizandtests);
  return (
    <>
      <QuizList quizzes={quizandtests.quizzes} />
      <TestList tests={quizandtests.tests} />
    </>
  );
}
