from sqlalchemy.orm import Session

from app.models.quiz import Course, Question, Quiz
from app.schemas.common import CourseCreate, QuizCreate
from app.schemas.question import QuestionTeacherView


def create_course(db: Session, course_create: CourseCreate, creator_id: int) -> Course:
    db_obj = Course(
        title=course_create.title,
        description=course_create.description,
        creator_id=creator_id,
        course_pin=course_create.course_pin,
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)

    return db_obj


def create_quiz(db: Session, quiz_create: QuizCreate, course_id: int) -> Quiz:
    db_obj = Quiz(
        course_id=course_id,
        title=quiz_create.title,
        total_mark=quiz_create.total_mark,
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def create_question(
    db: Session, question_create: QuestionTeacherView, quiz_id: int
) -> Question:
    db_obj = Question(
        quiz_id=quiz_id,
        # below here it's guaranteed to be a valid model after validation
        question_data=question_create.question_data.model_dump(),  # type: ignore
        tag=question_create.tag,
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def get_course_creator_id(db: Session, course_id: int) -> int | None:
    course = db.query(Course).filter(Course.id == course_id).first()
    if course is None:
        return None
    return course.creator_id  # type: ignore


def get_course_by_title(db: Session, course_title: str) -> Course | None:
    return db.query(Course).filter(Course.title == course_title).first()


def get_courses_by_creator_id(db: Session, creator_id: int) -> list[Course]:
    return db.query(Course).filter(Course.creator_id == creator_id).all()


def get_quizzes_by_course_id(db: Session, course_id: int) -> list[Quiz]:
    return db.query(Quiz).filter(Quiz.course_id == course_id).all()


def get_quiz_by_id(db: Session, quiz_id: int) -> Quiz | None:
    return db.query(Quiz).filter(Quiz.id == quiz_id).first()


def get_questions_by_quiz_id(db: Session, quiz_id: int) -> list[Question]:
    return db.query(Question).filter(Question.quiz_id == quiz_id).all()


def get_question_by_id(db: Session, question_id: int) -> Question | None:
    return db.query(Question).filter(Question.id == question_id).first()


def get_enrolled_students(db: Session, course_id: int):
    return 'TODO'


def get_student_progress(db: Session, quiz_id: int):
    return 'TODO'
