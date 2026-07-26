"""Pydantic shapes for the JSONB blobs stored on questions, submissions, notes.

These validate the free-form JSON at the API boundary while the database columns
keep them as flexible JSONB. Ported from the original schemas (debug prints and
integer ids removed).
"""

from typing import Any, Self

from pydantic import BaseModel, Field, ValidationInfo, field_validator, model_validator

from app.models.enums import QuestionType


class Choice(BaseModel):
    text: str
    correct: bool = False


class StudentChoice(BaseModel):
    text: str


# ---- Question content authored by a teacher (question_data JSONB) ----
class QuestionTeacherData(BaseModel):
    question_type: QuestionType
    question_text: str
    choices: list[Choice] | None = Field(min_length=4, max_length=6, default=None)
    true_false_answer: bool | None = None
    correct_answer: str | None = None

    @model_validator(mode="before")
    @classmethod
    def _validate_before(cls, value: Any) -> Any:
        question_type = value.get("question_type")
        true_false_answer = value.get("true_false_answer")
        correct_answer = value.get("correct_answer")
        choices = value.get("choices")
        if question_type in (QuestionType.SINGLE_CHOICE, QuestionType.MULTIPLE_CHOICE):
            if true_false_answer is not None:
                raise ValueError(
                    "True/False answer is not required for choice questions"
                )
            if correct_answer:
                raise ValueError("Correct answer is not required for choice questions")
        if question_type == QuestionType.TRUE_FALSE:
            if correct_answer:
                raise ValueError("Correct answer is not required for true/false")
            if true_false_answer is None:
                raise ValueError("True/False answer must be provided")
            if choices is not None:
                raise ValueError("Choices are not required for true/false questions")
        if question_type == QuestionType.USER_INPUT:
            if true_false_answer is not None:
                raise ValueError("True/False answer is not required for user input")
            if choices is not None:
                raise ValueError("Choices are not required for user input questions")
            if not correct_answer:
                raise ValueError("Correct answer must be provided for user input")
        return value

    @model_validator(mode="after")
    def _validate_after(self) -> Self:
        if self.question_type in (
            QuestionType.SINGLE_CHOICE,
            QuestionType.MULTIPLE_CHOICE,
        ):
            choices = self.choices
            if choices is None or not (4 <= len(choices) <= 6):
                raise ValueError("Choices must be provided and must have 4-6 options")
            if len({choice.text for choice in choices}) != len(choices):
                raise ValueError("Choices must be unique")
            correct_choices = [choice for choice in choices if choice.correct]
            if self.question_type == QuestionType.SINGLE_CHOICE and (
                len(correct_choices) != 1
            ):
                raise ValueError("Single choice must have exactly one correct answer")
            if self.question_type == QuestionType.MULTIPLE_CHOICE and (
                len(correct_choices) < 1
            ):
                raise ValueError(
                    "Multiple choice must have at least one correct answer"
                )
        if self.question_type == QuestionType.TRUE_FALSE and (
            self.true_false_answer is None
        ):
            raise ValueError("True/False answer must be provided")
        if self.question_type == QuestionType.USER_INPUT and (
            not self.correct_answer or not self.correct_answer.strip()
        ):
            raise ValueError("Correct answer cannot be empty for user input questions")
        return self


# ---- Question content as shown to a student (correct answers stripped) ----
class QuestionStudentData(BaseModel):
    question_type: QuestionType
    question_text: str
    choices: list[StudentChoice] | None = None


# ---- A student's answer (user_response JSONB) ----
class QuestionStudentResponse(BaseModel):
    question_type: QuestionType
    user_response: str | list[str] | bool

    @field_validator("user_response")
    @classmethod
    def _validate_response(
        cls, v: str | list[str] | bool, info: ValidationInfo
    ) -> str | list[str] | bool:
        question_type = info.data.get("question_type")
        if question_type == QuestionType.SINGLE_CHOICE and not isinstance(v, str):
            raise ValueError("Response must be a string for single choice")
        if question_type == QuestionType.MULTIPLE_CHOICE and not isinstance(v, list):
            raise ValueError("Response must be a list for multiple choice")
        if question_type == QuestionType.TRUE_FALSE and not isinstance(v, bool):
            raise ValueError("Response must be a boolean for true/false")
        if question_type == QuestionType.USER_INPUT and not isinstance(v, str):
            raise ValueError("Response must be a string for user input")
        return v


# ---- A single note block within a Note's note_data JSONB list ----
class NoteItem(BaseModel):
    title: str
    content: str
    flag: int
    image: str | None = None
