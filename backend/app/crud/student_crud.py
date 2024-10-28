from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.quiz import Course, Enrollment, Question, QuestionSubmission, Quiz
from app.schemas.question_submission import QuestionStudentSubmission


def get_enrolled_courses(db: Session, student_id: int):
    return (
        db.query(Course)
        .join(Enrollment)
        .filter(Enrollment.student_id == student_id)
        .all()
    )


def get_enrolled_course(db: Session, course_id: int, student_id: int):
    course = (
        db.query(Course)
        .join(Enrollment)
        .filter(Enrollment.student_id == student_id, Course.id == course_id)
        .first()
    )
    if not course:
        raise HTTPException(status_code=404, detail='Course not found for this student')
    return course


def get_enrolled_quiz(db: Session, course_id: int, quiz_id: int, student_id: int):
    quiz = (
        db.query(Quiz)
        .join(Enrollment)
        .filter(
            Enrollment.student_id == student_id,
            Quiz.course_id == course_id,
            Quiz.id == quiz_id,
        )
        .first()
    )
    if not quiz:
        raise HTTPException(
            status_code=404,
            detail='Quiz not found for this student in the specified course',
        )
    return quiz


def enroll_course(db: Session, course_id: int, student_id: int, course_pin: str):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail='Course not found')
    if course.pin != course_pin:
        raise HTTPException(status_code=400, detail='Invalid course pin')
    enrollment = Enrollment(student_id=student_id, course_id=course_id)
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    return enrollment


def get_quiz_questions(db: Session, quiz_id: int, user_id: int):
    questions = db.query(Question).filter(Question.quiz_id == quiz_id).all()

    for q in questions:
        question_attempt = (
            db.query(QuestionSubmission)
            .filter(
                QuestionSubmission.question_id == q.id,
                QuestionSubmission.user_id == user_id,  # type: ignore
            )
            .first()
        )
        if not question_attempt:
            question_attempt = QuestionSubmission(
                question_id=q.id,
                user_id=user_id,
                made_attempt=False,
                is_correct=False,
                response_data=q.question_data,
                total_mark=q.total_mark,
                received_mark=0,
            )
            db.add(question_attempt)
            db.commit()
            db.refresh(question_attempt)
    question_attempts = []
    for q in questions:
        question_attempt = (
            db.query(QuestionSubmission)
            .filter(
                QuestionSubmission.question_id == q.id,
                QuestionSubmission.user_id == user_id,  # type: ignore
            )
            .first()
        )
        question_attempts.append(question_attempt)
    return question_attempts


def submit_questions_answer(
    db: Session,
    course_id: int,
    quiz_id: int,
    question_attempt_id: int,
    user_id: int,
    response_data: QuestionStudentSubmission,
):
    question_attempt = (
        db.query(QuestionSubmission)
        .filter(QuestionSubmission.id == question_attempt_id)
        .first()
    )
    if question_attempt is None:
        raise HTTPException(
            status_code=404,
            detail='Question attempt not found for this student in the specified quiz',
        )
    question_attempt.response_data = response_data.response_data  # type: ignore
    db.commit()
    return question_attempt


def get_course_and_enrollment(course_title: str, student_id: int, db: Session):
    """Get the course and verify student enrollment."""
    course = db.query(Course).filter(Course.title == course_title).first()
    if not course:
        raise HTTPException(status_code=404, detail='Course not found')

    enrollment = (
        db.query(Enrollment)
        .filter(Enrollment.course_id == course.id, Enrollment.student_id == student_id)
        .first()
    )
    if not enrollment:
        raise HTTPException(
            status_code=403, detail='Student is not enrolled in this course'
        )

    return course, enrollment


def get_quiz_and_enrollment(course: Course, quiz_id: int, db: Session):
    """Get the quiz for the course."""
    quiz = (
        db.query(Quiz).filter(Quiz.id == quiz_id, Quiz.course_id == course.id).first()
    )
    if not quiz:
        raise HTTPException(status_code=404, detail='Quiz not found in this course')

    return quiz
