from typing import List, Any
from pydantic import field_validator, BaseModel
from enum import Enum


class QuestionType(str, Enum):
    SINGLE_CHOICE = "single_choice"
    MULTIPLE_CHOICE = "multiple_choice"
    USER_INPUT = "user_input"


class Choice(BaseModel):
    text: str
    correct: bool = False


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
    def validate_single_choice(cls, choices: list[Choice]) -> List[Choice]:
        if len(choices) < 4 or len(choices) > 6:
            raise ValueError("Single choice question must have 4-6 choices")

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
        if len(choices) < 4 or len(choices) > 6:
            raise ValueError("Multiple choice question must have 4-6 choices")
        correct_choices = [choice for choice in choices if choice.correct]
        if len(correct_choices) < 1:
            raise ValueError(
                "Multiple value Question At least Have one correct choices"
            )
        return choices


class UserInput(QuestionBase):
    question_type: QuestionType = QuestionType.USER_INPUT
    correct_answer: int | str

    @field_validator("correct_answer")
    @classmethod
    def validate_correct_answer(cls, value: int | str):
        if not value or str(value).strip() == "":
            raise ValueError("Correct answer cannot be empty")
        return value


## -- buggy implementation
# class QuestionCreate(BaseModel):
#     quiz_id: int
#     question_data: dict[Any, Any]
#     tag: str
#     total_marks: int

#     @field_validator("question_data")
#     @classmethod
#     def validate_question_ddata(
#         cls, question_data: SingleChoiceQuestion | MultipleChoiceQuestion | UserInput
#     ):
#         if question_data.question_type == QuestionType.SINGLE_CHOICE:
#             return SingleChoiceQuestion(**question_data.model_dump())
#         if question_data.question_type == QuestionType.MULTIPLE_CHOICE:
#             return MultipleChoiceQuestion(**question_data.model_dump())
#         if question_data.question_type == QuestionType.USER_INPUT:
#             return UserInput(**question_data.model_dump())
#         raise ValueError("Invalid question type")


## -- this one initiliaze the question_data and validate correct way
class QuestionCreate(BaseModel):
    quiz_id: int
    question_data: dict[str, Any]  # Use str for keys in dict
    # question_data: SingleChoiceQuestion | MultipleChoiceQuestion | UserInput
    tag: str
    total_marks: int

    @field_validator("question_data")
    @classmethod
    def validate_question_data(cls, question_data: dict[str, Any]):
        question_type = question_data.get("question_type")
        if question_type == QuestionType.SINGLE_CHOICE:
            return SingleChoiceQuestion(**question_data)
        elif question_type == QuestionType.MULTIPLE_CHOICE:
            return MultipleChoiceQuestion(**question_data)
        elif question_type == QuestionType.USER_INPUT:
            return UserInput(**question_data)
        raise ValueError("Invalid question type")
