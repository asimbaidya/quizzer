from enum import Enum
from pydantic import BaseModel, EmailStr
from typing import Literal


class UserRole(str, Enum):
    ADMIN = "admin"
    TEACHER = "teacher"
    STUDENT = "student"


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: Literal["admin", "teacher", "student"]

    class Config:
        orm_mode = True


class UserPublic(BaseModel):
    id: int
