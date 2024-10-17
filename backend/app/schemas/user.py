from enum import Enum
from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Literal


class UserRole(str, Enum):
    ADMIN = "admin"
    TEACHER = "teacher"
    STUDENT = "student"


class UserCreate(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    username: str
    email: EmailStr
    password: str
    role: Literal["admin", "teacher", "student"]


class UserPublic(BaseModel):
    id: int
