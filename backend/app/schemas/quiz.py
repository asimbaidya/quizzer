from pydantic import BaseModel, Field


class QuizCreate(BaseModel):
    title: str = Field(default='New Quiz')
    total_mark: int = Field(default=20)
