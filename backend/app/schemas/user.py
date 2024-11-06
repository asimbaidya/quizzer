from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.schemas.enums import UserRole


class User(BaseModel):
    full_name: str = Field(default='John Doe')
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


class Note(BaseModel):
    title: str
    content: str
    flag: int


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
