from sqlalchemy.orm import Session
from app.models.quiz import Course
from app.schemas.course import CourseCreate


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


def get_course_creator_id(db: Session, course_id: int) -> int | None:
    course = db.query(Course).filter(Course.id == course_id).first()
    if course is None:
        return None
    return course.creator_id  # type: ignore
