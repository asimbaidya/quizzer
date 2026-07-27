import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime
from sqlmodel import Field, Relationship, SQLModel

from app.models.common import get_datetime_utc

if TYPE_CHECKING:
    from app.models.course import Course
    from app.models.question import Question
    from app.models.user import User


class QuestionSet(SQLModel, table=True):
    __tablename__ = "questionset"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

    questions: list["Question"] = Relationship(
        back_populates="question_set", cascade_delete=True
    )


class Quiz(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    course_id: uuid.UUID = Field(
        foreign_key="course.id", nullable=False, ondelete="CASCADE"
    )
    question_set_id: uuid.UUID = Field(foreign_key="questionset.id", nullable=False)
    title: str = Field(default="Untitled", max_length=255)
    total_mark: int
    is_unlimited_attempt: bool = Field(default=False)
    allowed_attempt: int = Field(default=1)
    created_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore[call-overload]
    )
    updated_at: datetime | None = Field(
        default=None,
        sa_type=DateTime(timezone=True),  # type: ignore[call-overload]
    )

    course: "Course" = Relationship(back_populates="quizzes")


class Test(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    course_id: uuid.UUID = Field(
        foreign_key="course.id", nullable=False, ondelete="CASCADE"
    )
    question_set_id: uuid.UUID = Field(foreign_key="questionset.id", nullable=False)
    title: str = Field(default="Untitled", max_length=255)
    duration: int
    total_mark: int
    window_start: datetime = Field(sa_type=DateTime(timezone=True))  # type: ignore[call-overload]
    window_end: datetime = Field(sa_type=DateTime(timezone=True))  # type: ignore[call-overload]

    course: "Course" = Relationship(back_populates="tests")
    user_test_sessions: list["UserTestSession"] = Relationship(
        back_populates="test", cascade_delete=True
    )


class UserTestSession(SQLModel, table=True):
    __tablename__ = "usertestsession"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    test_id: uuid.UUID = Field(
        foreign_key="test.id", nullable=False, ondelete="CASCADE"
    )
    user_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    start_time: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore[call-overload]
    )
    # Set when the student submits (or auto-submits on timeout). Once set, the
    # test is locked: it can never be started or submitted again.
    submitted_at: datetime | None = Field(
        default=None,
        sa_type=DateTime(timezone=True),  # type: ignore[call-overload]
    )

    test: "Test" = Relationship(back_populates="user_test_sessions")
    user: "User" = Relationship(back_populates="user_test_sessions")


# ---- API payloads ----
class QuizCreate(SQLModel):
    title: str = "New Quiz"
    total_mark: int = 20
    allowed_attempt: int = 1
    is_unlimited_attempt: bool = False


class TestCreate(SQLModel):
    title: str = "New Test"
    total_mark: int = 20
    duration: int = 30
    window_start: datetime
    window_end: datetime
