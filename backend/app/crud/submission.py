import uuid
from datetime import UTC, datetime
from typing import Any

from fastapi import HTTPException
from sqlmodel import Session, select

from app.crud.course import require_enrollment
from app.crud.question import image_url
from app.crud.quiz import get_quiz_or_404, get_test_or_404
from app.marking import mark_submission
from app.models import (
    Question,
    QuestionSubmission,
    QuestionTeacherData,
    Quiz,
    StudentAnswer,
    Test,
    UserTestSession,
)
from app.models.enums import SubmissionStatus, TestStatus


# ---- Submission bootstrapping -------------------------------------------------
def ensure_question_submissions(
    session: Session, question_set_id: uuid.UUID, student_id: uuid.UUID
) -> None:
    """Create a VIEWED submission row for every question the student hasn't seen."""
    questions = session.exec(
        select(Question).where(Question.question_set_id == question_set_id)
    ).all()
    for question in questions:
        existing = session.exec(
            select(QuestionSubmission).where(
                QuestionSubmission.question_id == question.id,
                QuestionSubmission.user_id == student_id,
            )
        ).first()
        if existing is None:
            session.add(
                QuestionSubmission(
                    question_id=question.id,
                    user_id=student_id,
                    question_type=question.question_type,
                    made_attempt=False,
                )
            )
    session.commit()


# ---- Test lifecycle status ----------------------------------------------------
def get_test_status(
    window_start: datetime,
    window_end: datetime,
    test_session: UserTestSession | None,
    duration_minutes: int,
) -> TestStatus:
    now = datetime.now(UTC)
    window_start = window_start.astimezone(UTC)
    window_end = window_end.astimezone(UTC)

    if now < window_start:
        return TestStatus.NOT_OPENED
    if window_start <= now <= window_end:
        if test_session is not None:
            elapsed = now - test_session.start_time.astimezone(UTC)
            if elapsed.total_seconds() < duration_minutes * 60:
                return TestStatus.IN_PROGRESS
            return TestStatus.IN_WAITING_FOR_RESULT
        return TestStatus.NOT_STARTED
    return (
        TestStatus.COMPLETED
        if test_session is not None
        else TestStatus.NOT_PARTICIPATED
    )


def _test_session(
    session: Session, test_id: uuid.UUID, student_id: uuid.UUID
) -> UserTestSession | None:
    return session.exec(
        select(UserTestSession).where(
            UserTestSession.test_id == test_id,
            UserTestSession.user_id == student_id,
        )
    ).first()


# ---- Building student-facing views -------------------------------------------
def _student_question_view(
    question: Question, submit_url: str | None
) -> dict[str, Any]:
    data = question.question_data
    choices = data.get("choices")
    student_choices = (
        [{"text": c["text"]} for c in choices] if isinstance(choices, list) else None
    )
    return {
        "id": question.id,
        "question_type": question.question_type,
        "question_data": {
            "question_type": data.get("question_type"),
            "question_text": data.get("question_text"),
            "choices": student_choices,
        },
        "tag": question.tag,
        "total_marks": question.total_marks,
        "image": question.image,
        "image_url": image_url(question.image),
        "submit_url": submit_url,
    }


def _submission_view(
    submission: QuestionSubmission | None, *, hide_result: bool = False
) -> dict[str, Any] | None:
    if submission is None:
        return None
    return {
        "question_type": submission.question_type,
        "user_response": submission.user_response,
        "made_attempt": submission.made_attempt,
        "is_correct": None if hide_result else submission.is_correct,
        "score": None if hide_result else submission.score,
        "feedback": None if hide_result else submission.feedback,
        "attempt_count": submission.attempt_count,
        "status": submission.status,
    }


def _questions_with_submissions(
    session: Session,
    question_set_id: uuid.UUID,
    student_id: uuid.UUID,
    course_title: str,
    submit_enabled: bool,
    hide_result: bool,
) -> list[dict[str, Any]]:
    rows = session.exec(
        select(Question, QuestionSubmission)
        .join(
            QuestionSubmission,
            (QuestionSubmission.question_id == Question.id)  # type: ignore[arg-type]
            & (QuestionSubmission.user_id == student_id),
            isouter=True,
        )
        .where(Question.question_set_id == question_set_id)
    ).all()
    result = []
    for question, submission in rows:
        submit_url = (
            f"/questions/submit/{question.id}"
            f"?course_title={course_title}&question_set_id={question_set_id}"
            if submit_enabled
            else None
        )
        result.append(
            {
                "question": _student_question_view(question, submit_url),
                "submission": _submission_view(submission, hide_result=hide_result),
            }
        )
    return result


# ---- Quiz (student) -----------------------------------------------------------
def get_quiz_with_submissions(
    session: Session, course_title: str, quiz_id: uuid.UUID, student_id: uuid.UUID
) -> dict[str, Any]:
    course, _ = require_enrollment(session, course_title, student_id)
    quiz = get_quiz_or_404(session, quiz_id)
    if quiz.course_id != course.id:
        raise HTTPException(status_code=404, detail="Quiz not found in this course")

    ensure_question_submissions(session, quiz.question_set_id, student_id)
    return {
        "question_submissions": _questions_with_submissions(
            session,
            quiz.question_set_id,
            student_id,
            course_title,
            submit_enabled=True,
            hide_result=False,
        ),
        "question_set_id": quiz.question_set_id,
        "total_mark": quiz.total_mark,
        "allowed_attempt": quiz.allowed_attempt,
        "is_unlimited_attempt": quiz.is_unlimited_attempt,
    }


# ---- Test (student) -----------------------------------------------------------
def start_test(
    session: Session, course_title: str, test_id: uuid.UUID, student_id: uuid.UUID
) -> UserTestSession:
    course, _ = require_enrollment(session, course_title, student_id)
    test = get_test_or_404(session, test_id)
    if test.course_id != course.id:
        raise HTTPException(status_code=404, detail="Test not found in this course")

    existing = _test_session(session, test_id, student_id)
    status = get_test_status(
        test.window_start, test.window_end, existing, test.duration
    )
    if existing is not None or status != TestStatus.NOT_STARTED:
        raise HTTPException(
            status_code=400, detail=f"Test cannot be started (status: {status})"
        )
    test_session = UserTestSession(test_id=test_id, user_id=student_id)
    session.add(test_session)
    session.commit()
    session.refresh(test_session)
    return test_session


def get_test_with_submissions(
    session: Session, course_title: str, test_id: uuid.UUID, student_id: uuid.UUID
) -> dict[str, Any]:
    course, _ = require_enrollment(session, course_title, student_id)
    test = get_test_or_404(session, test_id)
    if test.course_id != course.id:
        raise HTTPException(status_code=404, detail="Test not found in this course")

    test_session = _test_session(session, test_id, student_id)
    status = get_test_status(
        test.window_start, test.window_end, test_session, test.duration
    )
    if status in (
        TestStatus.NOT_OPENED,
        TestStatus.NOT_STARTED,
        TestStatus.NOT_PARTICIPATED,
        TestStatus.IN_WAITING_FOR_RESULT,
    ):
        raise HTTPException(
            status_code=400, detail="Unauthorized to view the test questions"
        )

    ensure_question_submissions(session, test.question_set_id, student_id)
    in_progress = status == TestStatus.IN_PROGRESS
    return {
        "question_submissions": _questions_with_submissions(
            session,
            test.question_set_id,
            student_id,
            course_title,
            submit_enabled=in_progress,
            hide_result=in_progress,  # keep answers hidden until the test ends
        ),
        "question_set_id": test.question_set_id,
        "total_mark": test.total_mark,
        "status": status,
        "start_time": test_session.start_time if test_session else None,
        "window_end": test.window_end,
        "duration": test.duration,
    }


# ---- Answer submission --------------------------------------------------------
def _validate_quiz_attempt(quiz: Quiz, attempt_count: int) -> None:
    if not quiz.is_unlimited_attempt and attempt_count >= quiz.allowed_attempt:
        raise HTTPException(status_code=403, detail="Maximum attempts reached")


def _validate_test_window(session: Session, test: Test, student_id: uuid.UUID) -> None:
    now = datetime.now(UTC)
    if now < test.window_start.astimezone(UTC):
        raise HTTPException(status_code=400, detail="Test has not started yet")
    if now > test.window_end.astimezone(UTC):
        raise HTTPException(status_code=400, detail="Test window has expired")
    test_session = _test_session(session, test.id, student_id)
    if test_session is None:
        raise HTTPException(status_code=400, detail="Test has not been started")
    elapsed = now - test_session.start_time.astimezone(UTC)
    if elapsed.total_seconds() > test.duration * 60:
        raise HTTPException(status_code=400, detail="Test duration exceeded")


def submit_answer(
    session: Session,
    course_title: str,
    question_set_id: uuid.UUID,
    question_id: uuid.UUID,
    answer: StudentAnswer,
    student_id: uuid.UUID,
) -> QuestionSubmission:
    require_enrollment(session, course_title, student_id)
    ensure_question_submissions(session, question_set_id, student_id)

    submission = session.exec(
        select(QuestionSubmission).where(
            QuestionSubmission.question_id == question_id,
            QuestionSubmission.user_id == student_id,
        )
    ).first()
    if submission is None:
        raise HTTPException(status_code=404, detail="Question submission not found")

    question = session.exec(
        select(Question).where(
            Question.id == question_id,
            Question.question_set_id == question_set_id,
        )
    ).first()
    if question is None:
        raise HTTPException(status_code=404, detail="Question not found")
    if question.question_type != answer.question_type:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Invalid submission: expected {question.question_type} "
                f"but got {answer.question_type}"
            ),
        )

    quiz = session.exec(
        select(Quiz).where(Quiz.question_set_id == question_set_id)
    ).first()
    test = session.exec(
        select(Test).where(Test.question_set_id == question_set_id)
    ).first()
    if quiz is not None:
        _validate_quiz_attempt(quiz, submission.attempt_count)
    elif test is not None:
        _validate_test_window(session, test, student_id)
    else:
        raise HTTPException(status_code=404, detail="Quiz or Test not found")

    try:
        result = mark_submission(
            question_data=QuestionTeacherData.model_validate(question.question_data),
            total_marks=question.total_marks,
            response=answer.user_response,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    submission.status = SubmissionStatus.SUBMITTED
    submission.attempt_count += 1
    submission.made_attempt = True
    submission.score = result.score
    submission.is_correct = result.is_correct
    submission.feedback = result.feedback
    submission.user_response = answer.user_response.model_dump()
    session.add(submission)
    session.commit()
    session.refresh(submission)
    return submission
