"""Domain models package.

Every table model must be imported here so that ``SQLModel.metadata`` is fully
populated before Alembic autogeneration and app startup. Alembic's ``env.py``
imports ``SQLModel`` from this package for exactly that reason.
"""

from sqlmodel import SQLModel

from app.models.common import (
    Message,
    NewPassword,
    Token,
    TokenPayload,
    get_datetime_utc,
)
from app.models.user import (
    UpdatePassword,
    User,
    UserBase,
    UserCreate,
    UserPublic,
    UserRegister,
    UserRole,
    UsersPublic,
    UserUpdate,
    UserUpdateMe,
)

__all__ = [
    "SQLModel",
    "get_datetime_utc",
    "Message",
    "NewPassword",
    "Token",
    "TokenPayload",
    "UpdatePassword",
    "User",
    "UserBase",
    "UserCreate",
    "UserPublic",
    "UserRegister",
    "UserRole",
    "UsersPublic",
    "UserUpdate",
    "UserUpdateMe",
]
