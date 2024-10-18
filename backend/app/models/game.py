from sqlalchemy import (
    Column,
    Integer,
    String,
    TIMESTAMP,
    ForeignKey,
    Boolean,
)
from sqlalchemy.orm import relationship
from app.core.db import Base


class GameSession(Base):
    __tablename__ = "quiz_sessions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False)
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # auto-generate with random numbers
    # todo: what to take as thsi input pin?
    session_pin = Column(String, nullable=False, unique=True)

    # indiate if still activ to participate
    active = Column(Boolean, default=True)
    start_time = Column(TIMESTAMP, nullable=False)

    # point start at 200 and as time passes it's decrease[this is for each question]
    point = Column(Integer, default=200)

    # each question will have same duration for the attemps
    duration_seconds = Column(Integer, nullable=False)

    # Ok
    creator = relationship("User", back_populates="session")

    # Okey
    quiz = relationship("Quiz", back_populates="session")

    # Okey
    participants = relationship("QuizParticipant", back_populates="session")


class GameParticipant(Base):
    __tablename__ = "quiz_participants"

    id = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(Integer, ForeignKey("quiz_sessions.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    score = Column(Integer, default=0)

    # Okey
    user = relationship("User", back_populates="participations")

    # Okey
    session = relationship("QuizSession", back_populates="participants")
