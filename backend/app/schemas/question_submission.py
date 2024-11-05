from datetime import datetime
from typing import List, Optional, Self, Union

from pydantic import (
    BaseModel,
    ValidationInfo,
    field_validator,
    model_validator,
)

from app.schemas.enums import SubmissionStatus, TestStatus
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

    # @model_validator(mode='before')
    # @classmethod
    # def validate_data_before(cls, value: any) -> self:
    #     print(value)
    #     return value

    @model_validator(mode='after')
    def validate_data_after(self) -> Self:
        outer_type = self.question_type
        inner_type = self.user_response.question_type
        if outer_type != inner_type:
            raise ValueError(
                f'Outer question type {outer_type} does not match inner question type {inner_type}'  # noqa: E501
            )
        return self


# --------------------------
class StudentChoice(BaseModel):
    text: str


class QuestionStudentData(BaseModel):
    question_type: QuestionType
    question_text: str
    choices: Optional[List[StudentChoice]] = None


class QuestionStudentView(BaseModel):
    question_type: QuestionType
    question_data: QuestionStudentData
    tag: str
    total_marks: int

    url: Optional[str] = ''

    image_url: Optional[str] = None
    image: Optional[str] = None

    made_attempt: Optional[bool] = False
    is_correct: bool = False
    score: int = 0
    feedback: str = ''


class QuestionSubmissionStudentView(BaseModel):
    question_type: QuestionType
    user_response: Optional[QuestionStudentResponse] = None
    made_attempt: bool = False
    is_correct: Optional[bool] = False
    score: Optional[int] = 0
    feedback: Optional[str] = ''

    attempt_time: Optional[datetime]
    attempt_count: Optional[int]
    status: SubmissionStatus


class QuestionSubmission(BaseModel):
    question: QuestionStudentView
    submission: QuestionSubmissionStudentView


class QuizQuestionWithSubmission(BaseModel):
    question_submissions: List[QuestionSubmission]
    total_mark: int
    allowed_attempt: int
    is_unlimited_attempt: bool


class TestQuestionWithSubmission(BaseModel):
    question_submissions: List[QuestionSubmission]
    total_mark: int
    start_time: Optional[datetime]
    status: TestStatus
