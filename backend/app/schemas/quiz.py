from typing import Optional

from pydantic import BaseModel, Field


class QuizCreate(BaseModel):
    course_id: int
    title: str = Field(default='New Quiz')
    description: Optional[str] = None

    total_mark: int = Field(default=20)
