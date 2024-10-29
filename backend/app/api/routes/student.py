from fastapi import APIRouter

from app.api.deps import CurrentStudent, SessionDep
from app.crud import student_crud
from app.schemas.common import EnrollMetadata
from app.schemas.question_submission import QuestionStudentSubmission

router = APIRouter()


# ---- GET ROUTES ----


@router.get('/enrolled_courses')
def get_all_enrolled_courses_link(student: CurrentStudent, db: SessionDep):
    return student_crud.get_all_enrolled_courses_by_student_id(db, student.id)  # type: ignore


@router.get('/enrolled_courses/{course_title}')
def get_all_quiz_and_test_in_enrolled_course(  # type: ignore
    db: SessionDep,
    course_title: str,
    student: CurrentStudent,
):
    return student_crud.get_all_quizzes_tests_in_enrolled_course_by_course_title_student_id(  # noqa: E501
        db,
        course_title,
        student.id,  # type: ignore
    )  # type: ignore


@router.get('/enrolled_courses/quiz/{course_title}/{quiz_id}')
def get_all_question_in_a_quiz_of_enrolled_course(
    db: SessionDep,
    course_title: str,
    quiz_id: int,
    student: CurrentStudent,
):
    return student_crud.get_all_question_in_enrolled_course_by_course_title_quiz_id_student_id(  # noqa: E501
        db,
        course_title,
        quiz_id,
        student.id,  # type: ignore
    )


@router.get('/enrolled_courses/test/{course_title}/{test_id}')
def get_all_question_in_a_test_of_enrolled_course(
    db: SessionDep, course_title: str, test_id: int, student: CurrentStudent
):
    return student_crud.get_all_question_in_enrolled_course_by_course_title_test_id_student_id(  # noqa: E501
        db,
        course_title,
        test_id,
        student.id,  # type: ignore
    )


# ---- POST ROUTES ----


# // done
@router.post('/enrolled_courses/')
def enroll_course_with_course_pin_and_course_title(
    db: SessionDep, enroll_metadata: EnrollMetadata, student: CurrentStudent
):
    return student_crud.enroll_course_by_course_title_course_pin_student_id(
        db,
        enroll_metadata.course_title,
        enroll_metadata.course_pin,
        student.id,  # type: ignore
    )


@router.post('/enrolled_courses/submit/{course_title}/{question_set_id}/{question_id}')
def submit_question_with_course_title_question_set_id_question_id(
    db: SessionDep,
    course_title: str,
    question_set_id: int,
    question_id: int,
    user_submission: QuestionStudentSubmission,
    student: CurrentStudent,
):
    return student_crud.mark_submission_by_question_with_course_title_question_set_id_question_id(  # noqa: E501
        db,
        course_title,
        question_set_id,
        question_id,
        user_submission,
        student.id,  # type: ignore
    )
