from app.schemas.question import QuestionTeacherView, QuestionType
from app.schemas.question_submission import QuestionStudentSubmission


def mark_user_submission(  # noqa: C901
    user_submission: QuestionStudentSubmission, question_create: QuestionTeacherView
) -> QuestionStudentSubmission:
    # Extract the necessary data
    question_data = question_create.question_data
    user_response = user_submission.user_response

    # Initialize score and feedback
    score = 0
    feedback = ''
    is_correct = False

    # Determine the correct answer based on the question type
    correct_answer = None

    if question_data.question_type == QuestionType.SINGLE_CHOICE:
        if question_data.choices is None:
            raise Exception('Choices are required for single choice questions.')
        correct_answer = next(
            (choice.text for choice in question_data.choices if choice.correct), None
        )
        if user_response.user_response == correct_answer:
            score = question_create.total_marks
            is_correct = True
            feedback = 'Correct! Your answer is right.'
        else:
            feedback = f'Incorrect. The correct answer is: {correct_answer}, you answered: str({user_response.user_response})'

    elif question_data.question_type == QuestionType.MULTIPLE_CHOICE:
        if not isinstance(question_data.choices, list):
            raise Exception('Choices are required for multiple choice questions.')
        correct_answers = {
            choice.text for choice in question_data.choices if choice.correct
        }
        if not isinstance(user_response.user_response, list):
            raise Exception(
                'User response should be a list for multiple choice questions'
            )
        user_answers = set(user_response.user_response)
        if user_answers == correct_answers:
            score = question_create.total_marks
            is_correct = True
            feedback = 'Correct! All your answers are right.'
        elif user_answers.intersection(correct_answers):
            feedback = f'Partially correct. The correct answers are: {correct_answers}., your answers are: {user_answers}'
        else:
            feedback = f'Incorrect. The correct answers are: {correct_answers}, your answers are: {user_answers}'

    elif question_data.question_type == QuestionType.TRUE_FALSE:
        correct_answer = question_data.true_false_answer
        if user_response.user_response == correct_answer:
            score = question_create.total_marks
            is_correct = True
            feedback = 'Correct! Your answer is right.'
        else:
            feedback = f'Incorrect. The correct answer is: {correct_answer}. You answered: {user_response.user_response}'

    elif question_data.question_type == QuestionType.USER_INPUT:
        correct_answer = question_data.correct_answer
        if not isinstance(user_response.user_response, str):
            raise Exception('User response should be a string for user input questions')
        if not isinstance(correct_answer, str):
            raise Exception(
                'Correct answer should be a string for user input questions'
            )
        if user_response.user_response.strip() == correct_answer.strip():
            score = question_create.total_marks
            is_correct = True
            feedback = 'Correct! Your answer is right.'
        else:
            feedback = f'Incorrect. The correct answer is: {correct_answer}., you answered: {user_response.user_response}'

    # Update the user_submission with the score and feedback
    user_submission.score = score
    print(feedback)
    user_submission.feedback = feedback
    user_submission.made_attempt = True
    user_submission.is_correct = is_correct

    return user_submission
