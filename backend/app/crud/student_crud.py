from datetime import datetime, timezone

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.api.mark import mark_user_submission
from app.crud.ensure import ensure_question_submissions
from app.models.quiz import (
    Course,
    Enrollment,
    Question,
    QuestionSet,
    QuestionSubmission,
    Quiz,
    SubmissionStatus,
    Test,
    UserTestSession,
)
from app.models.user import Note
from app.schemas.question import QuestionTeacherView
from app.schemas.question_submission import QuestionStudentSubmission
from app.schemas.user import NoteCreate, NoteUpdate


def get_all_enrolled_courses_by_student_id(db: Session, student_id: int):
    courses = (
        db.query(Course)
        .join(Enrollment)
        .filter(Enrollment.student_id == student_id)
        .all()
    )
    for course in courses:
        course.url = f'/student/enrolled_courses/{course.title}'
    return courses


def get_all_quizzes_tests_in_enrolled_course_by_course_title_student_id(  # type: ignore
    db: Session, course_title: str, student_id: int
):
    course, _enrollment = get_course_and_enrollment_by_course_title_student_id_or_404(
        db, course_title, student_id
    )

    quizzes = db.query(Quiz).filter(Quiz.course_id == course.id).all()
    tests = db.query(Test).filter(Test.course_id == course.id).all()

    for quiz in quizzes:
        quiz.url = f'/student/enrolled_courses/quiz/{course_title}/{quiz.id}'

    for test in tests:
        test.url = f'/student/enrolled_courses/test/{course_title}/{test.id}'

    # TODO: Retun the quizzes and tests in a better way
    # FOR Test also fetch if test started
    # and send data according

    return {
        'quizzes': quizzes,
        'tests': tests,
    }  # type: ignore


def get_all_question_in_enrolled_course_by_course_title_quiz_id_student_id(
    db: Session, course_title: str, quiz_id: int, student_id: int
):
    """Get the quiz for the course."""
    course, _enrollment = get_course_and_enrollment_by_course_title_student_id_or_404(
        db, course_title, student_id
    )

    quiz = get_quiz_by_quiz_id_or_404(db, quiz_id)
    if quiz.course_id is not course.id:
        raise HTTPException(
            status_code=404, detail='Quiz not found in the specified course'
        )
    # sure enrolled so fetch question
    questions = (
        db.query(Question)
        .join(QuestionSet, QuestionSet.id == Question.question_set_id)
        .join(Quiz, Quiz.id == quiz_id)
        .filter(QuestionSet.id == quiz.question_set_id)
        .all()
    )
    for question in questions:
        question.url = f'/student/enrolled_courses/submit/{course_title}/{question.question_set_id}/{question.id}'  # noqa: E501
        if question.image is not None:
            question.image_url = (
                f'http://127.0.0.1:8000/API/image_show/{question.image}'
            )
    return questions


def start_test_by_course_title_test_id_student_id(
    db: Session, course_title: str, test_id: int, student_id: int
):
    course, _enrollment = get_course_and_enrollment_by_course_title_student_id_or_404(
        db, course_title, student_id
    )

    test = get_test_by_test_id_or_404(db, test_id)
    if test.course_id is not course.id:
        raise HTTPException(
            status_code=404, detail='Test not found in the specified course'
        )

    # student verification done
    # check if test is already started
    user_test_session = (
        db.query(UserTestSession)
        .filter(
            UserTestSession.test_id == test_id, UserTestSession.user_id == student_id
        )
        .first()
    )
    if user_test_session:
        return HTTPException(
            status_code=400, detail='Test already started by the student'
        )

    # check if test window is open
    validate_test_window(db, test_id, student_id)

    # create a new session
    user_test_session = UserTestSession(
        test_id=test_id, user_id=student_id, start_time=datetime.now()
    )
    db.add(user_test_session)
    db.commit()
    db.refresh(user_test_session)
    return user_test_session


def get_all_question_in_enrolled_course_by_course_title_test_id_student_id(
    db: Session, course_title: str, test_id: int, student_id: int
):
    """Get the quiz for the course."""
    course, _enrollment = get_course_and_enrollment_by_course_title_student_id_or_404(
        db, course_title, student_id
    )

    test = get_test_by_test_id_or_404(db, test_id)
    if test.course_id is not course.id:
        raise HTTPException(
            status_code=404, detail='Test not found in the specified course'
        )
    # check if started
    user_test_session = db.query(UserTestSession).filter(
        UserTestSession.test_id == test_id, UserTestSession.user_id == student_id
    )
    if not user_test_session:
        raise HTTPException(status_code=400, detail='Test not started by the student')

    # TODO: filter questions based on the test window
    # sure enrolled so fetch questio
    # only send test question if test stared and during the test
    # check: if duration is over
    # 1: return result after window_end is ended
    # 2: else just  message that result will show after window over
    questions = (
        db.query(Question)
        .join(QuestionSet, QuestionSet.id == Question.question_set_id)
        .join(Test, Test.id == test_id)
        .filter(QuestionSet.id == test.question_set_id)
        .all()
    )
    for question in questions:
        question.url = f'/student/enrolled_courses/submit/{course_title}/{question.question_set_id}/{question.id}'  # noqa: E501
        if question.image is not None:
            question.image_url = (
                f'http://127.0.0.1:8000/API/image_show/{question.image}'
            )
    return questions


def get_all_notes_by_student_id(db: Session, student_id: int):
    return db.query(Note).filter(Note.user_id == student_id).all()


def get_single_note_by_student_id_note_id(db: Session, student_id: int, note_id: int):
    return db.query(Note).filter(Note.user_id == student_id, Note.id == note_id).first()


# ---------- Post/PATCH/DELETE ----------


def create_note_by_student_id(db: Session, student_id: int, note: NoteCreate):
    db_note = Note(
        **note.model_dump(),
        user_id=student_id,
    )
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note


def update_note_by_student_id_note_id(
    db: Session, student_id: int, note_id: int, note: NoteUpdate
):
    db_note = (
        db.query(Note).filter(Note.user_id == student_id, Note.id == note_id).first()
    )
    if db_note is None:
        raise HTTPException(status_code=404, detail='Note not found')

    db.query(Note).filter(Note.user_id == student_id, Note.id == note_id).update(
        {'note_data': note.note_data.model_dump(), 'updated_at': datetime.now()}
    )

    db.commit()
    db.refresh(db_note)
    return db_note


def delete_note_by_student_id_note_id(db: Session, student_id: int, note_id: int):
    db_note = (
        db.query(Note).filter(Note.user_id == student_id, Note.id == note_id).first()
    )
    if db_note is None:
        raise HTTPException(status_code=404, detail='Note not found')
    db.delete(db_note)
    db.commit()
    return db_note


def enroll_course_by_course_title_course_pin_student_id(
    db: Session, course_title: str, course_pin: str, student_id: int
):
    course, enrollment = get_course_and_enrollment_by_course_title_student_id(
        db, course_title, student_id
    )
    if enrollment is not None:
        raise HTTPException(
            status_code=400, detail='Student already enrolled in the course'
        )

    if str(course.course_pin) != course_pin:
        raise HTTPException(status_code=400, detail='Invalid course pin')

    enrollment = Enrollment(student_id=student_id, course_id=course.id)
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    return enrollment


def submit_question_answer(
    db: Session,
    course_title: str,
    question_set_id: int,
    question_id: int,
    user_submission: QuestionStudentSubmission,
    student_id: int,
):
    ensure_question_submissions(db, question_set_id, student_id)
    submission = (
        db.query(QuestionSubmission)
        .filter(
            QuestionSubmission.question_id == question_id,
            QuestionSubmission.user_id == student_id,
        )
        .first()
    )
    if submission is None:
        raise HTTPException(status_code=404, detail='Question submission not found')

    # check if it's a quiz or test
    quiz = db.query(Quiz).filter(Quiz.question_set_id == question_set_id).first()
    test = db.query(Test).filter(Test.question_set_id == question_set_id).first()

    if quiz:
        validate_quiz_attempt(db, quiz.id, submission.attempt_count)
    elif test:
        validate_test_window(db, test.id, student_id)
    else:
        raise HTTPException(status_code=404, detail='Quiz or Test not found')

    return submit_question(
        db,
        course_title,
        question_set_id,
        question_id,
        user_submission,
        student_id,
    )


# helper functions
def get_courses_by_course_title__or_404(db: Session, course_title: str):
    course = db.query(Course).filter(Course.title == course_title).first()
    if course is None:
        raise HTTPException(status_code=404, detail='Course not found')
    return course


def get_course_and_enrollment_by_course_title_student_id(
    db: Session, course_title: str, student_id: int
):
    course = get_courses_by_course_title__or_404(db, course_title)
    enrollment = (
        db.query(Enrollment)
        .filter(Enrollment.student_id == student_id, Enrollment.course_id == course.id)
        .first()
    )
    return course, enrollment


def get_course_and_enrollment_by_course_title_student_id_or_404(
    db: Session, course_title: str, student_id: int
):
    course = get_courses_by_course_title__or_404(db, course_title)
    enrollment = (
        db.query(Enrollment)
        .filter(Enrollment.student_id == student_id, Enrollment.course_id == course.id)
        .first()
    )
    if enrollment is None:
        raise HTTPException(
            status_code=404, detail='Student not enrolled in the course'
        )
    return course, enrollment


def get_quiz_by_quiz_id_or_404(db: Session, quiz_id: int):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if quiz is None:
        raise HTTPException(status_code=404, detail='Quiz not found')
    return quiz


def get_test_by_test_id_or_404(db: Session, test_id: int):
    test = db.query(Test).filter(Test.id == test_id).first()
    if test is None:
        raise HTTPException(status_code=404, detail='Test not found')
    return test


# helper functionf or submitting question
def submit_question(
    db: Session,
    _course_title: str,
    question_set_id: int,
    question_id: int,
    user_submission: QuestionStudentSubmission,
    student_id: int,
):
    # initialize or retrieve the existing submission
    submission = (
        db.query(QuestionSubmission)
        .filter(
            QuestionSubmission.question_id == question_id,
            QuestionSubmission.user_id == student_id,
        )
        .first()
    )
    if not submission:
        return HTTPException(status_code=404, detail='Question submission not found')

    # Retrieve the question
    question = (
        db.query(Question)
        .filter(
            Question.id == question_id,
            Question.question_set_id == question_set_id,
        )
        .first()
    )
    if question is None:
        raise HTTPException(status_code=404, detail='Question not found')

    # Determine if the question belongs to a Quiz or Test
    quiz = db.query(Quiz).filter(Quiz.question_set_id == question_set_id).first()
    test = db.query(Test).filter(Test.question_set_id == question_set_id).first()

    if quiz:
        validate_quiz_attempt(db, quiz.id, submission.attempt_count)
    elif test:
        validate_test_window(db, test.id, student_id)
    else:
        raise HTTPException(status_code=400, detail='Invalid question set type')

    # Mark the user's submission
    question_create = QuestionTeacherView.model_validate(question)
    try:
        marked_user_submission = mark_user_submission(user_submission, question_create)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    # prepare the update data
    update_data = {  # type: ignore
        'status': SubmissionStatus.SUBMITTED,
        'attempt_count': submission.attempt_count + 1,
        'score': marked_user_submission.score,
        'feedback': marked_user_submission.feedback,
        'user_response': marked_user_submission.model_dump(
            exclude=['id', 'user_id', 'question_id']  # type: ignore
        ),
    }

    # perform a single update query
    db.query(QuestionSubmission).filter(QuestionSubmission.id == submission.id).update(
        update_data  # type: ignore
    )

    db.commit()
    db.refresh(submission)

    return submission


# Validation functions
def validate_quiz_attempt(db: Session, quiz_id: int, attempt_count: int):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()

    if not quiz:
        raise HTTPException(status_code=404, detail='Quiz not found')

    if (quiz.is_unlimited_attempt is False) and (attempt_count >= quiz.allowed_attempt):  # type: ignore
        raise HTTPException(status_code=403, detail='Maximum attempts reached')


def validate_test_window(db: Session, test_id: int, student_id: int) -> None:
    test = db.query(Test).filter(Test.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail='Test not found')
    now = datetime.now(timezone.utc)

    # Ensure test.window_start and test.window_end are timezone-aware
    if test.window_start.tzinfo is None:
        window_start = test.window_start.replace(tzinfo=timezone.utc)
    else:
        window_start = test.window_start.astimezone(timezone.utc)

    if test.window_end.tzinfo is None:
        window_end = test.window_end.replace(tzinfo=timezone.utc)
    else:
        window_end = test.window_end.astimezone(timezone.utc)

    if now < window_start:
        raise HTTPException(status_code=400, detail='Test has not started yet')
    if now > window_end:
        raise HTTPException(status_code=400, detail='Test window has expired')

    session = (
        db.query(UserTestSession)
        .filter(
            UserTestSession.test_id == test_id, UserTestSession.user_id == student_id
        )
        .first()
    )
    if not session:
        session = UserTestSession(test_id=test_id, user_id=student_id, start_time=now)
        db.add(session)
        db.commit()
    time_elapsed = now - session.start_time
    if time_elapsed.total_seconds() > test.duration * 60:
        raise HTTPException(status_code=400, detail='Test duration exceeded')
