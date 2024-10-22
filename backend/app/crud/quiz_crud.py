from sqlalchemy.orm import Session
from app.models.quiz import Quiz
from app.schemas.quiz import QuizCreate


def create_quiz(db: Session, quiz_create: QuizCreate) -> Quiz:
    db_obj = Quiz(
        course_id=quiz_create.course_id,
        title=quiz_create.title,
        description=quiz_create.description,
        total_mark=quiz_create.total_mark,
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
