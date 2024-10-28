from enum import Enum
from typing import Any, List, Optional

from pydantic import BaseModel, model_validator


class QuestionType(str, Enum):
    SINGLE_CHOICE = 'single_choice'
    MULTIPLE_CHOICE = 'multiple_choice'
    USER_INPUT = 'user_input'
    TRUE_FALSE = 'true_false'


class Choice(BaseModel):
    text: str
    correct: bool = False


class QuestionTeacherData(BaseModel):
    question_type: QuestionType
    question_text: str
    choices: Optional[List[Choice]] = None
    true_false_answer: Optional[bool] = None
    correct_answer: Optional[str] = None

    @model_validator(mode='after')
    @classmethod
    def validate_data(cls, values: Any):
        question_type = values.question_type

        if question_type in {QuestionType.SINGLE_CHOICE, QuestionType.MULTIPLE_CHOICE}:
            choices = values.choices
            if choices is None or len(choices) < 4 or len(choices) > 6:
                raise ValueError('Choices must be provided and must have 4-6 options')
            if len({choice.text for choice in choices}) != len(choices):
                raise ValueError('Choices must be unique')
            correct_choices = [choice for choice in choices if choice.correct]
            if (
                question_type == QuestionType.SINGLE_CHOICE
                and len(correct_choices) != 1
            ):
                raise ValueError(
                    'Single choice question must have exactly one correct answer'
                )
            if (
                question_type == QuestionType.MULTIPLE_CHOICE
                and len(correct_choices) < 1
            ):
                raise ValueError(
                    'Multiple choice question must have at least one correct answer'
                )

        # Validate true/false answer
        if question_type == QuestionType.TRUE_FALSE:
            if values.true_false_answer is None:
                raise ValueError(
                    'True/False answer must be provided for True/False questions'
                )

        # Validate correct answer for user input
        if question_type == QuestionType.USER_INPUT:
            if not values.correct_answer or values.correct_answer.strip() == '':
                raise ValueError(
                    'Correct answer cannot be empty for user input questions'
                )

        return values


class QuestionTeacherView(BaseModel):
    question_type: QuestionType
    question_data: QuestionTeacherData
    tag: str
    total_marks: int

    @model_validator(mode='after')
    @classmethod
    def validate_question_create(cls, values: Any):
        question_type = values.question_type
        question_data = values.question_data
        question_data.question_type = question_type

        return values


class StudentChoice(BaseModel):
    text: str


class QuestionStudentData(BaseModel):
    question_type: QuestionType
    question_text: str
    # Only used for choice questions but answer excluded for students
    choices: Optional[List[StudentChoice]] = None


class QuestionStudentView(BaseModel):
    question_type: QuestionType
    question_data: QuestionStudentData
    tag: str
    total_marks: int


def convert_to_student_view(
    question_create: QuestionTeacherView,
) -> QuestionStudentView:
    return QuestionStudentView(**question_create.model_dump())
