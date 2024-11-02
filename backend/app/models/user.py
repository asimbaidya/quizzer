from datetime import datetime

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
from app.schemas.user import NoteDate


class Note(Base):
    __tablename__ = 'note'
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String, nullable=False, default='Untitled')
    note_data: Mapped[NoteDate] = mapped_column(JSONB, nullable=False)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey('users.id'), nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
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

    # [teacher: 1-m] Course one user can create multiple courses
    course = relationship(
        'Course', back_populates='creator', cascade='all, delete-orphan'
    )

    # [student: m-m] Enrollment one student can enroll in multiple courses
    enrollments = relationship('Enrollment', back_populates='student')

    # [student: 1-m] QuestionSubmission one student can attempt multiple questions
    question_submssions = relationship(
        'QuestionSubmission', back_populates='user', cascade='all, delete-orphan'
    )

    # [student: 1-m] Note one student can create multiple notes
    notes = relationship('Note', back_populates='creator', cascade='all, delete-orphan')

    # [student: 1-m] UserTestSession one student can attempt multiple tests
    user_test_sessions = relationship('UserTestSession', back_populates='user')
