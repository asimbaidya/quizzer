from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, ForeignKey, Integer, String, func
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
from app.schemas.enums import UserRole
from app.schemas.user import Note


class Note(Base):
    __tablename__ = 'note'
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String, nullable=False, default='Untitled')
    note_data: Mapped[Note] = mapped_column(JSONB, nullable=False)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey('users.id'), nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), onupdate=func.now()
    )

    creator = relationship('User', back_populates='notes')


class User(Base):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    full_name: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)
    role: Mapped[UserRole] = mapped_column(EnumType(UserRole), nullable=False)
    joined_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    course = relationship(
        'Course', back_populates='creator', cascade='all, delete-orphan'
    )

    enrollments = relationship('Enrollment', back_populates='student')

    question_submssions = relationship(
        'QuestionSubmission', back_populates='user', cascade='all, delete-orphan'
    )

    notes = relationship('Note', back_populates='creator', cascade='all, delete-orphan')

    user_test_sessions = relationship('UserTestSession', back_populates='user')
