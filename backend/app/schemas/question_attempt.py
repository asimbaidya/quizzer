from typing import Any, List

from pydantic import BaseModel, Field, field_validator

from app.schemas.question import QuestionBase, QuestionType


class ChoiceAttempt(BaseModel):
    text: str
    is_selected: bool = False


class SingleChoiceQuestionAttempt(QuestionBase):
    question_type: QuestionType = QuestionType.SINGLE_CHOICE
    selected_choices: List[ChoiceAttempt]


class MultipleChoiceQuestionAttempt(QuestionBase):
    question_type: QuestionType = QuestionType.MULTIPLE_CHOICE
    selected_choices: List[ChoiceAttempt]


class UserInputAttempt(QuestionBase):
    question_type: QuestionType = QuestionType.USER_INPUT
    correct_answer: int | str
    user_answer: int | str = ''


class QuestionAttemptCreate(BaseModel):
    question_id: int
    user_id: int

    tag: str
    total_marks: int

    is_correct: bool
    received_mark: int

    response_data: dict[str, Any] = Field(
        examples=[
            {
                'question_text': 'What is the chemical name of Water?',
                'question_type': QuestionType.SINGLE_CHOICE,
                'selected_choices': [
                    {
                        'text': 'H2O',
                        'is_selected': True,
                    },
                    {
                        'text': 'CO2',
                    },
                    {
                        'text': 'NaCl',
                    },
                    {
                        'text': 'H2SO4',
                    },
                ],
            },
        ]
    )

    @field_validator('response_data')
    @classmethod
    def validate_question_data(cls, question_data: dict[str, Any]):
        question_type = question_data.get('question_type')
        if question_type == QuestionType.SINGLE_CHOICE:
            return SingleChoiceQuestionAttempt(**question_data)
        if question_type == QuestionType.MULTIPLE_CHOICE:
            return MultipleChoiceQuestionAttempt(**question_data)
        if question_type == QuestionType.USER_INPUT:
            return UserInputAttempt(**question_data)
        raise ValueError('Invalid question type')
