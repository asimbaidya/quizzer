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
from app.crud import user_crud
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
        payload = jwt.decode(  # type: ignore
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
            detail="The user doesn't have enough privileges, Teacher Privileges Required",  # noqa: E501
        )
    return current_user


def get_current_active_student(current_user: CurrentUser) -> User:
    if not current_user.role == UserRole.STUDENT:  # type: ignore
        raise HTTPException(
            status_code=403,
            detail="The user doesn't have enough privileges, Student Privileges Required",  # noqa: E501
        )
    return current_user


CurrentAdmin = Annotated[User, Depends(get_current_active_admin)]
CurrentTeacher = Annotated[User, Depends(get_current_active_teacher)]
CurrentStudent = Annotated[User, Depends(get_current_active_student)]
