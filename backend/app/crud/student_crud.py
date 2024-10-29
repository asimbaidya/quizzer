from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.api.mark import mark_user_submission
from app.models.quiz import (
    Course,
    Enrollment,
    Question,
    QuestionSet,
    QuestionSubmission,
    Quiz,
    Test,
)
from app.schemas.question import QuestionTeacherView
from app.schemas.question_submission import QuestionStudentSubmission


def get_all_enrolled_courses_by_student_id(db: Session, student_id: int):
    return (
        db.query(Course)
        .join(Enrollment)
        .filter(Enrollment.student_id == student_id)
        .all()
    )


def get_all_quizzes_tests_in_enrolled_course_by_course_title_student_id(  # type: ignore
    db: Session, course_title: str, student_id: int
):
    course, _enrollment = get_course_and_enrollment_by_course_title_student_id_or_404(
        db, course_title, student_id
    )

    quizzes = db.query(Quiz).filter(Quiz.course_id == course.id).all()
    tests = db.query(Test).filter(Test.course_id == course.id).all()

    # TODO: Retun the quizzes and tests in a better way
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
    return (
        db.query(Question)
        .join(QuestionSet, QuestionSet.id == Question.question_set_id)
        .join(Quiz, Quiz.id == quiz_id)
        .filter(QuestionSet.id == quiz.question_set_id)
        .all()
    )


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
    # sure enrolled so fetch question
    return (
        db.query(Question)
        .join(QuestionSet, QuestionSet.id == Question.question_set_id)
        .join(Test, Test.id == test_id)
        .filter(QuestionSet.id == test.question_set_id)
        .all()
    )


# ---------- Post ----------


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


def mark_submission_by_question_with_course_title_question_set_id_question_id(
    db: Session,
    course_title: str,
    question_set_id: int,
    question_id: int,
    user_submission: QuestionStudentSubmission,
    student_id: int,
):
    _course, _enrollment = get_course_and_enrollment_by_course_title_student_id_or_404(
        db, course_title, student_id
    )
    question_submission = (
        db.query(QuestionSubmission)
        .filter(
            QuestionSubmission.question_id == question_id,
            QuestionSubmission.user_id == student_id,
        )
        .first()
    )

    if question_submission is not None:
        raise HTTPException(
            # already submitted
            status_code=400,
            detail='Question already submitted by the student',
        )

    question = (
        db.query(Question)
        .filter(Question.id == question_id, Question.question_set_id == question_set_id)
        .first()
    )
    if question is None:
        raise HTTPException(status_code=404, detail='Question not found')

    question_create = QuestionTeacherView.model_validate(question)
    marked_user_submission = mark_user_submission(user_submission, question_create)

    question_submission = QuestionSubmission(
        question_type=marked_user_submission.question_type,
        user_id=student_id,
        question_id=question_id,
        response_data=marked_user_submission,
        made_attempt=True,
        score=marked_user_submission.score,
        feedback=marked_user_submission.feedback,
    )

    db.add(question_submission)
    db.commit()
    db.refresh(question_submission)
    return question_submission


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
