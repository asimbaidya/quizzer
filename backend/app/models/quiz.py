from datetime import datetime
from typing import Optional

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy import (
    Enum as EnumType,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.core.db import Base
from app.schemas.enums import QuestionType, SubmissionStatus
from app.schemas.question import QuestionTeacherData
from app.schemas.question_submission import QuestionStudentResponse


class Course(Base):
    __tablename__ = 'courses'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    creator_id: Mapped[int] = mapped_column(
        Integer, ForeignKey('users.id'), nullable=False
    )
    title: Mapped[Optional[str]] = mapped_column(
        String, nullable=False, unique=True, index=True
    )
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    course_pin: Mapped[str] = mapped_column(String, nullable=False)
    is_open: Mapped[bool] = mapped_column(Boolean, default=True)

    creator = relationship('User', back_populates='course')
    quizzes = relationship('Quiz', back_populates='course')
    tests = relationship('Test', back_populates='course')
    enrollments = relationship('Enrollment', back_populates='course')


class Enrollment(Base):
    __tablename__ = 'enrollments'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    student_id: Mapped[int] = mapped_column(
        Integer, ForeignKey('users.id'), nullable=False
    )
    course_id: Mapped[int] = mapped_column(
        Integer, ForeignKey('courses.id'), nullable=False
    )
    enrolled_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    student = relationship('User', back_populates='enrollments')
    course = relationship('Course', back_populates='enrollments')


class Quiz(Base):
    __tablename__ = 'quizzes'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    course_id: Mapped[int] = mapped_column(
        Integer, ForeignKey('courses.id'), nullable=False
    )
    title: Mapped[str] = mapped_column(String, nullable=False, default='Untitled')
    question_set_id: Mapped[int] = mapped_column(
        Integer, ForeignKey('question_sets.id'), nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), onupdate=func.now()
    )
    total_mark: Mapped[int] = mapped_column(
        Integer, nullable=False
    )  # Total marks for the quiz
    is_unlimited_attempt: Mapped[bool] = mapped_column(Boolean, default=False)
    allowed_attempt: Mapped[int] = mapped_column(Integer, default=1)

    course = relationship('Course', back_populates='quizzes')


class Test(Base):
    __tablename__ = 'tests'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    course_id: Mapped[int] = mapped_column(
        Integer, ForeignKey('courses.id'), nullable=False
    )
    question_set_id: Mapped[int] = mapped_column(
        Integer, ForeignKey('question_sets.id'), nullable=False
    )
    title: Mapped[str] = mapped_column(String, nullable=False, default='Untitled')
    duration: Mapped[int] = mapped_column(Integer, nullable=False)
    total_mark: Mapped[int] = mapped_column(Integer, nullable=False)
    window_start: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    window_end: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    course = relationship('Course', back_populates='tests')
    user_test_sessions = relationship('UserTestSession', back_populates='test')


class QuestionSet(Base):
    __tablename__ = 'question_sets'
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)

    questions = relationship(
        'Question', back_populates='question_set', cascade='all, delete-orphan'
    )


class Question(Base):
    __tablename__ = 'questions'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    question_set_id: Mapped[int] = mapped_column(
        Integer, ForeignKey('question_sets.id'), nullable=False
    )
    question_type: Mapped[QuestionType] = mapped_column(
        EnumType(QuestionType), nullable=False
    )
    question_data: Mapped[QuestionTeacherData] = mapped_column(JSONB, nullable=False)
    total_marks: Mapped[int] = mapped_column(Integer, nullable=False, default=5)
    tag: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    image: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    submission = relationship(
        'QuestionSubmission', back_populates='question', cascade='all, delete-orphan'
    )
    question_set = relationship('QuestionSet', back_populates='questions')

    def to_dict(self) -> dict[str, str | bool | int]:
        return {
            'id': self.id,
            'question_type': self.question_type,
            'question_data': self.question_data,
            'total_marks': self.total_marks,
            'tag': self.tag,
            'image': self.image,
        }  # type: ignore


class QuestionSubmission(Base):
    __tablename__ = 'question_submission'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    question_id: Mapped[int] = mapped_column(
        Integer, ForeignKey('questions.id'), nullable=False
    )
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey('users.id'), nullable=False
    )
    made_attempt: Mapped[bool] = mapped_column(Boolean, nullable=False)
    question_type: Mapped[QuestionType] = mapped_column(
        EnumType(QuestionType), nullable=False
    )
    user_response: Mapped[Optional[QuestionStudentResponse]] = mapped_column(
        JSONB, nullable=True
    )
    is_correct: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)
    score: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    feedback: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    attempt_time: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    attempt_count: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[SubmissionStatus] = mapped_column(
        EnumType(SubmissionStatus), default=SubmissionStatus.VIEWED
    )

    user = relationship('User', back_populates='question_submssions')
    question = relationship('Question', back_populates='submission')


class UserTestSession(Base):
    __tablename__ = 'user_test_sessions'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    test_id: Mapped[int] = mapped_column(
        Integer, ForeignKey('tests.id'), nullable=False
    )
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey('users.id'), nullable=False
    )
    start_time: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    test = relationship('Test', back_populates='user_test_sessions')
    user = relationship('User', back_populates='user_test_sessions')
