import uuid

from fastapi import HTTPException
from sqlmodel import Session, select

from app.models import Course, CourseCreate, Enrollment, User


def get_course_by_title_or_404(session: Session, course_title: str) -> Course:
    course = session.exec(select(Course).where(Course.title == course_title)).first()
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    return course


def get_teacher_course_or_404(
    session: Session, course_title: str, teacher_id: uuid.UUID
) -> Course:
    course = session.exec(
        select(Course).where(
            Course.title == course_title, Course.creator_id == teacher_id
        )
    ).first()
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    return course


def get_courses_by_creator(session: Session, creator_id: uuid.UUID) -> list[Course]:
    return list(
        session.exec(select(Course).where(Course.creator_id == creator_id)).all()
    )


def create_course(
    session: Session, course_create: CourseCreate, teacher_id: uuid.UUID
) -> Course:
    existing = session.exec(
        select(Course).where(Course.title == course_create.title)
    ).first()
    if existing is not None:
        raise HTTPException(
            status_code=400, detail="Course with this title already exists"
        )
    course = Course(
        title=course_create.title,
        description=course_create.description,
        creator_id=teacher_id,
        is_open=course_create.is_open,
        course_pin=course_create.course_pin or _generate_pin(),
    )
    session.add(course)
    session.commit()
    session.refresh(course)
    return course


def get_enrolled_students(
    session: Session, course_title: str, teacher_id: uuid.UUID
) -> list[User]:
    get_teacher_course_or_404(session, course_title, teacher_id)
    return list(
        session.exec(
            select(User)
            .join(Enrollment, Enrollment.student_id == User.id)  # type: ignore[arg-type]
            .join(Course, Enrollment.course_id == Course.id)  # type: ignore[arg-type]
            .where(Course.title == course_title, Course.creator_id == teacher_id)
        ).all()
    )


# ---- Student side ----
def get_enrolled_courses(session: Session, student_id: uuid.UUID) -> list[Course]:
    return list(
        session.exec(
            select(Course)
            .join(Enrollment, Enrollment.course_id == Course.id)  # type: ignore[arg-type]
            .where(Enrollment.student_id == student_id)
        ).all()
    )


def get_enrollment(
    session: Session, course: Course, student_id: uuid.UUID
) -> Enrollment | None:
    return session.exec(
        select(Enrollment).where(
            Enrollment.student_id == student_id, Enrollment.course_id == course.id
        )
    ).first()


def require_enrollment(
    session: Session, course_title: str, student_id: uuid.UUID
) -> tuple[Course, Enrollment]:
    course = get_course_by_title_or_404(session, course_title)
    enrollment = get_enrollment(session, course, student_id)
    if enrollment is None:
        raise HTTPException(
            status_code=404, detail="Student not enrolled in the course"
        )
    return course, enrollment


def enroll_student(
    session: Session, course_title: str, course_pin: str, student_id: uuid.UUID
) -> Enrollment:
    course = get_course_by_title_or_404(session, course_title)
    if get_enrollment(session, course, student_id) is not None:
        raise HTTPException(
            status_code=400, detail="Student already enrolled in the course"
        )
    if course.course_pin != course_pin:
        raise HTTPException(status_code=400, detail="Invalid course pin")
    enrollment = Enrollment(student_id=student_id, course_id=course.id)
    session.add(enrollment)
    session.commit()
    session.refresh(enrollment)
    return enrollment


def _generate_pin() -> str:
    import secrets
    import string

    alphabet = string.ascii_uppercase + string.digits
    return "".join(secrets.choice(alphabet) for _ in range(8))
