from sqlalchemy import (
    TIMESTAMP,
    Boolean,
    Column,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from app.core.db import Base


class Course(Base):
    __tablename__ = 'courses'

    id = Column(Integer, primary_key=True, autoincrement=True)
    creator_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    title = Column(String, nullable=False, unique=True, index=True)
    description = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    # auto-generate with random numbers(only creator can see)
    course_pin = Column(String, nullable=False)

    # [TODO]
    is_open = Column(Boolean, default=True)

    # Okey
    creator = relationship('User', back_populates='course')

    # Okey
    quizzes = relationship('Quiz', back_populates='course')

    tests = relationship('Test', back_populates='course')

    # Okey
    enrollments = relationship('Enrollment', back_populates='course')


class Enrollment(Base):
    __tablename__ = 'enrollments'

    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    course_id = Column(Integer, ForeignKey('courses.id'), nullable=False)
    enrolled_at = Column(TIMESTAMP, server_default=func.now())

    # Okey
    student = relationship('User', back_populates='enrollments')
    # okey
    course = relationship('Course', back_populates='enrollments')


class Quiz(Base):
    __tablename__ = 'quizzes'

    id = Column(Integer, primary_key=True, autoincrement=True)
    course_id = Column(Integer, ForeignKey('courses.id'), nullable=False)
    title = Column(String, nullable=False, default='Untitled')

    question_set_id = Column(Integer, ForeignKey('question_sets.id'), nullable=False)

    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    # to show in progreass
    total_mark = Column(Integer, nullable=False)  # Total marks for the quiz

    # relationship
    course = relationship('Course', back_populates='quizzes')


class Test(Base):
    __tablename__ = 'tests'

    id = Column(Integer, primary_key=True, autoincrement=True)
    course_id = Column(Integer, ForeignKey('courses.id'), nullable=False)
    question_set_id = Column(Integer, ForeignKey('question_sets.id'), nullable=False)
    title = Column(String, nullable=False, default='Untitled')

    # duration is in minutes
    duration = Column(Integer, nullable=False)

    # to show in progreass
    total_mark = Column(Integer, nullable=False)  # Total marks for the quiz

    #  allowed time
    time_window_start = Column(TIMESTAMP)
    time_window_end = Column(TIMESTAMP)

    # relationships
    course = relationship('Course', back_populates='tests')


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
    question_type = Column(String, nullable=False)
    question_data = Column(JSONB, nullable=False)  # Store question details as JSONB
    total_marks = Column(Integer, nullable=False, default=5)
    tag = Column(String, nullable=True)

    # reference_image = Column(String, nullable=True)  # Image URL reference

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

    question_type = Column(String, nullable=False)
    user_respons = Column(JSONB, nullable=False)
    is_correct = Column(Boolean, nullable=False)
    received_mark = Column(Integer, nullable=True)

    attempt_time = Column(TIMESTAMP, server_default=func.now())  # Time of the attempt

    # Okey
    user = relationship('User', back_populates='question_submssions')

    # Okey
    question = relationship('Question', back_populates='submission')
