from sqlalchemy.orm import Session
from app.models.quiz import Course, Quiz, Question
from app.schemas.quiz import CourseCreate, QuizCreate, QuestionCreate


def create_course(db: Session, course_create: CourseCreate, creator_id: int) -> Course:
    db_obj = Course(
        title=course_create.title,
        description=course_create.description,
        creator_id=creator_id,
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def create_quiz(db: Session, quiz_create: QuizCreate) -> Quiz:
    db_obj = Quiz(
        course_id=quiz_create.course_id,
        title=quiz_create.title,
        description=quiz_create.description,
        tags=quiz_create.tags,
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def create_question(db: Session, question_create: QuestionCreate) -> Question:
    db_obj = Question(
        quiz_id=question_create.quiz_id,
        data=question_create.data,
        tag=question_create.tag,
        reference_image=question_create.reference_image,
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
