from uuid import UUID, uuid4

from pydantic import BaseModel


class CourseCreate(BaseModel):
    title: str
    description: str
    is_open: bool
    course_pin: UUID = uuid4()
