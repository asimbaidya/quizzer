import { Question } from '../../../core/types/question';
import ViewMultipleChoice from './ViewMultipleChoice';
import ViewSingleChoice from './ViewSingleChoice';
import ViewTrueFalse from './ViewTrueFalse';
import ViewUserInput from './ViewUserInput';

export default function ViewQuizQuestions({
  questions,
}: {
  questions: Question[];
}) {
  return (
    <>
      {questions.map((question, index) => {
        switch (question.question_type) {
          case 'single_choice':
            return <ViewSingleChoice key={index} question={question} />;
          case 'multiple_choice':
            return <ViewMultipleChoice key={index} question={question} />;
          case 'user_input':
            return <ViewUserInput key={index} question={question} />;
          case 'true_false':
            return <ViewTrueFalse key={index} question={question} />;
          default:
            return null;
        }
      })}
    </>
  );
}
