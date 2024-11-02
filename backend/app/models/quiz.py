from sqlalchemy import (
    Boolean,
    Column,
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
from sqlalchemy.orm import relationship  # , validates

from app.core.db import Base
from app.schemas.enums import QuestionType, SubmissionStatus


class Course(Base):
    __tablename__ = 'courses'

    id = Column(Integer, primary_key=True, autoincrement=True)
    creator_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    title = Column(String, nullable=False, unique=True, index=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    # auto-generate with random numbers(only creator can see)
    course_pin = Column(String, nullable=False)

    is_open = Column(Boolean, default=True)

    creator = relationship('User', back_populates='course')
    quizzes = relationship('Quiz', back_populates='course')
    tests = relationship('Test', back_populates='course')
    enrollments = relationship('Enrollment', back_populates='course')


class Enrollment(Base):
    __tablename__ = 'enrollments'

    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    course_id = Column(Integer, ForeignKey('courses.id'), nullable=False)
    enrolled_at = Column(DateTime(timezone=True), server_default=func.now())

    student = relationship('User', back_populates='enrollments')
    course = relationship('Course', back_populates='enrollments')


class Quiz(Base):
    __tablename__ = 'quizzes'

    id = Column(Integer, primary_key=True, autoincrement=True)
    course_id = Column(Integer, ForeignKey('courses.id'), nullable=False)
    title = Column(String, nullable=False, default='Untitled')

    question_set_id = Column(Integer, ForeignKey('question_sets.id'), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # to show in progreass
    total_mark = Column(Integer, nullable=False)  # Total marks for the quiz

    # use this to validate
    is_unlimited_attempt = Column(Boolean, default=False)
    allowed_attempt = Column(Integer, default=1)

    # relationship
    course = relationship('Course', back_populates='quizzes')


class Test(Base):
    __tablename__ = 'tests'

    id = Column(Integer, primary_key=True, autoincrement=True)
    course_id = Column(Integer, ForeignKey('courses.id'), nullable=False)
    question_set_id = Column(Integer, ForeignKey('question_sets.id'), nullable=False)
    title = Column(String, nullable=False, default='Untitled')

    duration = Column(Integer, nullable=False)
    total_mark = Column(Integer, nullable=False)  # Total marks for the quiz

    window_start = Column(DateTime(timezone=True), nullable=False)
    window_end = Column(DateTime(timezone=True), nullable=False)

    course = relationship(argument='Course', back_populates='tests')
    user_test_sessions = relationship('UserTestSession', back_populates='test')


class QuestionSet(Base):
    __tablename__ = 'question_sets'
    id = Column(Integer, primary_key=True, autoincrement=True)

    questions = relationship(
        argument='Question', back_populates='question_set', cascade='all, delete-orphan'
    )


class Question(Base):
    __tablename__ = 'questions'

    id = Column(Integer, primary_key=True, autoincrement=True)
    question_set_id = Column(Integer, ForeignKey('question_sets.id'), nullable=False)

    # store question details as jsonb
    question_type = Column(EnumType(QuestionType), nullable=False)
    question_data = Column(JSONB, nullable=False)  # Store question details as JSONB
    total_marks = Column(Integer, nullable=False, default=5)
    tag = Column(String, nullable=True)

    image = Column(String, nullable=True)  # Image URL reference

    submission = relationship(
        'QuestionSubmission', back_populates='question', cascade='all, delete-orphan'
    )
    question_set = relationship('QuestionSet', back_populates='questions')


class QuestionSubmission(Base):
    __tablename__ = 'question_submission'

    id = Column(Integer, primary_key=True, autoincrement=True)
    question_id = Column(Integer, ForeignKey('questions.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)

    made_attempt = Column(Boolean, nullable=False)

    question_type = Column(EnumType(QuestionType), nullable=False)
    user_response = Column(JSONB, nullable=True)
    is_correct = Column(Boolean, nullable=True)
    score = Column(Integer, nullable=True)
    feedback = Column(String, nullable=True)

    attempt_time = Column(DateTime(timezone=True), server_default=func.now())
    attempt_count = Column(Integer, default=0)
    status = Column(EnumType(SubmissionStatus), default=SubmissionStatus.VIEWED)

    user = relationship('User', back_populates='question_submssions')
    question = relationship('Question', back_populates='submission')


class UserTestSession(Base):
    __tablename__ = 'user_test_sessions'

    id = Column(Integer, primary_key=True, autoincrement=True)
    test_id = Column(Integer, ForeignKey('tests.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    start_time = Column(DateTime(timezone=True), server_default=func.now())

    test = relationship('Test', back_populates='user_test_sessions')
    user = relationship('User', back_populates='user_test_sessions')
