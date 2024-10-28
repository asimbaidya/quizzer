from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.quiz import (
    Course,
    Enrollment,
    Question,
    QuestionSet,
    QuestionSubmission,
    Quiz,
)
from app.models.user import User
from app.schemas.common import CourseCreate, QuizCreate
from app.schemas.question import QuestionTeacherView


def get_courses_by_creator_id(db: Session, creator_id: int) -> list[Course]:
    return db.query(Course).filter(Course.creator_id == creator_id).all()


def get_quiz_by_course_title_creator_id(
    db: Session, course_title: str, teacher_id: int
):
    return (
        db.query(Quiz)
        .join(Course)
        .filter(Course.title == course_title, Course.creator_id == teacher_id)
        .all()
    )


def get_enrolled_students(db: Session, course_title: str, teacher_id: int):
    return (
        db.query(User)
        .join(Enrollment)
        .join(Course)
        .filter(course_title == course_title, User.id == teacher_id)
        .all()
    )


def get_questions_by_course_title_quiz_id_teacher_id(
    db: Session, course_title: str, quiz_id: int, teacher_id: int
):
    return (
        db.query(Question)
        .join(target=Quiz)
        .join(Course)
        .join(QuestionSet)
        .filter(
            Course.title == course_title,
            Quiz.id == quiz_id,
            Course.creator_id == teacher_id,
        )
        .all()
    )


def get_student_progress_course_title_quiz_id_teacher_id(
    db: Session, course_title: str, quiz_id: int, teacher_id: int
):
    db.query(QuestionSubmission).join(Question).join(QuestionSet).join(Course).filter(
        Course.title == course_title,
        Quiz.id == quiz_id,
        Course.creator_id == teacher_id,
    ).all()


def create_course_by_teacher_id(
    db: Session, course_create: CourseCreate, teacher_id: int
) -> Course:
    course_instance = Course(
        title=course_create.title,
        description=course_create.description,
        creator_id=teacher_id,
        course_pin=course_create.course_pin,
    )
    db.add(course_instance)
    db.commit()
    db.refresh(course_instance)
    return course_instance


def create_quiz_by_course_title_teacher_id(
    db: Session, quiz_create: QuizCreate, course_title: str, teacher_id: int
) -> Quiz:
    course = get_course_by_title_creator_id(db, course_title, teacher_id)
    if course is None:
        raise HTTPException(status_code=404, detail='Course not found')
    if int(course.creator_id) != teacher_id:
        raise HTTPException(
            status_code=403,
            detail='You are not authorized to create quiz in this course',
        )

    question_set = QuestionSet()
    db.add(question_set)
    db.commit()
    db.refresh(question_set)

    db_instance = Quiz(
        course_id=course.id,
        title=quiz_create.title,
        total_mark=quiz_create.total_mark,
        question_set_id=question_set.id,
    )
    db.add(db_instance)
    db.commit()
    db.refresh(db_instance)
    return db_instance


def create_question_by_course_title_quiz_id_teacher_id(
    db: Session,
    question_create: QuestionTeacherView,
    course_title: str,
    quiz_id: int,
    teacher_id: int,
) -> Question:
    course = get_course_by_title_creator_id(db, course_title, teacher_id)
    if course is None:
        raise HTTPException(status_code=404, detail='Course not found')
    quiz = get_quiz_by_course_title_creator_id_quiz_id(
        db, course_title, teacher_id, quiz_id
    )
    if quiz is None:
        raise HTTPException(status_code=404, detail='Quiz not found in this course')

    question_set = get_question_set_by_quiz_id(db, quiz_id)

    question_instance = Question(
        question_type=question_create.question_type,
        question_data=question_create.question_data.model_dump(),
        tag=question_create.tag,
        question_set_id=question_set.id,
    )

    db.add(question_instance)
    db.commit()
    return question_instance


# helper functions


def get_quiz_by_course_title_creator_id_quiz_id(
    db: Session, course_title: str, teacher_id: int, quiz_id: int
):
    return (
        db.query(Quiz)
        .join(Course)
        .filter(
            Course.title == course_title,
            Course.creator_id == teacher_id,
            Quiz.id == quiz_id,
        )
        .first()
    )


def get_question_set_by_quiz_id(db: Session, quiz_id: int):
    question_set = db.query(QuestionSet).join(Quiz).filter(Quiz.id == quiz_id).first()
    if question_set is None:
        raise HTTPException(status_code=404, detail='Question set not found')
    return question_set


def get_course_by_title_creator_id(db: Session, course_title: str, teacher_id: int):
    course = (
        db.query(Course)
        .filter(Course.title == course_title, Course.creator_id == teacher_id)
        .first()
    )
    if course is None:
        raise HTTPException(status_code=404, detail='Course not found')
    return course
