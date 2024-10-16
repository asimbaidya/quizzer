from typing import List, Optional
from pydantic import field_validator, BaseModel
from enum import Enum


class QuestionType(str, Enum):
    SINGLE_CHOICE = "single_choice"
    MULTIPLE_CHOICE = "multiple_choice"
    USER_INPUT = "user_input"


class Choice(BaseModel):
    text: str
    correct: bool = False
    selected_by_user: bool = False


class QuestionBase(BaseModel):
    question_text: str

    @field_validator("question_text")
    @classmethod
    def validate_question_text(cls, v: str):
        if not v or v.strip() == "":
            raise ValueError("Question text cannot be empty")
        return v


class SingleChoiceQuestion(QuestionBase):
    question_type: QuestionType = QuestionType.SINGLE_CHOICE
    choices: List[Choice]

    @field_validator("choices")
    @classmethod
    def validate_single_choice(cls, choices: list[Choice]):
        correct_choices = [choice for choice in choices if choice.correct]
        if len(correct_choices) != 1:
            raise ValueError(
                "Single choice question must have exactly one correct answer."
            )
        return choices


class MultipleChoiceQuestion(QuestionBase):
    question_type: QuestionType = QuestionType.MULTIPLE_CHOICE
    choices: List[Choice]

    @field_validator("choices")
    @classmethod
    def validate_multiple_choice(cls, choices: list[Choice]):
        correct_choices = [choice for choice in choices if choice.correct]
        if len(correct_choices) < 1:
            raise ValueError(
                "Multiple value Question At least Have one correct choices"
            )
        return choices


class UserInput(QuestionBase):
    question_type: QuestionType = QuestionType.USER_INPUT
    correct_answer: int | str
    response_answer: int | str | None = None

    @field_validator("correct_answer")
    @classmethod
    def validate_correct_answer(cls, value: int | str):
        if not value or str(value).strip() == "":
            raise ValueError("Correct answer cannot be empty")
        return value


class CourseCreate(BaseModel):
    title: str
    description: Optional[str] = None


class QuizCreate(BaseModel):
    course_id: int
    title: str
    description: Optional[str] = None
    tags: List[str] = []


class QuestionCreate(BaseModel):
    quiz_id: int
    data: dict[str, str]
    tag: Optional[str] = None
    reference_image: Optional[str] = None
