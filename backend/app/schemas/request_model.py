import random
import string
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class CourseCreate(BaseModel):
    title: str
    description: str = 'No Description Added'
    is_open: bool = True
    course_pin: Optional[str] = ''.join(
        random.choices(string.ascii_uppercase + string.digits, k=8)
    )


class QuizCreate(BaseModel):
    title: str = Field(default='New Quiz')
    total_mark: int = Field(default=20)

    allowed_attempt: Optional[int] = 1
    is_unlimited_attempt: Optional[bool] = False


class TestCreate(BaseModel):
    title: str = Field(default='New Test')
    total_mark: int = Field(default=20)

    duration: int = Field(default=30)
    window_start: datetime = Field(default_factory=lambda: datetime.now())
    window_end: datetime = Field(default_factory=lambda: datetime.now())


class EnrollMetadata(BaseModel):
    course_title: str
    course_pin: str
