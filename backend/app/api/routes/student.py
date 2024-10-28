from fastapi import APIRouter, HTTPException

from app.api.deps import (
    CurrentStudent,
    SessionDep,
    get_course_and_enrollment,
    get_quiz_and_enrollment,
)
from app.crud import student_crud
from app.models.quiz import Course

router = APIRouter()

# Method : get
# /enrolled_courses -> student_crud.get_enrolled_courses(student_id)
# /enrolled_courses/{course_title} -> student_crud.get_enrolled_course(course_title, student_id)
# /enrolled_courses/{course_title}/{quiz_id} -> student_crud.get_enrolled_quiz(course_title, quiz_id, student_id)

# Method: post
# /enrolled_courses/{course_title}/ -> student_crud.enroll_course(course_title, student_id)
# /enrolled_courses/submit/{course_title}/{quiz_id}/{question_id} -> student_crud.submit_answer(course_title, quiz_id, question_id, student_id)


@router.get('/enrolled_courses')
def get_enrolled_courses_endpoint(student: CurrentStudent, db: SessionDep):
    return student_crud.get_enrolled_courses(db, student.id)  # type: ignore


@router.get('/enrolled_courses/{course_title}')
def get_enrolled_course_endpoint(
    course_title: str, student: CurrentStudent, db: SessionDep
):
    course, _ = get_course_and_enrollment(course_title, student.id, db)  # type: ignore
    return course  # Return course


@router.get('/enrolled_courses/{course_title}/{quiz_id}')
def get_enrolled_quiz_endpoint(
    course_title: str, quiz_id: int, student: CurrentStudent, db: SessionDep
):
    course, _ = get_course_and_enrollment(course_title, student.id, db)  # type: ignore
    return get_quiz_and_enrollment(course, quiz_id, db)


@router.post('/enrolled_courses/{course_title}')
def enroll_course_endpoint(course_title: str, student: CurrentStudent, db: SessionDep):
    course = db.query(Course).filter(Course.title == course_title).first()
    if not course:
        raise HTTPException(status_code=404, detail='Course not found')

    return student_crud.enroll_course(db, course.id, student.id)  # type: ignore


@router.post('/enrolled_courses/submit/{course_title}/{quiz_id}/{question_id}')
def submit_answer_endpoint(
    course_title: str,
    quiz_id: int,
    question_id: int,
    student: CurrentStudent,
    answer_data: dict,
    db: SessionDep,
):
    course, _ = get_course_and_enrollment(course_title, student.id, db)  # type: ignore
    quiz = get_quiz_and_enrollment(course, quiz_id, db)
    return student_crud.submit_answer(
        db, course.id, quiz.id, question_id, student.id, answer_data
    )  # type: ignore
