from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.core import security
from app.core.config import settings
from app.core.db import get_db
from app.crud import teacher_crud, user_crud
from app.models.quiz import Course, Enrollment, Quiz
from app.models.user import User
from app.schemas.user import UserRole
from app.schemas.util import TokenPayload

reusable_oauth2 = OAuth2PasswordBearer(tokenUrl='API/login/access-token')


# this automatically call get_db and return the yielded value
SessionDep = Annotated[Session, Depends(get_db)]

# this automatically extract Bearer token from Authorization header
TokenDep = Annotated[str, Depends(reusable_oauth2)]


def get_current_user(db: SessionDep, token: TokenDep) -> User:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (InvalidTokenError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='Could not validate credentials',
        )
    user = user_crud.get_user_by_email(db, str(token_data.sub))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='User not found with provided credentials',
        )
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


def get_current_active_admin(current_user: CurrentUser) -> User:
    if not current_user.role == UserRole.ADMIN:  # type: ignore
        raise HTTPException(
            status_code=403,
            detail="The user doesn't have enough privileges, Admin Privileges Required",
        )
    return current_user


def get_current_active_teacher(current_user: CurrentUser) -> User:
    if not current_user.role == UserRole.TEACHER:  # type: ignore
        raise HTTPException(
            status_code=403,
            detail="The user doesn't have enough privileges, Teacher Privileges Required",
        )
    return current_user


def get_current_active_student(current_user: CurrentUser) -> User:
    if not current_user.role == UserRole.STUDENT:  # type: ignore
        raise HTTPException(
            status_code=403,
            detail="The user doesn't have enough privileges, Student Privileges Required",
        )
    return current_user


CurrentAdmin = Annotated[User, Depends(get_current_active_admin)]
CurrentTeacher = Annotated[User, Depends(get_current_active_teacher)]
CurrentStudent = Annotated[User, Depends(get_current_active_student)]


def check_course_owner(db: Session, course_title: str, teacher_id: int) -> Course:
    """Check if the course exists and if the teacher is the owner."""
    course = teacher_crud.get_course_by_title(db, course_title)
    if course is None:
        raise HTTPException(status_code=404, detail='Course not found')
    if bool(course.creator_id != teacher_id):
        raise HTTPException(
            status_code=403, detail='You are not authorized to access this course'
        )
    return course


def check_quiz_owner(db: Session, quiz_id: int, course: Course) -> Quiz:
    """Check if the quiz exists and belongs to the specified course."""
    quiz = teacher_crud.get_quiz_by_id(db, quiz_id)
    if quiz is None or bool(quiz.course_id != course.id):
        raise HTTPException(status_code=404, detail='Quiz not found in this course')
    return quiz


def get_course_and_enrollment(course_title: str, student_id: int, db: SessionDep):
    """Get the course and verify student enrollment."""
    course = db.query(Course).filter(Course.title == course_title).first()
    if not course:
        raise HTTPException(status_code=404, detail='Course not found')

    enrollment = (
        db.query(Enrollment)
        .filter(Enrollment.course_id == course.id, Enrollment.student_id == student_id)
        .first()
    )
    if not enrollment:
        raise HTTPException(
            status_code=403, detail='Student is not enrolled in this course'
        )

    return course, enrollment


def get_quiz_and_enrollment(course: Course, quiz_id: int, db: SessionDep):
    """Get the quiz for the course."""
    quiz = (
        db.query(Quiz).filter(Quiz.id == quiz_id, Quiz.course_id == course.id).first()
    )
    if not quiz:
        raise HTTPException(status_code=404, detail='Quiz not found in this course')

    return quiz
