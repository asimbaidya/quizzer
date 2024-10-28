from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.quiz import Course, Enrollment, Question, QuestionAttempt, Quiz


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


def enroll_course(db: Session, course_id: int, student_id: int):
    enrollment = Enrollment(student_id=student_id, course_id=course_id)
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    return enrollment


def submit_answer():
    return 'TODO'
