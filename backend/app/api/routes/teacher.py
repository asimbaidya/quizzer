from fastapi import APIRouter, HTTPException

from app.api.deps import CurrentTeacher, SessionDep
from app.crud import teacher_crud
from app.schemas.request_model import CourseCreate, QuizCreate, TestCreate
from app.schemas.question import QuestionTeacherView
from app.schemas.response_models import CourseResponse

router = APIRouter()


# ---- GET ROUTES ----


@router.get(
    '/courses',
)
def get_courses(db: SessionDep, teacher: CurrentTeacher):
    if not isinstance(teacher.id, int):
        return HTTPException(status_code=400, detail='Invalid teacher id')

    courses = teacher_crud.get_courses_by_creator_id(db, creator_id=teacher.id)
    return [CourseResponse.model_validate(course) for course in courses]


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


@router.get(
    '/course/students/{course_title}',
)
def get_enrolled_students(course_title: str, db: SessionDep, teacher: CurrentTeacher):
    return teacher_crud.get_enrolled_students(db, course_title, teacher.id)  # type: ignore


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


@router.get('/course/quiz/students/{course_title}/{quiz_id}')
def get_student_progress_in_quiz(
    course_title: str, quiz_id: int, db: SessionDep, teacher: CurrentTeacher
):
    student_progress = (
        teacher_crud.get_student_progress_course_title_quiz_id_teacher_id(
            db,
            course_title,
            quiz_id,
            teacher.id,  # type: ignore
        )
    )

    #  {
    #     "id": 7,
    #     "user_response": {
    #       "question_type": "single_choice",
    #       "user_response": "def"
    #     },
    #     "feedback": "Correct! Your answer is right.",
    #     "user_id": 3,
    #     "question_id": 14,
    #     "made_attempt": true,
    #     "question_type": "single_choice",
    #     "is_correct": true,
    #     "score": 5,
    #     "attempt_time": "2024-10-30T00:40:09.257321"
    #   }

    # Group data by student
    grouped_data = {}
    for progress in student_progress:
        student_id = progress.user_id

        if student_id not in grouped_data:
            grouped_data[student_id] = {
                'name': progress.id,
                'email': progress.id,
                'score': 0,
                'submissions': [],
            }

        grouped_data[student_id]['score'] += progress.score
        grouped_data[student_id]['submissions'].append(progress)

    return grouped_data

    print(student_progress)
    return student_progress


@router.get('/course/test/students/{course_title}/{test_id}')
def get_student_progress_in_test(
    course_title: str, test_id: int, db: SessionDep, teacher: CurrentTeacher
):
    return teacher_crud.get_student_progress_course_title_test_id_teacher_id(
        db,
        course_title,
        test_id,
        teacher.id,  # type: ignore
    )


# ---- POST ROUTES ----


@router.post(
    '/course',
)
def create_course(db: SessionDep, course: CourseCreate, teacher: CurrentTeacher):
    try:
        return teacher_crud.create_course_by_teacher_id(db, course, teacher.id)  # type: ignore
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


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
