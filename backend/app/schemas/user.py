from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserRole(str, Enum):
    ADMIN = 'admin'
    TEACHER = 'teacher'
    STUDENT = 'student'


class User(BaseModel):
    first_name: str = Field(default='John')
    last_name: str = Field(default='Doe')
    email: EmailStr = Field(default='john_doe@gmail.com')
    role: UserRole = UserRole.STUDENT
    joined_at: datetime = Field(default_factory=datetime.now)


class UserCreate(User):
    password: str = Field('password', min_length=8, max_length=32)


class UserInDB(User):
    id: int
    hashed_password: str

    model_config = ConfigDict(from_attributes=True)


class UserPublic(User):
    id: int
