import uuid
from typing import Any

from fastapi import APIRouter

from app.api.deps import CurrentStudent, SessionDep
from app.crud import course as course_crud
from app.crud import note as note_crud
from app.crud import submission as submission_crud
from app.models import (
    BatchSubmission,
    CoursePublic,
    EnrollMetadata,
    NoteCreate,
    NotePublic,
    NoteUpdate,
    StudentAnswer,
)

router = APIRouter(prefix="/student", tags=["student"])


# ---- Enrolled courses ----
@router.get("/enrolled_courses", response_model=list[CoursePublic])
def get_enrolled_courses(session: SessionDep, student: CurrentStudent) -> Any:
    return course_crud.get_enrolled_courses(session, student.id)


@router.post("/enrolled_courses")
def enroll_course(
    session: SessionDep, enroll: EnrollMetadata, student: CurrentStudent
) -> Any:
    return course_crud.enroll_student(
        session, enroll.course_title, enroll.course_pin, student.id
    )


@router.get("/enrolled_courses/{course_title}")
def get_quizzes_and_tests(
    course_title: str, session: SessionDep, student: CurrentStudent
) -> dict[str, Any]:
    return submission_crud.get_course_contents_with_status(
        session, course_title, student.id
    )


# ---- Quiz / Test taking ----
@router.get("/enrolled_courses/quiz/{course_title}/{quiz_id}")
def get_quiz_questions(
    course_title: str,
    quiz_id: uuid.UUID,
    session: SessionDep,
    student: CurrentStudent,
) -> Any:
    return submission_crud.get_quiz_with_submissions(
        session, course_title, quiz_id, student.id
    )


@router.post("/enrolled_courses/test/{course_title}/{test_id}")
def start_test(
    course_title: str,
    test_id: uuid.UUID,
    session: SessionDep,
    student: CurrentStudent,
) -> Any:
    return submission_crud.start_test(session, course_title, test_id, student.id)


@router.get("/enrolled_courses/test/{course_title}/{test_id}")
def get_test_questions(
    course_title: str,
    test_id: uuid.UUID,
    session: SessionDep,
    student: CurrentStudent,
) -> Any:
    return submission_crud.get_test_with_submissions(
        session, course_title, test_id, student.id
    )


@router.post("/enrolled_courses/quiz/{course_title}/{quiz_id}/submit")
def submit_quiz(
    course_title: str,
    quiz_id: uuid.UUID,
    submission: BatchSubmission,
    session: SessionDep,
    student: CurrentStudent,
) -> Any:
    """Submit an entire quiz at once (one submission = one attempt)."""
    return submission_crud.submit_quiz_batch(
        session, course_title, quiz_id, student.id, submission.answers
    )


@router.post("/enrolled_courses/test/{course_title}/{test_id}/submit")
def submit_test(
    course_title: str,
    test_id: uuid.UUID,
    submission: BatchSubmission,
    session: SessionDep,
    student: CurrentStudent,
) -> Any:
    """Submit an entire test at once and lock it (also used for auto-submit)."""
    return submission_crud.submit_test_batch(
        session, course_title, test_id, student.id, submission.answers
    )


@router.post("/questions/submit/{question_id}")
def submit_answer(
    question_id: uuid.UUID,
    course_title: str,
    question_set_id: uuid.UUID,
    answer: StudentAnswer,
    session: SessionDep,
    student: CurrentStudent,
) -> Any:
    return submission_crud.submit_answer(
        session, course_title, question_set_id, question_id, answer, student.id
    )


# ---- Notes ----
@router.get("/notes", response_model=list[NotePublic])
def get_notes(session: SessionDep, student: CurrentStudent) -> Any:
    return note_crud.get_notes(session, student.id)


@router.get("/notes/{note_id}", response_model=NotePublic)
def get_note(note_id: uuid.UUID, session: SessionDep, student: CurrentStudent) -> Any:
    return note_crud.get_note_or_404(session, student.id, note_id)


@router.post("/notes", response_model=NotePublic)
def create_note(note: NoteCreate, session: SessionDep, student: CurrentStudent) -> Any:
    return note_crud.create_note(session, student.id, note)


@router.put("/notes/{note_id}", response_model=NotePublic)
def update_note(
    note_id: uuid.UUID,
    note: NoteUpdate,
    session: SessionDep,
    student: CurrentStudent,
) -> Any:
    return note_crud.update_note(session, student.id, note_id, note)


@router.delete("/notes/{note_id}", response_model=NotePublic)
def delete_note(
    note_id: uuid.UUID, session: SessionDep, student: CurrentStudent
) -> Any:
    return note_crud.delete_note(session, student.id, note_id)
