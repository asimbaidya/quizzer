from fastapi import APIRouter, HTTPException

from app.api.deps import CurrentTeacher, SessionDep
from app.crud import teacher_crud
from app.schemas.common import CourseCreate, QuizCreate, TestCreate
from app.schemas.question import QuestionTeacherView
from app.schemas.response_models import CourseResponse

router = APIRouter()


# ---- GET ROUTES ----


# /courses => Get list of courses created by the teacher
@router.get(
    '/courses',
)
def get_courses(db: SessionDep, teacher: CurrentTeacher):
    if not isinstance(teacher.id, int):
        return HTTPException(status_code=400, detail='Invalid teacher id')

    courses = teacher_crud.get_courses_by_creator_id(db, creator_id=teacher.id)
    return [CourseResponse.model_validate(course) for course in courses]


# /course/{course_title} -> Get all quizzes of a course
# todo: also return tests into the response
@router.get(
    '/course/{course_title}',
)
def get_quizzes_and_tests__in_course(  # type: ignore
    course_title: str, db: SessionDep, teacher: CurrentTeacher
):
    return teacher_crud.get_quiz_and_test_by_course_title_creator_id(
        db,
        course_title,
        teacher.id,  # type: ignore
    )  # type: ignore


# /course/students/{course_title} -> List of enrolled students in a course
@router.get(
    '/course/students/{course_title}',
)
def get_enrolled_students(course_title: str, db: SessionDep, teacher: CurrentTeacher):
    return teacher_crud.get_enrolled_students(db, course_title, teacher.id)  # type: ignore


# /course/{course_title}/{quiz_id} -> Get all questions in a quiz
@router.get(
    '/course/quiz/{course_title}/{quiz_id}',
)
def get_questions_in_quiz(
    course_title: str, quiz_id: int, db: SessionDep, teacher: CurrentTeacher
):
    return teacher_crud.get_questions_by_course_title_quiz_id_teacher_id(
        db,
        course_title,
        quiz_id,
        teacher.id,  # type: ignore
    )


# /course/{course_title}/{test_id} -> Get all questions in a test
@router.get(
    '/course/test/{course_title}/{test_id}',
)
def get_questions_in_test(
    course_title: str, test_id: int, db: SessionDep, teacher: CurrentTeacher
):
    return teacher_crud.get_questions_by_course_title_test_id_teacher_id(
        db,
        course_title,
        test_id,
        teacher.id,  # type: ignore
    )


# /course/{course_title}/{quiz_id}/info -> Student progress or marks in a quiz
@router.get(
    '/course/students/{course_title}/{quiz_id}',
)
def get_student_progress(
    course_title: str, quiz_id: int, db: SessionDep, teacher: CurrentTeacher
):
    return teacher_crud.get_student_progress_course_title_quiz_id_teacher_id(
        db,
        course_title,
        quiz_id,
        teacher.id,  # type: ignore
    )


# ---- POST ROUTES ----


# /course -> Create a new course
@router.post(
    '/course',
)
def create_course(db: SessionDep, course: CourseCreate, teacher: CurrentTeacher):
    try:
        return teacher_crud.create_course_by_teacher_id(db, course, teacher.id)  # type: ignore
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# /course/quiz/{course_title} -> Create a new quiz within a course
@router.post(
    '/course/quiz/{course_title}',
)
def create_quiz(
    course_title: str, quiz: QuizCreate, db: SessionDep, teacher: CurrentTeacher
):
    try:
        return teacher_crud.create_quiz_by_course_title_teacher_id(
            db,
            quiz,
            course_title,
            teacher.id,  # type: ignore
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# /course/test/{course_title} -> Create a new test within a course
@router.post(
    '/course/test/{course_title}',
)
def create_test(
    course_title: str, test: TestCreate, db: SessionDep, teacher: CurrentTeacher
):
    try:
        return teacher_crud.create_test_by_course_title_teacher_id(
            db,
            test,
            course_title,
            teacher.id,  # type: ignore
        )
    except Exception as e:
        print(e)
        print(str(e))
        raise HTTPException(status_code=400, detail=str(e))


# /course/{course_title}/{quiz_id} -> Create a new question in a quiz
@router.post(
    '/course/quiz/{course_title}/{quiz_id}',
    response_model=QuestionTeacherView,
)
def create_question_in_quiz(
    course_title: str,
    quiz_id: int,
    question: QuestionTeacherView,
    db: SessionDep,
    teacher: CurrentTeacher,
):
    try:
        return teacher_crud.create_question_by_course_title_quiz_id_teacher_id(
            db,
            question,
            course_title,
            quiz_id,
            teacher.id,  # type: ignore
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# /course/{course_title}/{quiz_id} -> Create a new question in a test
@router.post(
    '/course/test/{course_title}/{test_id}',
    response_model=QuestionTeacherView,
)
def create_question_in_test(
    course_title: str,
    test_id: int,
    question: QuestionTeacherView,
    db: SessionDep,
    teacher: CurrentTeacher,
):
    try:
        return teacher_crud.create_question_by_course_title_test_id_teacher_id(
            db,
            question,
            course_title,
            test_id,
            teacher.id,  # type: ignore
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
