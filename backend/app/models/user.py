from sqlalchemy import TIMESTAMP, Column, ForeignKey, Integer, String, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from app.core.db import Base


class Note(Base):
    __tablename__ = 'note'
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, nullable=False, default='Untitled')
    note_data = Column(JSONB, nullable=False)  # Store question details as JSONB
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)

    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    creator = relationship('User', back_populates='notes')


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    full_name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False)  # Enum of 'admin', 'teacher', 'student'
    joined_at = Column(TIMESTAMP, server_default=func.now())

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

    def to_dict(self) -> dict[str, str]:
        return {
            'id': str(self.id),
            'full_name': str(self.full_name),
            'email': str(self.email),
            'role': str(self.role),
            'joined_at': str(self.joined_at),
        }
