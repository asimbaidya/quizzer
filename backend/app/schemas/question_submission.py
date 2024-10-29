# sub
from typing import Any, List, Self, Union

from pydantic import BaseModel, ValidationInfo, field_validator, model_validator

from app.schemas.question import QuestionType


class QuestionStudentResponse(BaseModel):
    question_type: QuestionType
    user_response: Union[str, List[str], bool]

    @field_validator('user_response')
    @classmethod
    def validate_user_response(cls, v: Union[List[str], bool], info: ValidationInfo):
        question_type = info.data.get('question_type')
        if question_type == QuestionType.SINGLE_CHOICE:
            if not isinstance(v, str):
                raise ValueError(
                    'User response must be a string for single choice questions.'
                )

        elif question_type == QuestionType.MULTIPLE_CHOICE:
            if not isinstance(v, list):
                raise ValueError(
                    'User response must be a list of strings for multiple choice questions.'  # noqa: E501
                )

        elif question_type == QuestionType.TRUE_FALSE:
            if not isinstance(v, bool):
                raise ValueError(
                    'User response must be a boolean for true/false questions.'
                )

        elif question_type == QuestionType.USER_INPUT:
            if not isinstance(v, str):
                raise ValueError(
                    'User response must be a string for user input questions.'
                )
        return v


class QuestionStudentSubmission(BaseModel):
    # id: int
    question_type: QuestionType
    # user_id: int
    # question_id: int
    user_response: QuestionStudentResponse
    made_attempt: bool = False
    is_correct: bool = False
    score: int = 0
    feedback: str = ''

    @model_validator(mode='before')
    @classmethod
    def validate_data_before(cls, value: Any) -> Self:
        return value
