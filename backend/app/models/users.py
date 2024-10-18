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

    # Okey [for Live Game | for Student Role]
    participations = relationship("GameParticipant", back_populates="user")

    # Okey [ for Live Game | for Creator Role]
    session = relationship("GameSession", back_populates="creator")

    def to_dict(self) -> dict[str, str]:
        return {
            "id": str(self.id),
            "username": str(self.username),
            "email": str(self.email),
            "role": str(self.role),
            "joined_at": str(self.joined_at),
        }
