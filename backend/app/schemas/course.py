import random
import string
from typing import Optional

from pydantic import BaseModel


class CourseCreate(BaseModel):
    title: str
    description: str = 'No Description Added'
    is_open: bool = True
    course_pin: Optional[str] = ''.join(
        random.choices(string.ascii_uppercase + string.digits, k=8)
    )
