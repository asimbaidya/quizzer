"""Domain models package.

Every table model must be imported here so that ``SQLModel.metadata`` is fully
populated before Alembic autogeneration and app startup. Alembic's ``env.py``
imports ``SQLModel`` from this package for exactly that reason.
"""

from sqlmodel import SQLModel

from app.models.common import (
    Message,
    NewPassword,
    Token,
    TokenPayload,
    get_datetime_utc,
)
from app.models.course import (
    Course,
    CourseCreate,
    CoursePublic,
    Enrollment,
    EnrollMetadata,
)
from app.models.enums import QuestionType, SubmissionStatus, TestStatus
from app.models.note import (
    Note,
    NoteBase,
    NoteCreate,
    NotePublic,
    NoteUpdate,
)
from app.models.payloads import (
    Choice,
    NoteItem,
    QuestionStudentData,
    QuestionStudentResponse,
    QuestionTeacherData,
    StudentChoice,
)
from app.models.question import (
    Question,
    QuestionCreate,
    QuestionStudentView,
    QuestionSubmission,
    QuestionWithSubmission,
    StudentAnswer,
    SubmissionStudentView,
)
from app.models.quiz import (
    QuestionSet,
    Quiz,
    QuizCreate,
    Test,
    TestCreate,
    UserTestSession,
)
from app.models.user import (
    UpdatePassword,
    User,
    UserBase,
    UserCreate,
    UserPublic,
    UserRegister,
    UserRole,
    UsersPublic,
    UserUpdate,
    UserUpdateMe,
)

__all__ = [
    "SQLModel",
    "get_datetime_utc",
    # common
    "Message",
    "NewPassword",
    "Token",
    "TokenPayload",
    # enums
    "QuestionType",
    "SubmissionStatus",
    "TestStatus",
    # user
    "UpdatePassword",
    "User",
    "UserBase",
    "UserCreate",
    "UserPublic",
    "UserRegister",
    "UserRole",
    "UsersPublic",
    "UserUpdate",
    "UserUpdateMe",
    # course
    "Course",
    "CourseCreate",
    "CoursePublic",
    "EnrollMetadata",
    "Enrollment",
    # quiz / test
    "QuestionSet",
    "Quiz",
    "QuizCreate",
    "Test",
    "TestCreate",
    "UserTestSession",
    # question / submission
    "Question",
    "QuestionCreate",
    "QuestionStudentView",
    "QuestionSubmission",
    "QuestionWithSubmission",
    "StudentAnswer",
    "SubmissionStudentView",
    # note
    "Note",
    "NoteBase",
    "NoteCreate",
    "NotePublic",
    "NoteUpdate",
    # JSONB payloads
    "Choice",
    "NoteItem",
    "QuestionStudentData",
    "QuestionStudentResponse",
    "QuestionTeacherData",
    "StudentChoice",
]
