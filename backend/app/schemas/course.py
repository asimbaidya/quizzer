import random
import string

from pydantic import BaseModel


class CourseCreate(BaseModel):
    title: str
    description: str
    is_open: bool = True
    course_pin: str = ''.join(
        random.choices(string.ascii_uppercase + string.digits, k=8)
    )
