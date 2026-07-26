import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Any

from sqlalchemy import Column, DateTime
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Field, Relationship, SQLModel

from app.models.common import get_datetime_utc
from app.models.enums import QuestionType, SubmissionStatus

if TYPE_CHECKING:
    from app.models.quiz import QuestionSet
    from app.models.user import User


class Question(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    question_set_id: uuid.UUID = Field(
        foreign_key="questionset.id", nullable=False, ondelete="CASCADE"
    )
    question_type: QuestionType
    # Teacher-authored content (validated by QuestionTeacherData at the boundary).
    question_data: dict[str, Any] = Field(sa_column=Column(JSONB, nullable=False))
    total_marks: int = Field(default=5)
    tag: str | None = Field(default=None)
    image: str | None = Field(default=None)

    question_set: "QuestionSet" = Relationship(back_populates="questions")
    submissions: list["QuestionSubmission"] = Relationship(
        back_populates="question", cascade_delete=True
    )


class QuestionSubmission(SQLModel, table=True):
    __tablename__ = "questionsubmission"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    question_id: uuid.UUID = Field(
        foreign_key="question.id", nullable=False, ondelete="CASCADE"
    )
    user_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    made_attempt: bool = Field(default=False)
    question_type: QuestionType
    # Student answer (validated by QuestionStudentResponse at the boundary).
    user_response: dict[str, Any] | None = Field(
        default=None, sa_column=Column(JSONB, nullable=True)
    )
    is_correct: bool | None = Field(default=None)
    score: int | None = Field(default=None)
    feedback: str | None = Field(default=None)
    attempt_count: int = Field(default=0)
    status: SubmissionStatus = Field(default=SubmissionStatus.VIEWED)
    attempt_time: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore[call-overload]
    )

    user: "User" = Relationship(back_populates="question_submissions")
    question: "Question" = Relationship(back_populates="submissions")
