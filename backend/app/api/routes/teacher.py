from fastapi import APIRouter, HTTPException

from app.api.deps import CurrentTeacher, SessionDep
from app.crud import teacher_crud
from app.schemas.common import CourseCreate, QuizCreate
from app.schemas.question import QuestionTeacherView

router = APIRouter()


# ---- GET ROUTES ----


# /courses => Get list of courses created by the teacher
@router.get('/courses')
def get_courses(db: SessionDep, teacher: CurrentTeacher):
    if not isinstance(teacher.id, int):
        return HTTPException(status_code=400, detail='Invalid teacher id')
    return teacher_crud.get_courses_by_creator_id(db, creator_id=teacher.id)


# /course/{course_title} -> Get all quizzes of a course
@router.get('/course/{course_title}')
def get_quizzes_in_course(course_title: str, db: SessionDep, teacher: CurrentTeacher):
    return teacher_crud.get_quiz_by_course_title_creator_id(
        db,
        course_title,
        teacher.id,
    )


# /course/students/{course_title} -> List of enrolled students in a course
@router.get('/course/students/{course_title}')
def get_enrolled_students(course_title: str, db: SessionDep, teacher: CurrentTeacher):
    return teacher_crud.get_enrolled_students(db, course_title, teacher.id)


# /course/{course_title}/{quiz_id} -> Get all questions in a quiz
@router.get('/course/{course_title}/{quiz_id}')
def get_questions_in_quiz(
    course_title: str, quiz_id: int, db: SessionDep, teacher: CurrentTeacher
):
    return teacher_crud.get_questions_by_course_title_quiz_id_teacher_id(
        db, course_title, quiz_id, teacher.id
    )


# /course/{course_title}/{quiz_id}/info -> Student progress or marks in a quiz
@router.get('/course/students/{course_title}/{quiz_id}')
def get_student_progress(
    course_title: str, quiz_id: int, db: SessionDep, teacher: CurrentTeacher
):
    return teacher_crud.get_student_progress_course_title_quiz_id_teacher_id(
        db, course_title, quiz_id, teacher.id
    )


# ---- POST ROUTES ----


# /course -> Create a new course
@router.post('/course')
def create_course(db: SessionDep, course: CourseCreate, teacher: CurrentTeacher):
    try:
        return teacher_crud.create_course_by_teacher_id(db, course, teacher.id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# /course/quiz/{course_title} -> Create a new quiz within a course
@router.post('/course/quiz/{course_title}')
def create_quiz(
    course_title: str, quiz: QuizCreate, db: SessionDep, teacher: CurrentTeacher
):
    try:
        return teacher_crud.create_quiz_by_course_title_teacher_id(
            db, quiz, course_title, teacher.id
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# /course/{course_title}/{quiz_id} -> Create a new question in a quiz
@router.post('/course/{course_title}/{quiz_id}', response_model=QuestionTeacherView)
def create_question(
    course_title: str,
    quiz_id: int,
    question: QuestionTeacherView,
    db: SessionDep,
    teacher: CurrentTeacher,
):
    try:
        return teacher_crud.create_question_by_course_title_quiz_id_teacher_id(
            db, question, course_title, quiz_id, teacher.id
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
