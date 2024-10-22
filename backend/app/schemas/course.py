from pydantic import BaseModel
from uuid import uuid4, UUID


class CourseCreate(BaseModel):
    title: str
    description: str
    is_open: bool
    course_pin: UUID = uuid4()
