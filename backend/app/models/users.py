from sqlalchemy import (
    Column,
    Integer,
    String,
    TIMESTAMP,
    func,
)
from sqlalchemy.orm import relationship

from app.core.db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String, nullable=False, unique=True)
    email = Column(String, nullable=False, unique=True)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False)  # Enum of 'admin', 'teacher', 'student'
    joined_at = Column(TIMESTAMP, server_default=func.now())

    # Okey
    course = relationship("Course", back_populates="creator")

    # Okey
    enrollments = relationship("Enrollment", back_populates="student")

    # Okey
    question_attempts = relationship("QuestionAttempt", back_populates="user")

    # Okey
    quiz_attempts = relationship("QuizAttempt", back_populates="user")

    # Okey
    participations = relationship("QuizParticipant", back_populates="user")

    # Okey
    session = relationship("QuizSession", back_populates="creator")
