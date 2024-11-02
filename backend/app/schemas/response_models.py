from datetime import datetime

from pydantic import BaseModel, ConfigDict, computed_field


class CourseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    creator_id: int
    title: str
    created_at: datetime
    is_open: bool
    id: int
    description: str
    course_pin: str

    @computed_field
    @property
    def url(self) -> str:
        return f"/{self.title.replace(' ', '_')}"


class TestResponse(BaseModel):
    question_set_id: int
    id: int
    total_mark: int
    window_start: datetime
    window_end: datetime
    title: str
    course_id: int
    duration: int


class QuizResponse(BaseModel):
    title: str
    course_id: int
    created_at: datetime
    updated_at: datetime
    id: int
    question_set_id: int
    total_mark: int

    is_unlimited_attempt: bool
    allowed_attempt: int
