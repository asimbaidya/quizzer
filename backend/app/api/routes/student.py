from fastapi import APIRouter
from app.api.ensure.math import ensure_math


router = APIRouter()

#  get
# /enrolled_courses [get list of enrolled courses]
# /enrolled_courses/{course_id} [get course details and list of quizzes]
# /enrolled_courses/{course_id}/{quiz_id} [get unlocked quiz Questions of a quiz]
# /enrolled_courses/{course_id}/{quiz_id}/{question_id}/answer [get answer]

# post
# /enrolled_courses/{course_id}/ [enroll with course_pin]
# /enrolled_courses/submit/{course_id}/{quiz_id}/{question_id} [submit answer and validate]
# /enrolled_courses/save/{course_id}/{quiz_id}/{question_id} [save answer in attempt]


@router.get("/")
def home():
    ensure_math(1, 1)
    return {"message": "Hello, World From Admin!"}
