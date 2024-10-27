from pydantic import BaseModel, Field


class QuizCreate(BaseModel):
    course_id: int
    title: str = Field(default='New Quiz')
    total_mark: int = Field(default=20)
