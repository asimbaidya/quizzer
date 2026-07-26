import uuid

from fastapi import HTTPException
from sqlmodel import Session, select

from app.crud.course import get_teacher_course_or_404
from app.models import (
    Course,
    Quiz,
    QuizCreate,
    Test,
    TestCreate,
)
from app.models.quiz import QuestionSet


def get_quiz_or_404(session: Session, quiz_id: uuid.UUID) -> Quiz:
    quiz = session.get(Quiz, quiz_id)
    if quiz is None:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz


def get_test_or_404(session: Session, test_id: uuid.UUID) -> Test:
    test = session.get(Test, test_id)
    if test is None:
        raise HTTPException(status_code=404, detail="Test not found")
    return test


def get_teacher_quiz(
    session: Session, course_title: str, teacher_id: uuid.UUID, quiz_id: uuid.UUID
) -> Quiz:
    quiz = session.exec(
        select(Quiz)
        .join(Course, Quiz.course_id == Course.id)  # type: ignore[arg-type]
        .where(
            Course.title == course_title,
            Course.creator_id == teacher_id,
            Quiz.id == quiz_id,
        )
    ).first()
    if quiz is None:
        raise HTTPException(status_code=404, detail="Quiz not found in this course")
    return quiz


def get_teacher_test(
    session: Session, course_title: str, teacher_id: uuid.UUID, test_id: uuid.UUID
) -> Test:
    test = session.exec(
        select(Test)
        .join(Course, Test.course_id == Course.id)  # type: ignore[arg-type]
        .where(
            Course.title == course_title,
            Course.creator_id == teacher_id,
            Test.id == test_id,
        )
    ).first()
    if test is None:
        raise HTTPException(status_code=404, detail="Test not found in this course")
    return test


def get_quizzes_and_tests(
    session: Session, course: Course
) -> tuple[list[Quiz], list[Test]]:
    quizzes = list(session.exec(select(Quiz).where(Quiz.course_id == course.id)).all())
    tests = list(session.exec(select(Test).where(Test.course_id == course.id)).all())
    return quizzes, tests


def create_quiz(
    session: Session, quiz_create: QuizCreate, course_title: str, teacher_id: uuid.UUID
) -> Quiz:
    course = get_teacher_course_or_404(session, course_title, teacher_id)
    question_set = QuestionSet()
    session.add(question_set)
    session.commit()
    session.refresh(question_set)

    quiz = Quiz(
        course_id=course.id,
        title=quiz_create.title,
        total_mark=quiz_create.total_mark,
        question_set_id=question_set.id,
        is_unlimited_attempt=quiz_create.is_unlimited_attempt,
        allowed_attempt=quiz_create.allowed_attempt,
    )
    session.add(quiz)
    session.commit()
    session.refresh(quiz)
    return quiz


def create_test(
    session: Session, test_create: TestCreate, course_title: str, teacher_id: uuid.UUID
) -> Test:
    course = get_teacher_course_or_404(session, course_title, teacher_id)
    if test_create.window_end <= test_create.window_start:
        raise HTTPException(
            status_code=400, detail="window_end must be after window_start"
        )
    question_set = QuestionSet()
    session.add(question_set)
    session.commit()
    session.refresh(question_set)

    test = Test(
        course_id=course.id,
        title=test_create.title,
        total_mark=test_create.total_mark,
        question_set_id=question_set.id,
        duration=test_create.duration,
        window_start=test_create.window_start,
        window_end=test_create.window_end,
    )
    session.add(test)
    session.commit()
    session.refresh(test)
    return test
