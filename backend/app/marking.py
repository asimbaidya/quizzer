"""Auto-marking for question submissions.

Operates on the JSONB shapes: a question's ``question_data`` (validated as
``QuestionTeacherData``) and a student's ``QuestionStudentResponse``. Ported from
the original ``mark.py`` with debug prints removed and answers compared safely.
"""

from dataclasses import dataclass

from app.models.enums import QuestionType
from app.models.payloads import QuestionStudentResponse, QuestionTeacherData


@dataclass
class MarkResult:
    score: int
    is_correct: bool
    feedback: str


def mark_submission(
    *,
    question_data: QuestionTeacherData,
    total_marks: int,
    response: QuestionStudentResponse,
) -> MarkResult:
    qtype = question_data.question_type
    answer = response.user_response

    if qtype == QuestionType.SINGLE_CHOICE:
        if question_data.choices is None:
            raise ValueError("Choices are required for single choice questions")
        correct = next((c.text for c in question_data.choices if c.correct), None)
        if answer == correct:
            return MarkResult(total_marks, True, f"Correct! The answer is {correct}.")
        return MarkResult(0, False, f"Incorrect. The correct answer is: {correct}.")

    if qtype == QuestionType.MULTIPLE_CHOICE:
        if question_data.choices is None:
            raise ValueError("Choices are required for multiple choice questions")
        if not isinstance(answer, list):
            raise ValueError("Response must be a list for multiple choice questions")
        correct_set = {c.text for c in question_data.choices if c.correct}
        answer_set = set(answer)
        if answer_set == correct_set:
            return MarkResult(total_marks, True, "Correct! All your answers are right.")
        if answer_set & correct_set:
            return MarkResult(
                0, False, f"Partially correct. The correct answers are: {correct_set}."
            )
        return MarkResult(
            0, False, f"Incorrect. The correct answers are: {correct_set}."
        )

    if qtype == QuestionType.TRUE_FALSE:
        correct = question_data.true_false_answer
        if answer == correct:
            return MarkResult(total_marks, True, f"Correct! The answer is {correct}.")
        return MarkResult(0, False, f"Incorrect. The correct answer is: {correct}.")

    if qtype == QuestionType.USER_INPUT:
        correct = question_data.correct_answer
        if not isinstance(answer, str) or not isinstance(correct, str):
            raise ValueError("User input questions require string answers")
        if answer.strip() == correct.strip():
            return MarkResult(total_marks, True, "Correct! Your answer is right.")
        return MarkResult(0, False, f"Incorrect. The correct answer is: {correct}.")

    raise ValueError(f"Unsupported question type: {qtype}")
