import json
from datetime import datetime
from typing import Any, Optional, Self

from pydantic import BaseModel, ConfigDict, EmailStr, Field, model_validator

from app.schemas.enums import UserRole


class User(BaseModel):
    full_name: str = Field(default='John Doe')
    email: EmailStr = Field(default='john_doe@gmail.com')
    role: UserRole = UserRole.STUDENT


class UserCreate(User):
    password: str = Field('password', min_length=8, max_length=32)

    @model_validator(mode='before')
    @classmethod
    def validate_question_create_before(cls, value: Any) -> Self:
        print('-' * 50)
        print('>>> RAW Question Data')
        print(json.dumps(value, indent=4))
        print('-' * 50)
        return value


class UserInDB(User):
    id: int
    hashed_password: str

    model_config = ConfigDict(from_attributes=True)
    joined_at: datetime = Field(default_factory=datetime.now)


class UserPublic(User):
    id: int


class Note(BaseModel):
    title: str
    content: str
    flag: int
    image: Optional[str] = None


class NoteBase(BaseModel):
    title: str = Field(default='Untitled')
    note_data: list[Note] = []


class NoteCreate(NoteBase):
    pass


class NoteUpdate(NoteBase):
    pass


class NoteInDB(NoteBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
