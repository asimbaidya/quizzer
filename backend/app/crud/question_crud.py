from sqlalchemy.orm import Session
from app.models.quiz import Question
from app.schemas.question import QuestionCreate


def create_question(db: Session, question_create: QuestionCreate) -> Question:
    db_obj = Question(
        quiz_id=question_create.quiz_id,
        question_data=question_create.question_data.model_dump(),  # type: ignore | here it's guaranteed to be a valid model after validation
        tag=question_create.tag,
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def get_questions_by_quiz_id(db: Session, quiz_id: int) -> list[Question]:
    return db.query(Question).filter(Question.quiz_id == quiz_id).all()
