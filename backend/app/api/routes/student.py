from fastapi import APIRouter

from app.api.deps import CurrentStudent, SessionDep
from app.crud import student_crud
from app.schemas.question import QuestionStudentView
from app.schemas.question_submission import QuestionStudentSubmission
from app.schemas.request_model import EnrollMetadata
from app.schemas.user import NoteCreate, NoteUpdate

router = APIRouter()


# ---- GET ROUTES ----


@router.get('/enrolled_courses')
def get_all_enrolled_courses_link(student: CurrentStudent, db: SessionDep):
    return student_crud.get_all_enrolled_courses_by_student_id(db, student.id)


@router.get('/enrolled_courses/{course_title}')
def get_all_quiz_and_test_in_enrolled_course(  # type: ignore
    db: SessionDep,
    course_title: str,
    student: CurrentStudent,
):
    return student_crud.get_all_quizzes_tests_in_enrolled_course_by_course_title_student_id(  # noqa: E501
        db,
        course_title,
        student.id,
    )  # type: ignore


@router.get(
    '/enrolled_courses/quiz/{course_title}/{quiz_id}',
    response_model=list[QuestionStudentView],
)
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
        student.id,
    )


@router.get(
    '/enrolled_courses/test/{course_title}/{test_id}',
    response_model=list[QuestionStudentView],
)
def get_all_question_in_a_test_of_enrolled_course(
    db: SessionDep, course_title: str, test_id: int, student: CurrentStudent
):
    return student_crud.get_all_question_in_enrolled_course_by_course_title_test_id_student_id(  # noqa: E501
        db,
        course_title,
        test_id,
        student.id,
    )


@router.get('/notes')
def get_all_note_of_user(db: SessionDep, student: CurrentStudent):
    return student_crud.get_all_notes_by_student_id(db, student.id)


@router.get('/notes/{note_id}')
def get_specific_note_of_user(db: SessionDep, student: CurrentStudent, note_id: int):
    return student_crud.get_single_note_by_student_id_note_id(db, student.id, note_id)


@router.post('/notes')
def create_note_for_user(db: SessionDep, student: CurrentStudent, note: NoteCreate):
    return student_crud.create_note_by_student_id(db, student.id, note)


@router.put('/notes/{note_id}')
def update_note_for_user(
    db: SessionDep, student: CurrentStudent, note_id: int, note: NoteUpdate
):
    return student_crud.update_note_by_student_id_note_id(db, student.id, note_id, note)


@router.delete('/notes/{note_id}')
def delete_note_for_user(db: SessionDep, student: CurrentStudent, note_id: int):
    return student_crud.delete_note_by_student_id_note_id(db, student.id, note_id)


# ---- POST ROUTES ----


@router.post('/enrolled_courses/')
def enroll_course_with_course_pin_and_course_title(
    db: SessionDep, enroll_metadata: EnrollMetadata, student: CurrentStudent
):
    return student_crud.enroll_course_by_course_title_course_pin_student_id(
        db,
        enroll_metadata.course_title,
        enroll_metadata.course_pin,
        student.id,
    )


@router.post('/questions/submit/{question_id}')
def submit_question_answer(
    db: SessionDep,
    course_title: str,
    question_set_id: int,
    question_id: int,
    user_submission: QuestionStudentSubmission,
    current_student: CurrentStudent,
):
    return student_crud.submit_question_answer(
        db,
        course_title,
        question_set_id,
        question_id,
        user_submission,
        current_student.id,
    )
