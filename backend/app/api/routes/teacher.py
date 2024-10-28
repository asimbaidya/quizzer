from fastapi import APIRouter, HTTPException

from app.api.deps import (
    CurrentTeacher,
    SessionDep,
    check_course_owner,
    check_quiz_owner,
)
from app.crud import teacher_crud
from app.schemas.course import CourseCreate
from app.schemas.question import QuestionCreate
from app.schemas.quiz import QuizCreate

router = APIRouter()


# get
# /courses -> teacher_crud.get_courses_by_creator_id(db, creator_id: int)
# /course/{course_title}  -> teacher_crud.get_course_by_title(db, course_title: str), teacher_crud.get_quizzes_by_course_id(db, course_id: int)
# /course/{course_title}/{quiz_id} -> teacher_crud.get_quiz_by_id(db, quiz_id: int), teacher_crud.get_questions_by_quiz_id(db, quiz_id: int)

# /course/{course_title}/info [list of enrolled students]
# /course/{course_title}/{quiz_id}/info [student progress/mark]

# post
# /course [create course] -> teacher_crud.create_course(db, course: CourseCreate, teacher: CurrentTeacher)
# /course/quiz/{course_title}/ -> teaccher_crud.create_quiz(db, quiz: QuizCreate)
# /course/{course_title}/{quiz_id} -> teacher_crud.create_question(db, question: QuestionCreate)


# ---- GET ROUTES ----


# /courses -> Get list of courses created by the teacher
@router.get('/courses')
def get_courses(db: SessionDep, teacher: CurrentTeacher):
    return teacher_crud.get_courses_by_creator_id(db, creator_id=teacher.id)  # type: ignore


# /course/{course_title} -> Get all quizzes of a course
@router.get('/course/{course_title}')
def get_quizzes_in_course(course_title: str, db: SessionDep, teacher: CurrentTeacher):
    course = check_course_owner(db, course_title, teacher.id)  # type: ignore
    quizzes = teacher_crud.get_quizzes_by_course_id(db, course_id=course.id)  # type: ignore
    return {'course': course, 'quizzes': quizzes}


# /course/students/{course_title} -> List of enrolled students in a course
@router.get('/course/students/{course_title}')
def get_enrolled_students(course_title: str, db: SessionDep, teacher: CurrentTeacher):
    course = check_course_owner(db, course_title, teacher.id)  # type: ignore
    return teacher_crud.get_enrolled_students(db, course_id=course.id)  # type: ignore


# /course/{course_title}/{quiz_id} -> Get all questions in a quiz
@router.get('/course/{course_title}/{quiz_id}')
def get_questions_in_quiz(
    course_title: str, quiz_id: int, db: SessionDep, teacher: CurrentTeacher
):
    course = check_course_owner(db, course_title, teacher.id)  # type: ignore
    _quiz = check_quiz_owner(db, quiz_id, course)
    return teacher_crud.get_questions_by_quiz_id(db, quiz_id=quiz_id)


# /course/{course_title}/{quiz_id}/info -> Student progress or marks in a quiz
@router.get('/course/students/{course_title}/{quiz_id}')
def get_student_progress(
    course_title: str, quiz_id: int, db: SessionDep, teacher: CurrentTeacher
):
    course = check_course_owner(db, course_title, teacher.id)  # type: ignore
    _quiz = check_quiz_owner(db, quiz_id, course)
    return teacher_crud.get_student_progress(db, quiz_id=quiz_id)


# ---- POST ROUTES ----


# /course -> Create a new course
@router.post('/course')
def create_course(db: SessionDep, course: CourseCreate, teacher: CurrentTeacher):
    try:
        return teacher_crud.create_course(
            db,
            course_create=course,
            creator_id=teacher.id,  # type: ignore
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# /course/quiz/{course_title} -> Create a new quiz within a course
@router.post('/course/quiz/{course_title}')
def create_quiz(
    course_title: str, quiz: QuizCreate, db: SessionDep, teacher: CurrentTeacher
):
    course = check_course_owner(db, course_title, teacher.id)  # type: ignore
    return teacher_crud.create_quiz(db, quiz_create=quiz, course_id=course.id)  # type: ignore


# /course/{course_title}/{quiz_id} -> Create a new question in a quiz
@router.post('/course/{course_title}/{quiz_id}')
def create_question(
    course_title: str,
    quiz_id: int,
    question: QuestionCreate,
    db: SessionDep,
    teacher: CurrentTeacher,
):
    course = check_course_owner(db, course_title, teacher.id)  # type: ignore
    _quiz = check_quiz_owner(db, quiz_id, course)
    return teacher_crud.create_question(db, question_create=question, quiz_id=quiz_id)
