import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime
from sqlmodel import Field, Relationship, SQLModel

from app.models.common import get_datetime_utc

if TYPE_CHECKING:
    from app.models.quiz import Quiz, Test
    from app.models.user import User


class Course(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    creator_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    title: str = Field(unique=True, index=True, max_length=255)
    description: str | None = Field(default="No Description Added")
    course_pin: str = Field(max_length=32)
    is_open: bool = Field(default=True)
    created_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore[call-overload]
    )

    creator: "User" = Relationship(back_populates="courses")
    enrollments: list["Enrollment"] = Relationship(
        back_populates="course", cascade_delete=True
    )
    quizzes: list["Quiz"] = Relationship(back_populates="course", cascade_delete=True)
    tests: list["Test"] = Relationship(back_populates="course", cascade_delete=True)


class Enrollment(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    student_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    course_id: uuid.UUID = Field(
        foreign_key="course.id", nullable=False, ondelete="CASCADE"
    )
    enrolled_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore[call-overload]
    )

    student: "User" = Relationship(back_populates="enrollments")
    course: "Course" = Relationship(back_populates="enrollments")


# ---- API payloads ----
class CourseCreate(SQLModel):
    title: str
    description: str = "No Description Added"
    is_open: bool = True
    course_pin: str | None = None


class CoursePublic(SQLModel):
    id: uuid.UUID
    creator_id: uuid.UUID
    title: str
    description: str | None = None
    course_pin: str
    is_open: bool
    created_at: datetime | None = None


class EnrollMetadata(SQLModel):
    course_title: str
    course_pin: str
