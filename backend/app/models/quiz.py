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

    # [TODO]
    is_open = Column(Boolean, default=True)  # Okey

    # auto-generate with random numbers(only creator can see)
    course_pin = Column(String, nullable=False, unique=True)

    # Okey
    creator = relationship('User', back_populates='course')

    # Okey
    quizzes = relationship('Quiz', back_populates='course')

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
    description = Column(Text, nullable=True, default='No Description')

    # for instructor to see
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    # to show in progreass
    total_mark = Column(Integer, nullable=False)  # Total marks for the quiz

    # Okey
    question = relationship('Question', back_populates='quiz')

    course = relationship('Course', back_populates='quizzes')

    # [todo]
    # [1-m] QuizAttempt one quiz can have multiple attempts
    # attempts = relationship('QuizAttempt', back_populates='quiz')

    # session = relationship("GameSession", back_populates="quiz")


# class QuizAttempt(Base):
#     __tablename__ = 'quiz_attempts'

#     id = Column(Integer, primary_key=True, autoincrement=True)
#     user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
#     quiz_id = Column(Integer, ForeignKey('quizzes.id'), nullable=False)
#     received_mark = Column(Integer, nullable=True)  # Score for the quiz

#     attempt_time = Column(TIMESTAMP, server_default=func.now())  # Time of the attempt
#     duration = Column(Integer, nullable=True)  # Duration of the attempt

#     received_mark = Column(Integer, nullable=True)  # Marked score

#     # [student: 1-m] QuestionAttempt one student can attempt multiple questions
#     user = relationship('User', back_populates='quiz_attempts')

#     # Okey
#     quiz = relationship('Quiz', back_populates='attempts')

#     # Okey
#     # question_attempts = relationship("QuestionAttempt", back_populates="quiz_attempt")


class Question(Base):
    __tablename__ = 'questions'

    id = Column(Integer, primary_key=True, autoincrement=True)
    quiz_id = Column(Integer, ForeignKey('quizzes.id'), nullable=False)

    # Store question details as JSONB
    question_data = Column(JSONB, nullable=False)  # Store question details as JSONB

    tag = Column(String, nullable=True)  # Single string tag for the question
    # reference_image = Column(String, nullable=True)  # Image URL reference

    # individual question mark to very weight from other question
    total_marks = Column(Integer, nullable=False, default=5)
    # Total marks for the question

    # Okey
    quiz = relationship('Quiz', back_populates='question')

    # Okey
    attempts = relationship('QuestionAttempt', back_populates='question')


class QuestionAttempt(Base):
    __tablename__ = 'question_attempts'

    id = Column(Integer, primary_key=True, autoincrement=True)
    # quiz_attempt_id = Column(Integer, ForeignKey("quiz_attempts.id"), nullable=False)
    question_id = Column(Integer, ForeignKey('questions.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)

    response_data = Column(JSONB, nullable=False)  # Store user answer as JSON
    is_correct = Column(Boolean, nullable=False)
    received_mark = Column(Integer, nullable=True)  # Marked score

    # update only when new [todo]
    # state = Column(String, default=False)  # learnig, new, mastered

    # user this [todo]
    # next_attempt_time = Column(TIMESTAMP, server_default=func.now())

    # [todo]
    # attempt_time = Column(TIMESTAMP, server_default=func.now())  # Time of the attempt
    # attempt_count = Column(Integer, default=1)

    # Okey
    user = relationship('User', back_populates='question_attempts')

    # Okey
    question = relationship('Question', back_populates='attempts')

    # Okey
    # quiz_attempt = relationship("QuizAttempt", back_populates="question_attempts")
