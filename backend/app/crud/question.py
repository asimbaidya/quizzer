import uuid
from typing import Any

from sqlmodel import Session, select

from app.core.config import settings
from app.crud.quiz import get_teacher_quiz, get_teacher_test
from app.models import Question, QuestionCreate


def image_url(image: str | None) -> str | None:
    return f"{settings.API_V1_STR}/images/show/{image}" if image else None


def _create_question(
    session: Session, question_set_id: uuid.UUID, question_create: QuestionCreate
) -> Question:
    question = Question(
        question_type=question_create.question_type,
        question_data=question_create.question_data.model_dump(),
        tag=question_create.tag,
        total_marks=question_create.total_marks,
        image=question_create.image,
        question_set_id=question_set_id,
    )
    session.add(question)
    session.commit()
    session.refresh(question)
    return question


def create_question_in_quiz(
    session: Session,
    question_create: QuestionCreate,
    course_title: str,
    quiz_id: uuid.UUID,
    teacher_id: uuid.UUID,
) -> Question:
    quiz = get_teacher_quiz(session, course_title, teacher_id, quiz_id)
    return _create_question(session, quiz.question_set_id, question_create)


def create_question_in_test(
    session: Session,
    question_create: QuestionCreate,
    course_title: str,
    test_id: uuid.UUID,
    teacher_id: uuid.UUID,
) -> Question:
    test = get_teacher_test(session, course_title, teacher_id, test_id)
    return _create_question(session, test.question_set_id, question_create)


def _teacher_question_view(question: Question) -> dict[str, Any]:
    return {
        "id": question.id,
        "question_type": question.question_type,
        "question_data": question.question_data,
        "tag": question.tag,
        "total_marks": question.total_marks,
        "image": question.image,
        "image_url": image_url(question.image),
    }


def list_quiz_questions_for_teacher(
    session: Session, course_title: str, quiz_id: uuid.UUID, teacher_id: uuid.UUID
) -> list[dict[str, Any]]:
    quiz = get_teacher_quiz(session, course_title, teacher_id, quiz_id)
    questions = session.exec(
        select(Question).where(Question.question_set_id == quiz.question_set_id)
    ).all()
    return [_teacher_question_view(q) for q in questions]


def list_test_questions_for_teacher(
    session: Session, course_title: str, test_id: uuid.UUID, teacher_id: uuid.UUID
) -> dict[str, Any]:
    test = get_teacher_test(session, course_title, teacher_id, test_id)
    questions = session.exec(
        select(Question).where(Question.question_set_id == test.question_set_id)
    ).all()
    return {
        "questions": [_teacher_question_view(q) for q in questions],
        "test": test,
    }
